import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Zap, Bot } from 'lucide-react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const DEMO_EMAIL = 'jabirbhaaii2@gmail.com';
const DEMO_PASSWORD = '12345678';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });
  const [errors, setErrors] = useState({});
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDemoLogin = async () => {
    setFormData((prev) => ({
      ...prev,
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    }));
    setLoading(true);
    try {
      await login(DEMO_EMAIL, DEMO_PASSWORD);
      toast.success('Logged in as Demo User!');
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Server took too long to respond. If it was sleeping, please try again.');
      } else if (!error.response) {
        toast.error('Unable to reach server. Please check your connection or try again shortly.');
      } else {
        toast.error(error.response?.data?.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        await register(formData.name, formData.email, formData.password);
        toast.success('Account created!');
      }
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Server took too long to respond. If it was sleeping, please try again.');
      } else if (!error.response) {
        toast.error('Unable to reach server. Please check your connection or try again shortly.');
      } else {
        toast.error(error.response?.data?.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      localStorage.clear();
      await signOut(auth);
      
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email, uid, photoURL } = result.user;

      await loginWithGoogle(displayName, email, uid, photoURL);

      toast.success('Google sign-in successful!');
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return;
      }
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Server took too long to respond. Please try again.');
      } else if (!error.response && error.message) {
        toast.error(error.message);
      } else {
        toast.error(error.response?.data?.message || 'Failed to authenticate with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg-primary text-text-primary relative selection:bg-accent selection:text-white">
      {/* Background Ambience */}
      <div className="mesh-bg opacity-30 pointer-events-none" />
      <div className="noise-overlay" />

      {/* Floating Ambient Glow Orbs */}
      <div className="orb orb-accent w-[500px] h-[500px] -top-32 -left-32 animate-orbit opacity-40 pointer-events-none" />
      <div className="orb orb-teal w-[420px] h-[420px] bottom-0 right-1/4 animate-orbit-reverse opacity-30 pointer-events-none" />

      {/* Back to Home Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-30 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-text-primary bg-bg-secondary/80 hover:bg-bg-elevated border border-border backdrop-blur-md transition-all shadow-sm group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to Home</span>
      </motion.button>

      {/* ═══ Left Showcase Hero Panel (Desktop) ═══ */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 xl:p-16 border-r border-border bg-gradient-to-b from-accent/5 via-transparent to-accent/[0.02] overflow-hidden">
        {/* Brand Header */}
        <div className="relative z-10 pt-4">
          <div className="inline-flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 bg-gradient-to-br from-accent via-indigo-600 to-accent-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-accent/25 ring-1 ring-white/20">
              <span className="text-white font-black text-sm tracking-wider">CN</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-text-primary leading-none">CollabNote</span>
              <span className="text-[11px] font-medium text-accent tracking-wide mt-1">Workspace Intelligence</span>
            </div>
          </div>
        </div>

        {/* Central Visual Showcase */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-accent bg-accent/10 border border-accent/20 mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Real-Time Collaboration</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl xl:text-5xl font-black tracking-[-0.035em] leading-[1.12] mb-5 text-text-primary"
          >
            Where ideas turn into <span className="text-gradient-hero">collective knowledge</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base text-text-secondary leading-relaxed font-normal mb-8 max-w-lg"
          >
            Collaborative markdown editing with sub-50ms sync, integrated Gemini AI assistance, visual diff history, and instant team handoff.
          </motion.p>

          {/* Interactive Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-3.5"
          >
            <div className="p-4 rounded-2xl bg-bg-card border border-border backdrop-blur-xl hover:border-accent/40 shadow-sm transition-all group">
              <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-3 text-accent group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-text-primary mb-1">Sub-50ms Realtime Sync</h4>
              <p className="text-[11px] text-text-muted leading-normal font-normal">Instant multi-cursor presence & live conflict-free edits.</p>
            </div>

            <div className="p-4 rounded-2xl bg-bg-card border border-border backdrop-blur-xl hover:border-emerald-500/40 shadow-sm transition-all group">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 text-emerald-500 group-hover:scale-105 transition-transform">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-text-primary mb-1">Gemini AI Copilot</h4>
              <p className="text-[11px] text-text-muted leading-normal font-normal">Auto-summaries, action items, and smart note tagging.</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-border text-xs text-text-muted">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-medium text-text-secondary">End-to-end encrypted session auth</span>
          </div>
          <span className="font-mono text-[11px] text-text-muted">v1.0 Production</span>
        </div>
      </div>

      {/* ═══ Right Auth Form Container ═══ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16 relative overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px] relative z-10 my-auto"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-secondary rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-accent/30 mb-3">
              <span className="text-white font-extrabold text-sm">CN</span>
            </div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">CollabNote</h2>
          </div>

          {/* Form Header */}
          <div className="mb-7 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-text-primary mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-text-secondary font-normal">
              {isLogin ? 'Sign in to access your notes and collaborative workspace' : 'Get started in seconds — completely free'}
            </p>
          </div>

          {/* Main Auth Card */}
          <div className="bg-bg-card backdrop-blur-2xl border border-border rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-2xl relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
            {/* Top Specular Gradient Line */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-70" />

            {/* Mode Switcher Tabs */}
            <div className="flex relative mb-6 bg-bg-tertiary rounded-2xl p-1 border border-border">
              <motion.div
                layout
                className="absolute inset-y-1 w-[calc(50%-4px)] bg-accent rounded-xl shadow-md shadow-accent/25"
                style={{ left: 4 }}
                initial={false}
                animate={{ x: isLogin ? 0 : 'calc(100% + 4px)' }}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setErrors({});
                  setFormData((prev) => ({
                    ...prev,
                    email: prev.email || DEMO_EMAIL,
                    password: prev.password || DEMO_PASSWORD,
                  }));
                }}
                className={`relative flex-1 py-2.5 text-xs font-bold transition-colors z-10 rounded-xl ${
                  isLogin ? 'text-white' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setErrors({});
                  setFormData({ name: '', email: '', password: '' });
                }}
                className={`relative flex-1 py-2.5 text-xs font-bold transition-colors z-10 rounded-xl ${
                  !isLogin ? 'text-white' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Demo Credentials Quick Banner (When on Login) */}
            {isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 text-accent font-semibold">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Demo account ready</span>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-lg bg-accent text-white text-[11px] font-bold hover:bg-accent-hover active:scale-95 transition-all shadow-sm shrink-0"
                >
                  Quick Sign In
                </button>
              </motion.div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Input
                      label="Full Name"
                      name="name"
                      type="text"
                      placeholder="Alex Developer"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                      icon={<User className="w-4 h-4" />}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                icon={<Mail className="w-4 h-4" />}
              />

              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  icon={<Lock className="w-4 h-4" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] p-1.5 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-border/50"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 py-3.5 rounded-xl font-bold shadow-[0_4px_24px_rgba(124,92,252,0.35)] hover:shadow-[0_6px_32px_rgba(124,92,252,0.45)]"
                loading={loading}
              >
                {isLogin ? 'Sign In to Workspace' : 'Get Started Free'}
              </Button>
            </form>

            {/* Or Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-bg-card text-[11px] uppercase tracking-wider text-text-muted font-bold">
                  or
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-bg-tertiary hover:bg-bg-elevated border border-border hover:border-border-hover text-text-primary text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Footer toggle text */}
          <p className="text-center mt-6 text-xs text-text-muted">
            {isLogin ? "Don't have an account yet?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                if (isLogin) {
                  setFormData({ name: '', email: '', password: '' });
                } else {
                  setFormData({ name: '', email: DEMO_EMAIL, password: DEMO_PASSWORD });
                }
              }}
              className="text-accent hover:text-accent-hover font-semibold transition-colors ml-1 underline-offset-4 hover:underline"
            >
              {isLogin ? 'Create one now' : 'Sign in here'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
