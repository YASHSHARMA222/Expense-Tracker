import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Shield, Zap, Globe, ArrowRight, BarChart3, PieChart, Lock, Loader2, AlertCircle, User, Mail, Key, X } from 'lucide-react';
import { useStore } from '../store/StoreContext';

export const LandingPage: React.FC = () => {
  const { login, signUp, logIn, isLoggingIn, loginError, clearError } = useStore();
  const [authMode, setAuthMode] = useState<'social' | 'login' | 'signup'>('social');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  React.useEffect(() => {
    if (loginError) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [loginError, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      await logIn(formData.email, formData.password);
    } else if (authMode === 'signup') {
      await signUp(formData.email, formData.password, formData.name);
    }
  };

  const openAuth = (mode: 'login' | 'signup' | 'social') => {
    clearError();
    setAuthMode(mode);
    setShowModal(true);
  };

  const handleInputChange = (field: string, value: string) => {
    clearError();
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
            onClick={() => openAuth('login')}
            className="px-6 py-2.5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5 items-center justify-center min-w-[120px]"
          >
            Access Terminal
          </button>
        </div>
      </nav>

      {/* Auth Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#111] border border-white/5 p-8 rounded-[3rem] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">
                  {authMode === 'login' ? 'Global Authentication' : authMode === 'signup' ? 'Unit Registration' : 'Select Protocol'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-500" />
                </button>
              </div>

              {loginError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="text-[10px] font-bold text-red-100 uppercase tracking-widest">{loginError}</span>
                  </div>
                </motion.div>
              )}

              {/* Social Options */}
              <div className="flex justify-center mb-8">
                <button 
                  onClick={() => login('google')}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group"
                >
                  <svg className="w-5 h-5 text-[#4285F4] transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Continue with Google</span>
                </button>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                <div className="relative flex justify-center">
                  <div className="bg-[#111] px-4 flex items-center gap-2">
                    <Wallet className="w-3 h-3 text-blue-500" />
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.4em]">Ledger Credentials</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input 
                      type="text"
                      required
                      placeholder="OPERATOR NAME"
                      className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-wider focus:border-blue-500/50 outline-none transition-colors"
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input 
                    type="email"
                    required
                    placeholder="COMM-LINK EMAIL"
                    className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-wider focus:border-blue-500/50 outline-none transition-colors"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input 
                    type="password"
                    required
                    placeholder="SECURITY KEY"
                    className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-wider focus:border-blue-500/50 outline-none transition-colors"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                  />
                </div>

                <button 
                  disabled={isLoggingIn}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                  {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      {authMode === 'login' ? 'Establish Control' : 'Initialize Unit'}
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <button 
                  onClick={() => {
                    clearError();
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                  }}
                  className="text-zinc-600 hover:text-white text-[9px] font-black uppercase tracking-[0.2em] transition-colors"
                >
                  {authMode === 'login' ? "Don't have a unit? Create one" : "Already an operator? Log in"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Message - Only show if modal is NOT open */}
      {loginError && !showModal && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500" onClick={clearError}>
          <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl shadow-red-500/10 cursor-pointer hover:bg-red-500/20">
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

          <motion.div variants={itemVariants} className="mt-12 flex flex-col items-center gap-8 w-full">
            <button 
              onClick={() => openAuth('login')}
              disabled={isLoggingIn}
              className="group relative px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/30 active:scale-95 transition-all overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-4">
                Initialize Console <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <div className="flex items-center gap-8 text-[#222] font-black text-[10px] uppercase tracking-[0.5em]">
              <span>Identity Required</span>
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              <span>Sovereign Access</span>
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
