import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

  // FIX: Restore the complete scrolling coordinate pairs
  const y1 = useTransform(scrollY, [0, 500], [0, 80]);
  const y2 = useTransform(scrollY, [0, 500], [0, -60]);


  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  const cardHover = {
    hover: { y: -10, scale: 1.03 }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#EEF2FF] text-[#0F172A]">

      {/* BACKGROUND BLOBS (because flat UI is emotionally dead) */}
      <motion.div
        style={{ y: y1 }}
        className="absolute w-[500px] h-[500px] bg-blue-300/30 blur-3xl rounded-full top-[-100px] left-[-120px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute w-[600px] h-[600px] bg-indigo-300/30 blur-3xl rounded-full bottom-[-150px] right-[-120px]"
      />

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-black">
            HelpDesk<span className="text-indigo-600">Pro</span>
          </div>

          <button
            onClick={onNavigateToLogin}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:scale-105 transition"
          >
            Enter System
          </button>
        </div>
      </nav>

      {/* HERO */}
      <header className="pt-36 pb-24 px-6 relative z-10">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">

            <span className="text-xs font-bold px-4 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600">
              LIVE INCIDENT MANAGEMENT SYSTEM
            </span>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              IT support that
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                actually responds.
              </span>
            </h1>

            <p className="text-slate-600 text-lg max-w-xl">
              Track incidents, assign technicians, and resolve issues without pretending email threads are a system.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={onNavigateToLogin}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-1 transition"
              >
                Open Dashboard
              </button>

              <button className="border px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition">
                Create Ticket
              </button>
            </div>
          </motion.div>

          {/* DASHBOARD PREVIEW (UPGRADED) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
          >
            <div className="flex gap-2 p-3 bg-slate-800">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-400 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>

            <div className="p-6 space-y-5 font-mono text-sm text-white">

              <p className="text-green-400">// system operational</p>

              {/* LIVE TICKER STYLE CARDS */}
              <div className="space-y-3">

                {[
                  ["#INC-2401", "Network outage detected", "CRITICAL"],
                  ["#INC-2402", "Printer queue stuck", "MEDIUM"],
                  ["#INC-2403", "Password reset request", "LOW"]
                ].map(([id, text, level]) => (
                  <div key={id} className="bg-white text-slate-900 rounded-xl p-3 hover:scale-[1.02] transition">
                    <div className="flex justify-between font-bold">
                      <span>{id}</span>
                      <span className={level === "CRITICAL" ? "text-red-500" : "text-yellow-500"}>
                        {level}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{text}</p>
                  </div>
                ))}

              </div>

              <p className="text-slate-400">// awaiting technician allocation...</p>

            </div>
          </motion.div>
        </div>
      </header>

      {/* STATS (NOW ANIMATED) */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-3 gap-10 text-center">

          <div>
            <p className="text-6xl font-black text-blue-600">
              <AnimatedCounter to={500} />+
            </p>
            <p className="text-slate-600 font-semibold">Incidents Resolved</p>
          </div>

          <div>
            <p className="text-6xl font-black text-indigo-600">
              <AnimatedCounter to={95} />%
            </p>
            <p className="text-slate-600 font-semibold">SLA Compliance</p>
          </div>

          <div>
            <p className="text-6xl font-black text-slate-900">24/7</p>
            <p className="text-slate-600 font-semibold">System Availability</p>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-28 relative z-10">
        <div className="max-w-[1440px] mx-auto text-center mb-14">
          <h2 className="text-4xl font-black">Everything structured. Nothing chaotic.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-[1440px] mx-auto">

          {[
            ["Role Control", "Permissions so tight users can't accidentally break production (usually)."],
            ["Live Logs", "Updates happen instantly, like magic but with SQL queries."],
            ["Analytics", "Numbers that impress management and confuse everyone else."]
          ].map(([t, d]) => (
            <motion.div
              key={t}
              whileHover="hover"
              variants={cardHover}
              className="bg-white p-8 rounded-2xl shadow-md border hover:shadow-xl transition"
            >
              <h3 className="font-bold text-xl mb-2">{t}</h3>
              <p className="text-slate-600">{d}</p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-6 relative z-10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between gap-8">

          <div className="text-white text-2xl font-black">
            HelpDeskPro
          </div>

          <div className="flex gap-6 text-sm">
            <a className="hover:text-white">Terms</a>
            <a className="hover:text-white">Privacy</a>
            <a className="hover:text-white">Support</a>
          </div>

        </div>

        <div className="text-center mt-10 text-xs text-slate-500">
          © 2026 HelpDeskPro Systems
        </div>
      </footer>

    </div>
  );
};

export default Landing;