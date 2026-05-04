import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Shield, Zap, Globe, ArrowRight, BarChart3, PieChart, Lock } from 'lucide-react';
import { useStore } from '../store/StoreContext';

export const LandingPage: React.FC = () => {
  const { login } = useStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 md:p-10 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase italic leading-none">Ledger</span>
            <span className="text-[8px] text-zinc-600 uppercase tracking-[0.2em] font-bold mt-0.5">Control Room</span>
          </div>
        </div>
        <button 
          onClick={login}
          className="px-6 py-2.5 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 px-6">
        <motion.div 
          className="max-w-[1200px] mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Military-Grade Encryption</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic leading-[0.9]"
          >
            Sovereign <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">Finance Control</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mt-10 font-medium leading-relaxed"
          >
            The final terminal for your global assets. Real-time ledger sync, automated SIP tracking, and predictive budget analysis in one brutalist interface.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={login}
              className="group relative px-10 py-5 bg-blue-600 rounded-3xl font-black text-sm uppercase tracking-widest overflow-hidden shadow-2xl shadow-blue-600/30 active:scale-95 transition-all"
            >
              <span className="relative z-10 flex items-center gap-3">
                Initialize Console <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:scale-105 transition-transform" />
            </button>
            <div className="flex items-center -space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-help">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center text-[10px] font-black">
                  U{i}
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-[#050505] bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-black">
                +1k
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Bento */}
        <motion.div 
          className="max-w-[1200px] mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] group">
            <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Precision Analytics</h3>
            <p className="text-zinc-500 font-medium leading-relaxed">
              Drill down into your spending habits with granular precision. Every transaction is indexed, categorized, and visualized in real-time.
            </p>
          </div>

          <div className="bg-[#111] border border-white/5 p-10 rounded-[3rem] flex flex-col justify-between group">
            <div className="w-12 h-12 bg-indigo-600/10 text-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-2">Instant Sync</h3>
              <p className="text-zinc-500 text-sm font-medium">Automatic cloud synchronization across all your devices.</p>
            </div>
          </div>

          <div className="bg-[#111] border border-white/5 p-10 rounded-[3rem] flex flex-col justify-between group">
            <div className="w-12 h-12 bg-emerald-600/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-2">SIP Tracking</h3>
              <p className="text-zinc-500 text-sm font-medium">Monitor your systematic investments and recurring growth automations.</p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 bg-[#111] border border-white/5 p-10 rounded-[3rem] group">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-zinc-600/10 text-zinc-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="flex-1 h-[1px] bg-white/5" />
                <Lock className="w-5 h-5 text-zinc-700" />
             </div>
            <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Privacy First</h3>
            <p className="text-zinc-500 font-medium leading-relaxed">
              Your financial data is encrypted and accessible only by you. No tracking, no selling, no bullshit.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 pt-12 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 bg-zinc-800 rounded-lg flex items-center justify-center">
                <Wallet className="w-3 h-3 text-zinc-500" />
             </div>
             <span>© 2025 Ledger Terminal v2.0.4</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
