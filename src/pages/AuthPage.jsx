import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      
      // Clear any existing tokens and sign out from Firebase first
      localStorage.clear();
      await signOut(auth);
      
      const result = await signInWithPopup(auth, googleProvider);

      const { displayName, email, uid, photoURL } = result.user;

      await loginWithGoogle(displayName, email, uid, photoURL);

      toast.success('Google sign-in successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to authenticate with Google');
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
    <div className="min-h-screen flex">
      {/* ═══ Left Panel — Branding ═══ */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-bg-primary to-accent-secondary/10" />

        {/* Floating orbs */}
        <div className="orb orb-accent w-[400px] h-[400px] -top-32 -left-32 animate-orbit opacity-50" />
        <div className="orb orb-teal w-[300px] h-[300px] bottom-0 right-0 animate-orbit-reverse opacity-40" />
        <div className="orb orb-purple w-[250px] h-[250px] top-1/2 left-1/3 animate-orbit opacity-30" />

        <div className="relative z-10 max-w-md px-12 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-16 bg-gradient-to-br from-accent to-accent-secondary rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_60px_rgba(var(--accent-rgb),0.3)] mb-8"
          >
            <span className="text-white font-black text-2xl">CN</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold tracking-tight mb-4"
          >
            Notes that <span className="text-gradient">think together</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-text-secondary font-light"
          >
            Collaborate in real-time with AI intelligence, version history, and seamless team workflows.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mt-8"
          >
            {['Real-time Sync', 'AI Summaries', 'Version Control', 'Secure'].map((f) => (
              <span key={f} className="px-3 py-1.5 text-[11px] font-medium text-text-secondary bg-white/5 border border-white/5 rounded-full">
                {f}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══ Right Panel — Auth Form ═══ */}
      <div className="w-full lg:w-[480px] xl:w-[560px] shrink-0 flex items-center justify-center p-6 relative bg-bg-primary">
        <div className="noise-overlay" />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors p-2 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-secondary rounded-xl mx-auto flex items-center justify-center shadow-[0_4px_20px_var(--accent-glow)] mb-4">
              <span className="text-white font-bold text-lg">CN</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-sm text-text-secondary font-light">
              {isLogin ? 'Sign in to continue to your workspace' : 'Start collaborating in minutes — free forever'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-bg-secondary border border-border rounded-2xl p-7 relative overflow-hidden">
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

            {/* Tab Switcher */}
            <div className="flex relative mb-7 bg-bg-tertiary/60 rounded-xl p-1">
              <motion.div
                layout
                className="absolute inset-y-1 w-[calc(50%-4px)] bg-accent rounded-lg shadow-lg shadow-accent/20"
                style={{ left: 4 }}
                initial={false}
                animate={{ x: isLogin ? 0 : 'calc(100% + 4px)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
              <button
                onClick={() => { setIsLogin(true); setErrors({}); }}
                className={`relative flex-1 py-2.5 text-xs font-semibold transition-colors z-10 rounded-lg ${isLogin ? 'text-white' : 'text-text-muted hover:text-text-primary'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsLogin(false); setErrors({}); }}
                className={`relative flex-1 py-2.5 text-xs font-semibold transition-colors z-10 rounded-lg ${!isLogin ? 'text-white' : 'text-text-muted hover:text-text-primary'}`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Input
                      label="Full Name"
                      name="name"
                      type="text"
                      placeholder="Your name"
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
                placeholder="name@company.com"
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
                  className="absolute right-3 top-[34px] p-1.5 text-text-muted hover:text-text-primary transition-colors rounded-md"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 shadow-[0_4px_24px_var(--accent-glow)]"
                loading={loading}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-bg-secondary text-[11px] text-text-muted font-medium">or continue with</span>
              </div>
            </div>

            {/* Google */}
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full"
              onClick={handleGoogleLogin}
              loading={loading}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
          </div>

          {/* Bottom toggle */}
          <p className="text-center mt-6 text-sm text-text-muted">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
              className="text-accent hover:underline font-medium"
            >
              {isLogin ? 'Sign up for free' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
