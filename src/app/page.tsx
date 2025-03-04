"use client";

import { useState, FormEvent } from "react";
import { addMinutes, format, parse, getHours, getMinutes, setHours, setMinutes } from "date-fns";

export default function Home() {
  const [hour, setHour] = useState("06");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  const [schedule, setSchedule] = useState<{
    wakeUpTime: string;
    firstNapStart: string;
    firstNapEnd: string;
    secondNapStart: string;
    secondNapEnd: string;
    thirdNapStart: string | null;
    thirdNapEnd: string | null;
    needsThirdNap: boolean;
    lastFeeding: string;
    bedtime: string;
  } | null>(null);
  const [error, setError] = useState("");

  // Constants defined in minutes
  const NAP1_MIN_DURATION = 40;
  const NAP1_MAX_DURATION = 60;
  const NAP2_MIN_DURATION = 90;
  const NAP2_MAX_DURATION = 120;
  const NAP3_DURATION = 30;

  const MIN_WAKE_BEFORE_NAP1 = 120; // 2 hours
  const MAX_WAKE_BEFORE_NAP1 = 150; // 2.5 hours
  const MIN_WAKE_BEFORE_NAP2 = 120; // 2 hours
  const MAX_WAKE_BEFORE_NAP2 = 150; // 2.5 hours
  const MIN_WAKE_BEFORE_NAP3 = 120; // 2 hours
  const MAX_WAKE_BEFORE_NAP3 = 150; // 2.5 hours
  const MIN_WAKE_BEFORE_BED = 180; // 3 hours
  const MAX_WAKE_BEFORE_BED = 240; // 4 hours

  const BEDTIME_EARLIEST = 18 * 60; // 18:00 (6:00 PM) in minutes from midnight
  const BEDTIME_LATEST = 20 * 60;   // 20:00 (8:00 PM) in minutes from midnight

  // Helper functions for time conversion
  const timeToMinutes = (date: Date): number => {
    return getHours(date) * 60 + getMinutes(date);
  };

  const minutesToDate = (totalMinutes: number): Date => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const date = new Date();
    return setMinutes(setHours(date, hours), minutes);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Convert 12-hour format to 24-hour format if needed
      let hours = parseInt(hour);
      if (period === "PM" && hours < 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }
      
      // Parse the wake-up time into a Date object
      const today = new Date();
      const minutes = parseInt(minute);
      
      // Set the hours and minutes for today's date
      const wakeUpDateTime = new Date(today);
      wakeUpDateTime.setHours(hours, minutes, 0, 0);
      
      // Convert wake-up time to minutes since midnight
      const wakeUpTimeInMinutes = timeToMinutes(wakeUpDateTime);
      
      // Step 1: Start with calculating first nap
      let firstNapStartMinutes = wakeUpTimeInMinutes + MIN_WAKE_BEFORE_NAP1;
      let firstNapDuration = NAP1_MIN_DURATION;
      let firstNapEndMinutes = firstNapStartMinutes + firstNapDuration;
      
      // Step 2: Calculate second nap
      let secondNapStartMinutes = firstNapEndMinutes + MIN_WAKE_BEFORE_NAP2;
      let secondNapDuration = NAP2_MIN_DURATION;
      let secondNapEndMinutes = secondNapStartMinutes + secondNapDuration;
      
      // Step 3: Calculate potential bedtime without third nap
      let potentialBedtimeMinutes = secondNapEndMinutes + MIN_WAKE_BEFORE_BED;
      
      // Step 4: Determine if a third nap is needed based on gap to earliest bedtime
      let thirdNapStartMinutes = null;
      let thirdNapEndMinutes = null;
      let needsThirdNap = false;
      
      if (potentialBedtimeMinutes < BEDTIME_EARLIEST) {
        // There's too much time between second nap end and earliest bedtime
        const gapToBedtime = BEDTIME_EARLIEST - secondNapEndMinutes;
        
        if (gapToBedtime > MAX_WAKE_BEFORE_BED) {
          // Gap is too large, we need a third nap
          needsThirdNap = true;
          thirdNapStartMinutes = secondNapEndMinutes + MIN_WAKE_BEFORE_NAP3;
          thirdNapEndMinutes = thirdNapStartMinutes + NAP3_DURATION;
          potentialBedtimeMinutes = thirdNapEndMinutes + MIN_WAKE_BEFORE_BED;
        } else {
          // Gap is manageable, adjust bedtime to BEDTIME_EARLIEST
          potentialBedtimeMinutes = BEDTIME_EARLIEST;
        }
      } else if (potentialBedtimeMinutes > BEDTIME_LATEST) {
        // Bedtime is too late, we need to adjust earlier naps
        
        // Try adjusting the first nap to start earlier if possible
        if (firstNapStartMinutes > wakeUpTimeInMinutes + MIN_WAKE_BEFORE_NAP1) {
          // We can move first nap earlier
          firstNapStartMinutes = wakeUpTimeInMinutes + MIN_WAKE_BEFORE_NAP1;
          firstNapEndMinutes = firstNapStartMinutes + firstNapDuration;
          
          // Recalculate second nap
          secondNapStartMinutes = firstNapEndMinutes + MIN_WAKE_BEFORE_NAP2;
          secondNapEndMinutes = secondNapStartMinutes + secondNapDuration;
          
          // Recalculate bedtime
          potentialBedtimeMinutes = secondNapEndMinutes + MIN_WAKE_BEFORE_BED;
        }
        
        // If bedtime is still too late, try shortening naps
        if (potentialBedtimeMinutes > BEDTIME_LATEST) {
          // Shorten second nap if possible
          if (secondNapDuration > NAP2_MIN_DURATION) {
            secondNapDuration = NAP2_MIN_DURATION;
            secondNapEndMinutes = secondNapStartMinutes + secondNapDuration;
            potentialBedtimeMinutes = secondNapEndMinutes + MIN_WAKE_BEFORE_BED;
          }
          
          // If still too late, use the latest acceptable bedtime
          if (potentialBedtimeMinutes > BEDTIME_LATEST) {
            potentialBedtimeMinutes = BEDTIME_LATEST;
          }
        }
      }
      
      // Final bedtime calculation
      const bedtimeMinutes = Math.max(
        Math.min(potentialBedtimeMinutes, BEDTIME_LATEST),
        BEDTIME_EARLIEST
      );
      
      // Calculate last feeding (1 hour before bedtime)
      const lastFeedingMinutes = bedtimeMinutes - 60;
      
      // Convert all times from minutes to Date objects
      const firstNapStart = minutesToDate(firstNapStartMinutes);
      const firstNapEnd = minutesToDate(firstNapEndMinutes);
      const secondNapStart = minutesToDate(secondNapStartMinutes);
      const secondNapEnd = minutesToDate(secondNapEndMinutes);
      const bedtime = minutesToDate(bedtimeMinutes);
      const lastFeeding = minutesToDate(lastFeedingMinutes);
      
      // Only set third nap times if needed
      let thirdNapStart = null;
      let thirdNapEnd = null;
      if (needsThirdNap && thirdNapStartMinutes && thirdNapEndMinutes) {
        thirdNapStart = minutesToDate(thirdNapStartMinutes);
        thirdNapEnd = minutesToDate(thirdNapEndMinutes);
      }
      
      setSchedule({
        wakeUpTime: format(wakeUpDateTime, "h:mm a"),
        firstNapStart: format(firstNapStart, "h:mm a"),
        firstNapEnd: format(firstNapEnd, "h:mm a"),
        secondNapStart: format(secondNapStart, "h:mm a"),
        secondNapEnd: format(secondNapEnd, "h:mm a"),
        thirdNapStart: thirdNapStart ? format(thirdNapStart, "h:mm a") : null,
        thirdNapEnd: thirdNapEnd ? format(thirdNapEnd, "h:mm a") : null,
        needsThirdNap,
        lastFeeding: format(lastFeeding, "h:mm a"),
        bedtime: format(bedtime, "h:mm a"),
      });
    } catch (err) {
      setError("An error occurred while calculating the schedule");
      console.error(err);
    }
  };

  // Generate hours for dropdown
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hourVal = i + 1;
    return hourVal < 10 ? `0${hourVal}` : `${hourVal}`;
  });

  // Generate minutes for dropdown
  const minutes = Array.from({ length: 60 }, (_, i) => {
    return i < 10 ? `0${i}` : `${i}`;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold text-center">
              Sleep and Feeding Schedule Controller
            </h1>
            <p className="text-blue-100 text-center mt-2 max-w-2xl mx-auto">
              Enter your child&apos;s wake-up time, and we&apos;ll generate an optimized sleep and feeding schedule.
            </p>
          </div>
          
          {/* Form Section */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="mb-6">
                <label htmlFor="wakeUpTime" className="block text-lg font-medium text-gray-800 mb-3">
                  Wake-up Time
                </label>
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Hour Dropdown */}
                  <div className="w-28">
                    <label htmlFor="hour" className="sr-only">Hour</label>
                    <select
                      id="hour"
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg"
                    >
                      {hours.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <span className="text-2xl font-medium text-gray-700">:</span>
                  
                  {/* Minute Dropdown */}
                  <div className="w-28">
                    <label htmlFor="minute" className="sr-only">Minute</label>
                    <select
                      id="minute"
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg"
                    >
                      {minutes.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* AM/PM Dropdown */}
                  <div className="w-28">
                    <label htmlFor="period" className="sr-only">AM/PM</label>
                    <select
                      id="period"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-medium text-lg rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Calculate Schedule
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Select the time your child usually wakes up
                </p>
                {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
              </div>
            </form>

            {/* Schedule Results */}
            {schedule && (
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Child&apos;s Daily Schedule</h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-gradient-to-br from-sky-50 to-blue-100 p-5 rounded-lg border-l-4 border-blue-500 shadow-sm">
                    <h3 className="text-lg font-semibold text-blue-800">Wake-up Time</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{schedule.wakeUpTime}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                    <h3 className="text-lg font-semibold text-indigo-800">First Nap</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {schedule.firstNapStart} - {schedule.firstNapEnd}
                    </p>
                    <p className="text-sm font-medium text-indigo-700 mt-1">Duration: 40-60 minutes</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border-l-4 border-purple-500 shadow-sm">
                    <h3 className="text-lg font-semibold text-purple-800">Second Nap</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {schedule.secondNapStart} - {schedule.secondNapEnd}
                    </p>
                    <p className="text-sm font-medium text-purple-700 mt-1">Duration: 90-120 minutes</p>
                  </div>
                  
                  {schedule.needsThirdNap && schedule.thirdNapStart && schedule.thirdNapEnd ? (
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-lg border-l-4 border-pink-500 shadow-sm">
                      <h3 className="text-lg font-semibold text-pink-800">Third Nap</h3>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {schedule.thirdNapStart} - {schedule.thirdNapEnd}
                      </p>
                      <p className="text-sm font-medium text-pink-700 mt-1">Duration: 30 minutes</p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg border-l-4 border-gray-300 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-800">Third Nap</h3>
                      <p className="text-xl font-bold text-gray-500 mt-2">Not Needed</p>
                      <p className="text-sm font-medium text-gray-500 mt-1">Gap to bedtime is manageable</p>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-lg border-l-4 border-amber-500 shadow-sm">
                    <h3 className="text-lg font-semibold text-amber-800">Last Feeding</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{schedule.lastFeeding}</p>
                    <p className="text-sm font-medium text-amber-700 mt-1">1 hour before bedtime</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border-l-4 border-blue-500 shadow-sm">
                    <h3 className="text-lg font-semibold text-blue-800">Bedtime</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{schedule.bedtime}</p>
                    <p className="text-sm font-medium text-blue-700 mt-1">Target: 6:00 PM - 8:00 PM</p>
                  </div>
                </div>
                
                {/* Information Box */}
                <div className="mt-8 bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">How This Schedule Works</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-blue-500 mt-1 mr-2 flex-shrink-0"></span>
                        <span>First nap starts 2-2.5 hours after wake-up time</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-purple-500 mt-1 mr-2 flex-shrink-0"></span>
                        <span>Second nap starts 2-2.5 hours after first nap ends</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-pink-500 mt-1 mr-2 flex-shrink-0"></span>
                        <span>Third nap is scheduled only if needed based on gap to bedtime</span>
                      </li>
                    </ul>
                    <ul className="text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-amber-500 mt-1 mr-2 flex-shrink-0"></span>
                        <span>Last feeding is scheduled 1 hour before bedtime</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-blue-500 mt-1 mr-2 flex-shrink-0"></span>
                        <span>Bedtime is dynamically calculated to fall between 6:00 PM - 8:00 PM</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-4 h-4 rounded-full bg-green-500 mt-1 mr-2 flex-shrink-0"></span>
                        <span>Nap durations and wake windows are adjusted to ensure a balanced schedule</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <footer className="text-center text-gray-600 text-sm py-4">
          <p>Designed for parents of infants (7-8 months) to optimize sleep and feeding schedules.</p>
        </footer>
      </div>
    </main>
  );
}
