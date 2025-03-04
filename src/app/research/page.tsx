"use client";

import Link from 'next/link';
import ResearchNav from '../components/ResearchNav';
import { useState } from 'react';

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<string>("common-problems");

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Schedule Builder
          </Link>
        </div>
        
        {/* Top navigation tabs for mobile */}
        <div className="md:hidden mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button 
              onClick={() => scrollToSection("common-problems")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "common-problems" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"}`}
            >
              1. Problems
            </button>
            <button 
              onClick={() => scrollToSection("recommended-adjustments")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "recommended-adjustments" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"}`}
            >
              2. Adjustments
            </button>
            <button 
              onClick={() => scrollToSection("implementation")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "implementation" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"}`}
            >
              3. Implementation
            </button>
            <button 
              onClick={() => scrollToSection("conclusion")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "conclusion" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"}`}
            >
              4. Conclusion
            </button>
          </div>
        </div>
        
        <div className="lg:flex lg:gap-8">
          <ResearchNav />
          
          <main className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto prose prose-blue lg:prose-lg">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8" id="top">How to Solve Early Morning Waking at 7–8 Months: Key Insights & Strategies</h1>
            
            <section>
              <h2 className="flex items-center text-2xl font-semibold text-gray-800 mt-8 mb-6 pb-2 border-b-2 border-blue-200" id="common-problems">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3 font-bold">1</span>
                Common Problems in the Current Sleep Routine
              </h2>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-md">
                <p className="text-blue-800 font-medium">
                  At 7-8 months, babies need approximately 14 hours of total sleep daily. 
                  Understanding what disrupts this pattern is the first step to solving early waking issues.
                </p>
              </div>
              
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="early-rising">
                <span className="text-3xl mr-2">🌅</span> A. Early Rising as a Sign of Sleep Imbalance
              </h3>
              <ul className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-blue-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-red-100 text-red-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">!</span>
                  <div>
                    <strong className="text-gray-900">Waking before 6:00 AM</strong> usually indicates an issue with the schedule.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-blue-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">Z</span>
                  <div>
                    At <strong className="text-gray-900">7–8 months</strong>, babies typically need around <strong className="text-gray-900">14 total hours of sleep</strong> (10–11 hours at night and 3–4 hours during the day).
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-blue-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">↻</span>
                  <div>
                    Chronically short night sleep (~8.5–9.5 hours) can lead to <strong className="text-gray-900">overtiredness</strong>, which ironically causes <strong className="text-gray-900">even earlier</strong> wakeups due to elevated cortisol levels in the early morning.
                  </div>
                </li>
              </ul>
              
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="inconsistent-sleep">
                <span className="text-3xl mr-2">⏰</span> B. Inconsistent or Misdirected Daytime Sleep
              </h3>
              <ul className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-purple-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">1</span>
                  <div>
                    <strong className="text-gray-900">First Nap Too Early</strong>: If the first nap starts soon after a 5:00 AM wakeup (e.g., 7:30), the baby treats it like an extension of night sleep, reinforcing early rising.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-purple-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">3</span>
                  <div>
                    <strong className="text-gray-900">Late or Overly Long Third Nap</strong>: After 6–7 months, a long nap late in the afternoon (past ~4:00 PM) can reduce the need for night sleep and trigger earlier morning wake‐ups.
                  </div>
                </li>
              </ul>
              
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="night-feedings">
                <span className="text-3xl mr-2">🍼</span> C. Night Feedings and Sleep Associations
              </h3>
              <ul className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-amber-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">🕒</span>
                  <div>
                    <strong className="text-gray-900">Multiple Night Feedings</strong>: By 7.5 months, many babies no longer need frequent nocturnal feeds. Habitual feedings at 1–3 AM and around 5 AM can encourage waking at those times.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-amber-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">🍼</span>
                  <div>
                    <strong className="text-gray-900">Associations (Bottle, Pacifier)</strong>: Falling asleep only with a bottle or pacifier means the baby relies on that "prop" to return to sleep when they wake in the lighter early‐morning hours.
                  </div>
                </li>
              </ul>
              
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="environmental-factors">
                <span className="text-3xl mr-2">🌙</span> D. Environmental or Physiological Factors
              </h3>
              <ul className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-green-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">☀️</span>
                  <div>
                    <strong className="text-gray-900">Light and Noise</strong>: Between 4–6 AM, melatonin levels drop, so even small amounts of light or a slight noise can fully wake a baby.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-green-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">🧠</span>
                  <div>
                    <strong className="text-gray-900">Motor Development</strong>: Around 7–8 months, babies practice turning, rolling, crawling—sometimes waking themselves up.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-green-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">🦷</span>
                  <div>
                    <strong className="text-gray-900">Teething Discomfort</strong>: Cutting teeth can worsen early‐morning restlessness.
                  </div>
                </li>
              </ul>
            </section>
            
            <hr className="my-10 border-dashed border-blue-200" />
            
            <section>
              <h2 className="flex items-center text-2xl font-semibold text-gray-800 mt-8 mb-6 pb-2 border-b-2 border-blue-200" id="recommended-adjustments">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3 font-bold">2</span>
                Recommended Adjustments to the Sleep Schedule
              </h2>
              
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 rounded-r-md">
                <p className="text-purple-800 font-medium">
                  Making the right adjustments to your baby's sleep schedule can dramatically improve their morning wake time.
                  These evidence-based strategies have helped thousands of parents.
                </p>
              </div>
              
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="balance-sleep">
                <span className="text-3xl mr-2">⚖️</span> A. Balance Total Sleep
              </h3>
              <ul className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-indigo-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">14</span>
                  <div>
                    Aim for <strong className="text-gray-900">~14 hours total</strong> in 24 hours (10–11 at night, 3–4 during the day).
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-indigo-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">↔️</span>
                  <div>
                    <strong className="text-gray-900">If</strong> the baby's current night sleep is only 9 hours, gradually shift more sleep to nighttime by <strong className="text-gray-900">shortening overly long naps</strong> or <strong className="text-gray-900">putting baby to bed a bit earlier</strong> (but not so early that they wake at 4:00 AM).
                  </div>
                </li>
              </ul>
              
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="rethink-naps">
                <span className="text-3xl mr-2">😴</span> B. Rethink Nap Times and Durations
              </h3>
              <ol className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-blue-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">1</span>
                  <div>
                    <strong className="text-gray-900">First Nap</strong>: Don't start it too soon after an early wakeup. Ideally, <strong className="text-gray-900">not before 8:00 AM</strong> at 7–8 months. This helps break the habit of extending night sleep into the morning.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-blue-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">2</span>
                  <div>
                    <strong className="text-gray-900">Second Nap</strong>: Typically the "main" or longest daytime nap (1.5–2 hours).
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-blue-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">3</span>
                  <div>
                    <strong className="text-gray-900">Third Nap</strong>: After 6–7 months, this nap should be <strong className="text-gray-900">short</strong> (30–45 min) and end by ~3:30 PM–4:00 PM. If the baby resists it or it pushes bedtime too late, consider transitioning to <strong className="text-gray-900">two naps</strong> instead.
                  </div>
                </li>
              </ol>
              
              {/* Continue with the rest of the sections in the same style */}
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="reduce-feedings">
                <span className="text-3xl mr-2">🥛</span> C. Gradually Reduce Night Feedings
              </h3>
              <ul className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-teal-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">⏱️</span>
                  <div>
                    Many babies can go <strong className="text-gray-900">6–8 hours without eating</strong> at this age.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-teal-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">5</span>
                  <div>
                    <strong className="text-gray-900">Wean off the 5 AM feed</strong>: Shorten or shift it later step by step (e.g., wait 15 extra minutes each morning, gradually reduce the volume of milk).
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-teal-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">☀️</span>
                  <div>
                    Make sure the baby gets enough calories <strong className="text-gray-900">during the day</strong>, so night feedings become less essential.
                  </div>
                </li>
              </ul>
              
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="self-soothing">
                <span className="text-3xl mr-2">🧸</span> D. Strengthen Self‐Soothing Skills
              </h3>
              <ul className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-rose-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">💤</span>
                  <div>
                    <strong className="text-gray-900">Avoid putting baby down fully asleep</strong> on a bottle or breast. Instead, place them in the crib <strong className="text-gray-900">drowsy but awake</strong>, so they learn to settle independently.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-rose-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">🤔</span>
                  <div>
                    If using a pacifier, scatter a few in the crib so the baby can find one at night without parent help.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-rose-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">📝</span>
                  <div>
                    Consider <strong className="text-gray-900">gentle sleep training</strong> methods (e.g., check‐and‐console, staying present by the crib) so the baby learns to drift back to sleep without a feeding or long rocking sessions.
                  </div>
                </li>
              </ul>
              
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="optimize-environment">
                <span className="text-3xl mr-2">🌑</span> E. Optimize the Sleep Environment
              </h3>
              <ul className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-gray-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-gray-800 text-gray-100 flex-shrink-0 flex items-center justify-center mr-3 font-bold">⚫</span>
                  <div>
                    <strong className="text-gray-900">Complete Darkness</strong>: Use blackout curtains, especially important from ~4:00–6:00 AM.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-gray-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">🔊</span>
                  <div>
                    <strong className="text-gray-900">White Noise</strong>: A steady, gentle "shhh" sound can mask early‐morning house or street noise.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-gray-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">🌡️</span>
                  <div>
                    <strong className="text-gray-900">Comfortable Temperature</strong>: Keep the room at ~18–21°C (65–70°F). If the baby is cold at dawn, they may fully awaken.
                  </div>
                </li>
              </ul>
            </section>
            
            <hr className="my-10 border-dashed border-blue-200" />
            
            <section>
              <h2 className="flex items-center text-2xl font-semibold text-gray-800 mt-8 mb-6 pb-2 border-b-2 border-blue-200" id="implementation">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3 font-bold">3</span>
                Step‐by‐Step Implementation
              </h2>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-md">
                <p className="text-green-800 font-medium">
                  Implementing changes gradually is key to success. Remember that consistency and patience 
                  are just as important as the specific strategies you use.
                </p>
              </div>
              
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="gradual-changes">
                <span className="text-3xl mr-2">📈</span> A. Gradual Changes
              </h3>
              <ul className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-yellow-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">⚠️</span>
                  <div>
                    <strong className="text-gray-900">Don't change everything at once</strong> (e.g., dropping two night feeds, moving all naps, and adjusting bedtime simultaneously).
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-yellow-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">👍</span>
                  <div>
                    Tackle one or two goals per week (later first nap, shorten third nap, and so on).
                  </div>
                </li>
              </ul>
              
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="track-progress">
                <span className="text-3xl mr-2">📊</span> B. Track Your Progress
              </h3>
              <ul className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-sky-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">📝</span>
                  <div>
                    Keep a <strong className="text-gray-900">sleep diary</strong> of exact wake times, nap lengths, feeding volumes, and bedtime.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-sky-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">🔍</span>
                  <div>
                    After a week or two of consistent changes, look for trends: Does the baby sleep later in the morning? Are night wakings reduced?
                  </div>
                </li>
              </ul>
              
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="consistent-routine">
                <span className="text-3xl mr-2">🔄</span> C. Stay Consistent and Predictable
              </h3>
              <ul className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-violet-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">⏰</span>
                  <div>
                    Babies thrive on <strong className="text-gray-900">routine</strong>. Try to keep naps and bedtime within a <strong className="text-gray-900">15–30‐minute window</strong> each day.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-violet-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">🌙</span>
                  <div>
                    <strong className="text-gray-900">Morning Wakeup</strong>: If your baby wakes at 5:00 AM, keep the room dark and quiet. Avoid turning on lights or starting the day. Show them it's still "night." Over time, they may sleep or rest until closer to 6:00 or 7:00 AM.
                  </div>
                </li>
              </ul>
              
              <h3 className="text-xl font-medium text-indigo-700 mt-8 mb-3 flex items-center" id="developmental-milestones">
                <span className="text-3xl mr-2">👶</span> D. Watch for Developmental Milestones or Teething
              </h3>
              <ul className="list-none pl-0 mb-6 space-y-3">
                <li className="flex items-start bg-gradient-to-r from-white to-pink-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">🧠</span>
                  <div>
                    Sleep can regress temporarily when babies learn new skills (crawling, pulling to stand) or experience teething pain.
                  </div>
                </li>
                <li className="flex items-start bg-gradient-to-r from-white to-pink-50 p-3 rounded-md transition-transform hover:scale-[1.01] shadow-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex-shrink-0 flex items-center justify-center mr-3 font-bold">🦷</span>
                  <div>
                    Use teething remedies (as approved by a pediatrician) and offer more practice time during the day so nighttime disruptions are less exciting.
                  </div>
                </li>
              </ul>
            </section>
            
            <hr className="my-10 border-dashed border-blue-200" />
            
            <section>
              <h2 className="flex items-center text-2xl font-semibold text-gray-800 mt-8 mb-6 pb-2 border-b-2 border-blue-200" id="conclusion">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3 font-bold">4</span>
                Conclusion
              </h2>
              
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm mb-5 border border-blue-100">
                <p className="mb-5 text-gray-800">
                  By balancing total daily sleep, spacing naps wisely, gradually reducing unnecessary night feeds, and ensuring the right environment for rest, you can often <strong className="text-indigo-700 font-bold">shift a baby's morning wake time to 6:00 or 7:00 AM.</strong> Consistency is key, and small, steady steps typically yield better results than abrupt overhauls.
                </p>
                
                <p className="text-gray-800">
                  With <strong className="text-indigo-700 font-bold">patience and a clear plan</strong>, you can help your 7–8‐month‐old develop healthier sleep habits, leading to more restful nights and more manageable mornings for the entire family.
                </p>
              </div>
            </section>
            
            <hr className="my-10 border-dashed border-blue-200" />
            
            <section className="text-sm bg-gray-50 p-5 rounded-lg">
              <p className="mb-3 font-medium text-gray-700"><strong>Sources:</strong></p>
              <ul className="list-disc pl-6 mb-5 space-y-1 text-gray-600">
                <li>Taking Cara Babies, BabyCenter, Little Ones, Huckleberry, Newton Baby, My Sweet Sleeper</li>
                <li>Pediatric sleep research & recommendations from certified child‐sleep consultants</li>
              </ul>
              <p className="text-gray-500 italic">
                <em>(Note: Always consult a pediatrician if you suspect medical or developmental issues affecting sleep.)</em>
              </p>
            </section>
          </main>
        </div>
      </div>
      
      <div className="fixed bottom-6 right-6">
        <a 
          href="#top" 
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Scroll to top"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </a>
      </div>
    </div>
  );
} 