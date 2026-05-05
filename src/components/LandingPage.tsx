import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Shield, Zap, Globe, ArrowRight, BarChart3, PieChart, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '../store/StoreContext';

export const LandingPage: React.FC = () => {
  const { login, isLoggingIn, loginError } = useStore();

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
        <div className="flex items-center gap-4">
          <button 
            onClick={() => login('google')}
            disabled={isLoggingIn}
            className="hidden md:flex px-6 py-2.5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5 disabled:opacity-50 items-center justify-center min-w-[120px]"
          >
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In'}
          </button>
        </div>
      </nav>

      {/* Error Message */}
      {loginError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl shadow-red-500/10">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs font-bold text-red-100 uppercase tracking-widest">{loginError}</span>
          </div>
        </div>
      )}

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

          <motion.div variants={itemVariants} className="mt-12 flex flex-col items-center gap-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl">
              <button 
                onClick={() => login('google')}
                disabled={isLoggingIn}
                className="group relative flex-1 w-full px-8 py-5 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-white/5 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google Console
                  </>
                )}
              </button>

              <button 
                onClick={() => login('github')}
                disabled={isLoggingIn}
                className="group relative flex-1 w-full px-8 py-5 bg-[#24292e] text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Github Access
              </button>

              <button 
                onClick={() => login('apple')}
                disabled={isLoggingIn}
                className="group relative flex-1 w-full px-8 py-5 bg-black text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] border border-white/10 shadow-2xl shadow-black/40 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05 1.72-3.1 1.72-1.01 0-1.37-.62-2.58-.62-1.23 0-1.63.6-2.58.62-1.07.02-2.25-.92-3.28-1.92C3.42 18.02 2 14.54 2 11.23c0-3.35 2.1-5.12 4.12-5.12 1.05 0 2.05.51 2.7.51.65 0 1.68-.52 2.92-.52 1.57 0 2.72.65 3.38 1.58-3.23 1.83-2.73 6.07.53 7.37-.63 1.53-1.63 3.32-2.6 4.25zM12.03 5.4c-.05-1.85 1.55-3.38 3.25-3.4 0 1.7-.82 3.32-3.25 3.4z"/>
                </svg>
                Apple ID
              </button>
            </div>

            <div className="flex items-center gap-4 text-zinc-700 text-[8px] font-black uppercase tracking-[0.3em]">
              <div className="w-8 h-[1px] bg-zinc-900" />
              Sovereign Handshake Required
              <div className="w-8 h-[1px] bg-zinc-900" />
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
