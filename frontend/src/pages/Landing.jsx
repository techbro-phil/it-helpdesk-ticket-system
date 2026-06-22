import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Clean state-tracking clock utility to animate integers counting upwards
const AnimatedCounter = ({ to }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = Math.max(1, Math.floor(to / 60));

    const interval = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, duration / (to / step));

    return () => clearInterval(interval);
  }, [to]);

  return <span>{count}</span>;
};

const Landing = ({ onNavigateToLogin }) => {
  const { scrollY } = useScroll();

  // Dynamic values that slide vector graphic overlays depending on scroll position
  const y1 = useTransform(scrollY, [0, 500], [0, 80]);
  const y2 = useTransform(scrollY, [0, 500], [0, -60]);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const cardHover = {
    hover: { y: -10, scale: 1.03, transition: { duration: 0.3 } }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#EEF2FF] text-[#0F172A] font-sans antialiased">

      {/* BACKGROUND GRAPHIC BLOBS */}
      <motion.div
        style={{ y: y1 }}
        className="absolute w-[500px] h-[500px] bg-blue-300/30 blur-3xl rounded-full top-[-100px] left-[-120px] pointer-events-none"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute w-[600px] h-[600px] bg-indigo-300/30 blur-3xl rounded-full bottom-[-150px] right-[-120px] pointer-events-none"
      />

      {/* 1. TOP NAVBAR PANEL */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 px-6 py-4">
        <div className="max-w-[1440px] mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tight">
            HelpDesk<span className="text-indigo-600">Pro</span>
          </div>

          <button
            onClick={onNavigateToLogin}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-500/10 hover:scale-105 active:scale-95"
          >
            Enter System
          </button>
        </div>
      </nav>

      {/* 2. HERO SPLIT CONTAINER */}
      <header className="pt-40 pb-24 px-6 relative z-10 w-full max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Text Block */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
            <span className="inline-block text-xs font-bold px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 tracking-wide uppercase">
              Live Incident Management System
            </span>

            <h1 className="text-5xl lg:text-7xl font-black leading-none tracking-tight text-slate-900">
              IT support that <br />
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                actually responds.
              </span>
            </h1>

            <p className="text-slate-600 text-lg max-w-xl leading-relaxed">
              Track incidents, assign technicians, and resolve issues without pretending chaotic email threads are an active database management platform.
            </p>

            <div className="flex gap-4 flex-wrap pt-2">
              <button
                onClick={onNavigateToLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Open Dashboard
              </button>

              {/* FIXED ACTION LINK: WIRED DIRECTLY TO THE AUTH HOOK */}
              <button 
                onClick={onNavigateToLogin}
                className="border border-slate-200 bg-white/50 text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
              >
                Create Ticket
              </button>
            </div>
          </motion.div>

          {/* Right Visual Simulation Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
          >
            <div className="flex gap-2 p-4 bg-slate-800 border-b border-slate-700">
              <span className="w-3 h-3 bg-slate-600 rounded-full" />
              <span className="w-3 h-3 bg-slate-600 rounded-full" />
              <span className="w-3 h-3 bg-slate-600 rounded-full" />
            </div>

            <div className="p-6 space-y-5 font-mono text-sm text-white">
              <p className="text-emerald-400 font-bold">// system operational</p>

              {/* Data Rows Array Mapping simulation */}
              <div className="space-y-3">
                {[
                  ["#INC-2401", "Network outage detected", "CRITICAL"],
                  ["#INC-2402", "Printer queue stuck", "MEDIUM"],
                  ["#INC-2403", "Password reset request", "LOW"]
                ].map(([id, text, level]) => (
                  <div key={id} className="bg-white text-slate-900 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] shadow-sm">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-500">{id}</span>
                      <span className={level === "CRITICAL" ? "text-red-500" : "text-yellow-500"}>
                        {level}
                      </span>
                    </div>
                    <p className="text-sm mt-1 font-sans font-medium text-slate-800">{text}</p>
                  </div>
                ))}
              </div>

              <p className="text-slate-400 font-bold">// awaiting technician allocation...</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 3. ANIMATED COUNTER STATISTICS SECTION */}
      <section className="px-6 py-20 relative z-10 w-full max-w-[1440px] mx-auto border-t border-b border-slate-200/60 bg-white/30 backdrop-blur-sm rounded-3xl">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-1">
            <p className="text-6xl font-black text-blue-600">
              <AnimatedCounter to={500} />+
            </p>
            <p className="text-slate-700 font-bold text-lg">Incidents Resolved</p>
          </div>

          <div className="space-y-1">
            <p className="text-6xl font-black text-indigo-600">
              <AnimatedCounter to={95} />%
            </p>
            <p className="text-slate-700 font-bold text-lg">SLA Compliance</p>
          </div>

          <div className="space-y-1">
            <p className="text-6xl font-black text-slate-900">24/7</p>
            <p className="text-slate-700 font-bold text-lg">System Availability</p>
          </div>
        </div>
      </section>

      {/* 4. THREE-COLUMN FEATURES MATRIX GRID */}
      <section className="px-6 py-28 relative z-10 w-full max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Everything structured. Nothing chaotic.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            ["Role Control", "Permissions so tight standard users cannot accidentally break database production properties."],
            ["Live Logs", "Updates happen instantly across the framework using modern asynchronous REST API connections."],
            ["Analytics", "Zero-latency mathematical mapping states designed to keep management updated in real-time."]
          ].map(([t, d]) => (
            <motion.div
              key={t}
              whileHover="hover"
              variants={cardHover}
              className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <h3 className="font-bold text-xl text-slate-900 mb-2">{t}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. FOOTER COMPONENT */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-8 relative z-10 w-full">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-white text-2xl font-black tracking-tight">
            HelpDesk<span className="text-indigo-500">Pro</span>
          </div>

          <div className="flex gap-8 text-sm font-medium">
            <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Support</span>
          </div>
        </div>

        <div className="text-center mt-12 text-xs text-slate-600 border-t border-slate-900 pt-6">
          &copy; 2026 HelpDeskPro Systems. All rights secured.
        </div>
      </footer>

    </div>
  );
};

export default Landing;
