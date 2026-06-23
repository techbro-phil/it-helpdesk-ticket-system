import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeModal, setActiveModal] = useState(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const cardHover = {
    hover: { y: -10, scale: 1.03, transition: { duration: 0.3 } }
  };

  const modalContent = {
    Terms: {
      title: "Terms of Service",
      text: "Welcome to Myhelpdesk. By accessing our incident tracking infrastructure, you agree to comply with corporate data compliance regulations. Unauthorized attempts to override access tiers, brute-force API tokens, or compromise backend PostgreSQL storage tables will result in immediate profile suspension and termination of organizational clearance handles."
    },
    Privacy: {
      title: "Privacy Policy",
      text: "Myhelpdesk handles user data protection with absolute confidentiality. Corporate emails, profile roles, and technical log arrays are securely stored using cryptographic bcrypt hashing layers. We never exchange or stream internal operational logs to outside data networks. Session variables are recorded strictly inside temporary localStorage caches."
    },
    Support: {
      title: "Customer Support Desk",
      text: "Need administrative account clearance issues resolved? If you cannot access your portal workspace dashboard, find your network profile locked out, or need your role permissions upgraded to Technician or Admin status, please submit a physical report request form directly to our Global IT Administration office at support@myhelpdesk.com."
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#EEF2FF] text-[#0F172A] font-sans antialiased">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-40 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 px-6 py-4">
        <div className="max-w-[1440px] mx-auto px-4 flex justify-between items-center">
          
          {/* LOGO UPGRADE: Renders your custom image next to the new text name */}
          <div className="flex items-center gap-3 font-black text-2xl tracking-tight text-slate-900">
            <img src="/logo.png" alt="Myhelpdesk Logo" className="w-8 h-8 object-contain" />
            <span>Myhelpdesk</span>
          </div>

          <button
            onClick={onNavigateToLogin}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-500/10 hover:scale-105 active:scale-95"
          >
            Access Portal
          </button>
        </div>
      </nav>

      {/* HERO */}
      <header className="pt-40 pb-24 px-6 relative z-10 w-full max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

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
                Launch Dashboard
              </button>

              <button 
                onClick={onNavigateToLogin}
                className="border border-slate-200 bg-white text-slate-700 px-8 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 hover:bg-slate-50 active:scale-95"
              >
                File Support Request
              </button>
            </div>
          </motion.div>

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

              <div className="space-y-3">
                {[
                  ["#INC-2401", "Network outage detected", "CRITICAL"],
                  ["#INC-2402", "Printer queue stuck", "MEDIUM"],
                  ["#INC-2403", "Password reset request", "LOW"]
                ].map(([id, text, level]) => (
                  <div key={id} className="bg-white text-slate-900 rounded-xl p-4 hover:scale-[1.02] transition-all shadow-sm">
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

      {/* COUNTERS */}
      <section className="px-6 py-20 relative z-10 w-full max-w-[1440px] mx-auto border-t border-b border-slate-200/60 bg-white/30 backdrop-blur-sm rounded-3xl">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <p className="text-6xl font-black text-blue-600">
              <AnimatedCounter to={500} />+
            </p>
            <p className="text-slate-700 font-bold text-lg">Incidents Resolved</p>
          </div>

          <div>
            <p className="text-6xl font-black text-indigo-600">
              <AnimatedCounter to={95} />%
            </p>
            <p className="text-slate-700 font-bold text-lg">SLA Compliance</p>
          </div>

          <div>
            <p className="text-6xl font-black text-slate-900">24/7</p>
            <p className="text-slate-700 font-bold text-lg">System Availability</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-28 relative z-10 w-full max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900">Everything structured. Nothing chaotic.</h2>
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

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-8 relative z-10 w-full">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-white text-2xl font-black">
            HelpDesk<span className="text-indigo-500">Pro</span>
          </div>

          <div className="flex gap-6 text-sm">
            <span onClick={() => setActiveModal("Terms")} className="cursor-pointer hover:text-white">Terms</span>
            <span onClick={() => setActiveModal("Privacy")} className="cursor-pointer hover:text-white">Privacy</span>
            <span onClick={() => setActiveModal("Support")} className="cursor-pointer hover:text-white">Support</span>
          </div>

          <p>© 2026 HelpDeskPro Systems. All rights secured.</p>
        </div>

        <AnimatePresence>
          {activeModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 p-6"
            >
              <div className="w-full max-w-lg bg-white p-8 rounded-2xl">
                <h2 className="text-xl font-bold mb-4">
                  {modalContent[activeModal].title}
                </h2>
                <p className="text-slate-600 mb-6">
                  {modalContent[activeModal].text}
                </p>

                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full bg-slate-900 text-white py-2 rounded-xl"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
};

export default Landing;