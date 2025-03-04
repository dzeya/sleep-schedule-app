"use client";

import { useState, FormEvent } from "react";
import { addMinutes, format, parse, getHours, getMinutes, setHours, setMinutes, differenceInMinutes } from "date-fns";
import Link from "next/link";
import { AlarmClock, Baby, Clock, MoonStar, SunMedium, Utensils, Calendar, BedDouble } from 'lucide-react';

export default function Home() {
  const [hour, setHour] = useState("06");
  const [minute, setMinute] = useState("00");
  const [lastFeedingOffset, setLastFeedingOffset] = useState(60); // Default: 60 minutes before bedtime
  const [minWakeBeforeNap1, setMinWakeBeforeNap1] = useState(150); // Default: 2.5 hours (150 min)
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
    totalDayLength: string;
  } | null>(null);
  const [error, setError] = useState("");

  // Constants defined in minutes - updated based on the new requirements
  const NAP1_MIN_DURATION = 45;
  const NAP1_MAX_DURATION = 75;
  const NAP2_MIN_DURATION = 90;
  const NAP2_MAX_DURATION = 120;
  const NAP3_DURATION = 30;

  const MIN_WAKE_BEFORE_NAP1 = 150; // Increased to 2.5 hours (150 min)
  const MAX_WAKE_BEFORE_NAP1 = 180; // Increased to 3 hours (180 min)
  const MIN_WAKE_BEFORE_NAP2 = 150; // 2.5 hours
  const MAX_WAKE_BEFORE_NAP2 = 180; // 3 hours
  const MIN_WAKE_BEFORE_NAP3 = 120; // 2 hours
  const MAX_WAKE_BEFORE_NAP3 = 150; // 2.5 hours
  const MIN_WAKE_BEFORE_BED = 180; // 3 hours
  const MAX_WAKE_BEFORE_BED = 240; // 4 hours

  // Earliest and latest time for third nap to end
  const NAP3_END_EARLIEST = 15 * 60 + 30; // 3:30 PM in minutes from midnight
  const NAP3_END_LATEST = 16 * 60;        // 4:00 PM in minutes from midnight

  // Bedtime window (can be adjusted based on day length)
  const BEDTIME_EARLIEST = 18 * 60; // 18:00 (6:00 PM) in minutes from midnight
  const BEDTIME_LATEST = 20 * 60;   // 20:00 (8:00 PM) in minutes from midnight

  // Target total day length (from wake-up to bedtime)
  const MIN_DAY_LENGTH = 12 * 60;  // 12 hours
  const MAX_DAY_LENGTH = 13 * 60;  // 13 hours

  // Time thresholds for determining if a third nap is needed
  const THIRD_NAP_THRESHOLD = 14 * 60 + 30; // 2:30 PM in minutes from midnight

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

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} minutes`;
    if (mins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} minutes`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // No need to convert to 24-hour, as we're already using it
      let hours = parseInt(hour);
      let minutes = parseInt(minute);
      
      // Set the hours and minutes for today's date
      const today = new Date();
      const wakeUpDateTime = new Date(today);
      wakeUpDateTime.setHours(hours, minutes, 0, 0);
      
      // Convert wake-up time to minutes since midnight
      const wakeUpTimeInMinutes = timeToMinutes(wakeUpDateTime);
      
      // Step 1: Calculate target bedtime based on 12-13 hour day length
      const targetBedtimeEarliest = Math.max(wakeUpTimeInMinutes + MIN_DAY_LENGTH, BEDTIME_EARLIEST);
      const targetBedtimeLatest = Math.min(wakeUpTimeInMinutes + MAX_DAY_LENGTH, BEDTIME_LATEST);
      
      // Step 2: Calculate first nap with longer minimum wake window (2.5-3 hours)
      let firstNapStartMinutes = wakeUpTimeInMinutes + MIN_WAKE_BEFORE_NAP1;
      let firstNapDuration = NAP1_MAX_DURATION; // Use max for initial calculation
      let firstNapEndMinutes = firstNapStartMinutes + firstNapDuration;
      
      // Step 3: Calculate second nap (the main longer nap)
      let secondNapStartMinutes = firstNapEndMinutes + MIN_WAKE_BEFORE_NAP2;
      let secondNapDuration = NAP2_MAX_DURATION; // Use max for initial calculation
      let secondNapEndMinutes = secondNapStartMinutes + secondNapDuration;
      
      // Step 4: Auto-detect if a third nap is needed based on when second nap ends
      let needsThirdNap = secondNapEndMinutes <= THIRD_NAP_THRESHOLD;
      let thirdNapStartMinutes: number | null = null;
      let thirdNapEndMinutes: number | null = null;
      let bedtimeMinutes: number;
      
      if (needsThirdNap) {
        // Calculate third nap times
        thirdNapStartMinutes = secondNapEndMinutes + MIN_WAKE_BEFORE_NAP3;
        thirdNapEndMinutes = thirdNapStartMinutes + NAP3_DURATION;
        
        // Ensure third nap ends by 3:30-4:00 PM
        if (thirdNapEndMinutes > NAP3_END_LATEST) {
          // If third nap would end too late, adjust it backwards
          thirdNapEndMinutes = NAP3_END_LATEST;
          thirdNapStartMinutes = thirdNapEndMinutes - NAP3_DURATION;
          
          // If this makes the wake window after second nap too short, adjust second nap
          if (thirdNapStartMinutes - secondNapEndMinutes < MIN_WAKE_BEFORE_NAP3) {
            secondNapEndMinutes = thirdNapStartMinutes - MIN_WAKE_BEFORE_NAP3;
            secondNapDuration = secondNapEndMinutes - secondNapStartMinutes;
            
            // If second nap becomes too short, adjust its start time
            if (secondNapDuration < NAP2_MIN_DURATION) {
              secondNapDuration = NAP2_MIN_DURATION;
              secondNapStartMinutes = secondNapEndMinutes - secondNapDuration;
              
              // This may require adjusting first nap's end and duration
              if (secondNapStartMinutes - firstNapEndMinutes < MIN_WAKE_BEFORE_NAP2) {
                firstNapEndMinutes = secondNapStartMinutes - MIN_WAKE_BEFORE_NAP2;
                firstNapDuration = firstNapEndMinutes - firstNapStartMinutes;
                
                // If first nap becomes too short, adjust its start time
                if (firstNapDuration < NAP1_MIN_DURATION) {
                  firstNapDuration = NAP1_MIN_DURATION;
                  firstNapStartMinutes = firstNapEndMinutes - firstNapDuration;
                }
              }
            }
          }
        }
        
        // Calculate bedtime based on the third nap's end time
        bedtimeMinutes = thirdNapEndMinutes + MIN_WAKE_BEFORE_BED;
        
        // Ensure bedtime falls within target window
        if (bedtimeMinutes < targetBedtimeEarliest) {
          bedtimeMinutes = targetBedtimeEarliest;
        } else if (bedtimeMinutes > targetBedtimeLatest) {
          // If bedtime would be too late, adjust third nap
          bedtimeMinutes = targetBedtimeLatest;
          
          // Check if the final wake window is reasonable
          const finalWakeWindow = bedtimeMinutes - thirdNapEndMinutes;
          if (finalWakeWindow > MAX_WAKE_BEFORE_BED) {
            // If wake window is too long, might need to adjust earlier naps
            thirdNapEndMinutes = bedtimeMinutes - MAX_WAKE_BEFORE_BED;
            thirdNapStartMinutes = thirdNapEndMinutes - NAP3_DURATION;
          }
        }
      } else {
        // No third nap needed - calculate bedtime directly from second nap end
        bedtimeMinutes = secondNapEndMinutes + MIN_WAKE_BEFORE_BED;
        
        // Adjust if bedtime is outside target range
        if (bedtimeMinutes < targetBedtimeEarliest) {
          // If bedtime would be too early, either:
          // 1. Extend second nap if possible
          if (secondNapDuration < NAP2_MAX_DURATION) {
            const additional = Math.min(
              NAP2_MAX_DURATION - secondNapDuration,
              targetBedtimeEarliest - bedtimeMinutes
            );
            secondNapDuration += additional;
            secondNapEndMinutes += additional;
            bedtimeMinutes += additional;
          }
          
          // 2. If still too early, extend the wake window
          if (bedtimeMinutes < targetBedtimeEarliest) {
            bedtimeMinutes = targetBedtimeEarliest;
          }
        } else if (bedtimeMinutes > targetBedtimeLatest) {
          // If bedtime would be too late, we may need to:
          // 1. Shorten second nap if possible
          if (secondNapDuration > NAP2_MIN_DURATION) {
            const reduction = Math.min(
              secondNapDuration - NAP2_MIN_DURATION,
              bedtimeMinutes - targetBedtimeLatest
            );
            secondNapDuration -= reduction;
            secondNapEndMinutes -= reduction;
            bedtimeMinutes -= reduction;
          }
          
          // 2. If still too late, use the latest acceptable bedtime
          if (bedtimeMinutes > targetBedtimeLatest) {
            bedtimeMinutes = targetBedtimeLatest;
          }
        }
        
        // Now check if the wake window is too long without a third nap
        const finalWakeWindow = bedtimeMinutes - secondNapEndMinutes;
        if (finalWakeWindow > MAX_WAKE_BEFORE_BED) {
          // If the wake window is too long, reconsider adding a third nap
          const potentialThirdNapStartMinutes = secondNapEndMinutes + MIN_WAKE_BEFORE_NAP3;
          const potentialThirdNapEndMinutes = potentialThirdNapStartMinutes + NAP3_DURATION;
          
          // Only add the third nap if it can end before our threshold and still allow a reasonable wake window before bed
          if (potentialThirdNapEndMinutes <= NAP3_END_LATEST && 
              bedtimeMinutes - potentialThirdNapEndMinutes >= MIN_WAKE_BEFORE_BED) {
            needsThirdNap = true;
            thirdNapStartMinutes = potentialThirdNapStartMinutes;
            thirdNapEndMinutes = potentialThirdNapEndMinutes;
          }
        }
      }
      
      // Calculate last feeding time (default 60 minutes before bedtime, but configurable)
      const lastFeedingMinutes = bedtimeMinutes - lastFeedingOffset;
      
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
      if (needsThirdNap && thirdNapStartMinutes !== null && thirdNapEndMinutes !== null) {
        thirdNapStart = minutesToDate(thirdNapStartMinutes);
        thirdNapEnd = minutesToDate(thirdNapEndMinutes);
      }
      
      // Calculate total day length
      const totalDayLengthMinutes = bedtimeMinutes - wakeUpTimeInMinutes;
      
      setSchedule({
        wakeUpTime: format(wakeUpDateTime, "HH:mm"),
        firstNapStart: format(firstNapStart, "HH:mm"),
        firstNapEnd: format(firstNapEnd, "HH:mm"),
        secondNapStart: format(secondNapStart, "HH:mm"),
        secondNapEnd: format(secondNapEnd, "HH:mm"),
        thirdNapStart: thirdNapStart ? format(thirdNapStart, "HH:mm") : null,
        thirdNapEnd: thirdNapEnd ? format(thirdNapEnd, "HH:mm") : null,
        needsThirdNap,
        lastFeeding: format(lastFeeding, "HH:mm"),
        bedtime: format(bedtime, "HH:mm"),
        totalDayLength: formatDuration(totalDayLengthMinutes),
      });
    } catch (err) {
      setError("An error occurred while calculating the schedule");
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Background pattern elements */}
      <div className="absolute inset-0 overflow-hidden z-0 opacity-30">
        <div className="absolute top-12 left-10 w-56 h-56 rounded-full bg-amber-200 mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-48 right-20 w-48 h-48 rounded-full bg-blue-200 mix-blend-multiply filter blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-indigo-200 mix-blend-multiply filter blur-xl animate-float-slow"></div>
        
        {/* Star patterns */}
        <div className="absolute h-2 w-2 bg-white rounded-full top-40 left-20 animate-pulse-slow"></div>
        <div className="absolute h-1.5 w-1.5 bg-white rounded-full top-80 left-40 animate-pulse-slower"></div>
        <div className="absolute h-2 w-2 bg-white rounded-full top-60 right-40 animate-pulse-slow"></div>
        <div className="absolute h-1.5 w-1.5 bg-white rounded-full top-32 right-96 animate-pulse-slower"></div>
        <div className="absolute h-2 w-2 bg-white rounded-full bottom-36 right-72 animate-pulse-slow"></div>
        <div className="absolute h-1.5 w-1.5 bg-white rounded-full bottom-72 left-96 animate-pulse-slower"></div>
        
        {/* Cloud shapes */}
        <svg className="absolute top-20 right-1/4 h-20 w-20 text-blue-100 opacity-70 animate-drift-slow" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 9.5a5 5 0 0 1 9.7-1.5A3.5 3.5 0 1 1 18.5 15h-13A4 4 0 0 1 4.5 9.5z" />
        </svg>
        <svg className="absolute top-96 left-1/3 h-16 w-16 text-indigo-100 opacity-70 animate-drift" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 9.5a5 5 0 0 1 9.7-1.5A3.5 3.5 0 1 1 18.5 15h-13A4 4 0 0 1 4.5 9.5z" />
        </svg>
        <svg className="absolute bottom-32 right-1/3 h-14 w-14 text-blue-100 opacity-70 animate-drift-slow-reverse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 9.5a5 5 0 0 1 9.7-1.5A3.5 3.5 0 1 1 18.5 15h-13A4 4 0 0 1 4.5 9.5z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 flex items-center">
              <span className="relative mr-3 p-2 bg-indigo-100 rounded-full shadow-inner overflow-hidden group">
                <Baby className="h-8 w-8 text-indigo-600 relative z-10 animate-pulse-slow" />
                <span className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-indigo-200 to-blue-100 opacity-70 group-hover:opacity-100 transition-opacity"></span>
              </span>
              Baby Sleep Schedule Builder
            </h1>
            <Link 
              href="/research" 
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors text-sm bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:shadow-md border border-white/50"
            >
              <Calendar className="h-4 w-4" />
              Research Article
            </Link>
          </div>
        </header>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
              <span className="mr-3 inline-block bg-white/20 p-2 rounded-full shadow-inner">
                <AlarmClock className="h-6 w-6" />
              </span>
              Sleep and Feeding Schedule Controller
            </h2>
            <p className="text-indigo-100">
              Enter your child&apos;s wake-up time, and we&apos;ll generate an optimized sleep and feeding schedule.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Wake-up Time panel - dominant element */}
            <div className="mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center mb-6">
                  <SunMedium className="mr-3 h-6 w-6 text-amber-500" />
                  <span className="text-xl font-medium text-gray-800">Wake-up Time</span>
                </div>
                
                <div className="flex gap-3 mb-5">
                  <div className="relative">
                    <select
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                      className="appearance-none bg-gray-100 text-gray-800 py-2 px-4 pr-8 rounded-md font-medium text-lg min-w-[70px] border border-gray-200"
                    >
                      {[...Array(24)].map((_, i) => (
                        <option key={i} value={String(i).padStart(2, '0')}>
                          {String(i).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                      className="appearance-none bg-gray-100 text-gray-800 py-2 px-4 pr-8 rounded-md font-medium text-lg min-w-[70px] border border-gray-200"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={String(i * 5).padStart(2, '0')}>
                          {String(i * 5).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600">Select the time your child usually wakes up (24-hour format)</p>
              </div>
            </div>
            
            {/* Optional settings section */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Last Feeding Timing panel - optional */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Utensils className="mr-2 h-5 w-5 text-emerald-500" />
                    <span className="text-lg font-medium text-gray-700">Last Feeding Timing</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">Optional</span>
                </div>
                
                <select
                  value={lastFeedingOffset}
                  onChange={(e) => setLastFeedingOffset(parseInt(e.target.value))}
                  className="w-full bg-gray-100 border border-gray-200 text-gray-700 rounded-md px-2 py-1 mb-3"
                >
                  <option value="30">30 minutes before bedtime</option>
                  <option value="45">45 minutes before bedtime</option>
                  <option value="60">60 minutes before bedtime</option>
                  <option value="75">75 minutes before bedtime</option>
                  <option value="90">90 minutes before bedtime</option>
                </select>
                
                <p className="text-sm text-gray-600">Timing for the last feeding before bedtime</p>
              </div>

              {/* First Nap Wake Window panel - optional */}
              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    <span className="text-lg font-medium text-gray-700">First Nap Wake Window</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">Optional</span>
                </div>
                
                <select
                  value={minWakeBeforeNap1}
                  onChange={(e) => setMinWakeBeforeNap1(parseInt(e.target.value))}
                  className="w-full bg-gray-100 border border-gray-200 text-gray-700 rounded-md px-2 py-1 mb-3"
                >
                  <option value="120">2 hours (120 minutes)</option>
                  <option value="135">2.25 hours (135 minutes)</option>
                  <option value="150">2.5 hours (recommended)</option>
                  <option value="165">2.75 hours (165 minutes)</option>
                  <option value="180">3 hours (180 minutes)</option>
                </select>
                
                <p className="text-sm text-gray-600">Longer wake windows help with early rising</p>
              </div>
            </div>
            
            {/* Calculate Schedule button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl py-4 flex items-center justify-center"
            >
              <Clock className="mr-2 h-5 w-5" />
              Calculate Schedule
            </button>
          </form>
        </div>

        {error && (
          <div className="my-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {schedule && (
          <div className="my-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <BedDouble className="mr-3 h-6 w-6" />
                Your Child&apos;s Daily Schedule (Guideline)
              </h2>
              <p className="text-indigo-100 text-sm">
                This schedule can be adjusted ±15 minutes based on your baby&apos;s cues and energy levels.
              </p>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 relative overflow-hidden border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-md group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <SunMedium className="mr-2 h-5 w-5 text-amber-500" />
                        Wake-up Time
                      </h3>
                      <p className="text-3xl font-bold text-indigo-800 mt-2">{schedule.wakeUpTime}</p>
                    </div>
                    <div className="bg-blue-100 rounded-full p-2 h-12 w-12 flex items-center justify-center shadow-sm">
                      <span className="font-bold text-blue-800 text-xs">{schedule.totalDayLength}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Total day length: {schedule.totalDayLength}</p>
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <SunMedium className="h-24 w-24 text-amber-500" />
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-6 relative overflow-hidden border border-indigo-100 shadow-sm transition-all duration-300 hover:shadow-md group">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    First Nap
                  </h3>
                  <p className="text-3xl font-bold text-indigo-800 mt-2">
                    {schedule.firstNapStart} - {schedule.firstNapEnd}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Duration: {NAP1_MIN_DURATION}-{NAP1_MAX_DURATION} minutes
                  </p>
                  <p className="text-sm text-indigo-600 mt-1">
                    First wake window: {formatDuration(minWakeBeforeNap1)} after wake-up
                  </p>
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MoonStar className="h-24 w-24 text-indigo-500" />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 relative overflow-hidden border border-purple-100 shadow-sm transition-all duration-300 hover:shadow-md group">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-purple-500" />
                    Second Nap
                  </h3>
                  <p className="text-3xl font-bold text-indigo-800 mt-2">
                    {schedule.secondNapStart} - {schedule.secondNapEnd}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Main nap duration: {NAP2_MIN_DURATION}-{NAP2_MAX_DURATION} minutes
                  </p>
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MoonStar className="h-24 w-24 text-purple-500" />
                  </div>
                </div>

                {schedule.needsThirdNap && schedule.thirdNapStart && schedule.thirdNapEnd ? (
                  <div className="bg-pink-50 rounded-xl p-6 relative overflow-hidden border border-pink-100 shadow-sm transition-all duration-300 hover:shadow-md group">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-pink-500" />
                      Third Nap
                    </h3>
                    <p className="text-3xl font-bold text-indigo-800 mt-2">
                      {schedule.thirdNapStart} - {schedule.thirdNapEnd}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Short power nap: {NAP3_DURATION} minutes
                    </p>
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <MoonStar className="h-24 w-24 text-pink-500" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 relative overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md group">
                    <h3 className="text-lg font-medium text-gray-700 flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-gray-500" />
                      Third Nap
                    </h3>
                    <p className="text-2xl font-bold text-gray-500 mt-2">Not Needed</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Second nap ends late enough for appropriate bedtime
                    </p>
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <MoonStar className="h-24 w-24 text-gray-300" />
                    </div>
                  </div>
                )}

                <div className="bg-emerald-50 rounded-xl p-6 relative overflow-hidden border border-emerald-100 shadow-sm transition-all duration-300 hover:shadow-md group">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Utensils className="mr-2 h-5 w-5 text-emerald-500" />
                    Last Feeding
                  </h3>
                  <p className="text-3xl font-bold text-indigo-800 mt-2">{schedule.lastFeeding}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {lastFeedingOffset} minutes before bedtime
                  </p>
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Utensils className="h-24 w-24 text-emerald-500" />
                  </div>
                </div>

                <div className="bg-indigo-100 rounded-xl p-6 relative overflow-hidden border border-indigo-200 shadow-sm transition-all duration-300 hover:shadow-md group">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <MoonStar className="mr-2 h-5 w-5 text-indigo-700" />
                    Bedtime
                  </h3>
                  <p className="text-3xl font-bold text-indigo-800 mt-2">{schedule.bedtime}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Last wake window: {formatDuration(MIN_WAKE_BEFORE_BED)}-{formatDuration(MAX_WAKE_BEFORE_BED)}
                  </p>
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MoonStar className="h-24 w-24 text-indigo-700" />
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-amber-50 rounded-xl p-6 border border-amber-100 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Tips for Success
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-amber-200 rounded-full p-1 mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-800" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Watch for sleepy cues: yawning, rubbing eyes, becoming fussy.
                  </li>
                  <li className="flex items-start">
                    <span className="bg-amber-200 rounded-full p-1 mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-800" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Establish a consistent pre-nap and bedtime routine.
                  </li>
                  <li className="flex items-start">
                    <span className="bg-amber-200 rounded-full p-1 mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-800" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Adjust wake windows based on how your baby responds.
                  </li>
                  <li className="flex items-start">
                    <span className="bg-amber-200 rounded-full p-1 mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-800" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Ensure a dark, quiet sleep environment for optimal rest.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-600 text-sm bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-sm">
          <p>© {new Date().getFullYear()} Baby Sleep Schedule Builder. All rights reserved.</p>
          <p className="mt-1">Designed to help parents optimize their baby&apos;s sleep patterns.</p>
        </footer>
      </div>
    </main>
  );
}
