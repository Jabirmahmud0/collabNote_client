import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Sparkles, History, Github, Linkedin, ArrowRight,
  Play, Zap, Shield, Globe, ChevronRight,
} from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const features = [
    { icon: Users, title: 'Real-time Collaboration', desc: 'Edit together with low-latency sync. See cursors, selections, and changes as they happen across devices.', gradient: 'from-violet-500/20 to-purple-500/10' },
    { icon: Sparkles, title: 'AI-Powered Intelligence', desc: 'Gemini AI summarizes notes, auto-generates tags, and helps you write — turning your notes into knowledge.', gradient: 'from-emerald-500/20 to-teal-500/10' },
    { icon: History, title: 'Version History', desc: 'Every keystroke is tracked. Restore any version with one click. View visual diffs between revisions.', gradient: 'from-amber-500/20 to-orange-500/10' },
    { icon: Shield, title: 'Secure by Default', desc: 'JWT authentication, encrypted transport, and role-based access control keep your workspace safe.', gradient: 'from-rose-500/20 to-red-500/10' },
    { icon: Zap, title: 'Blazing Performance', desc: 'WebSocket-powered architecture delivers sub-50ms latency on collaborative edits and cursor sync.', gradient: 'from-cyan-500/20 to-blue-500/10' },
    { icon: Globe, title: 'Access Everywhere', desc: 'Cloud-native infrastructure. Your notes travel with you seamlessly across all devices.', gradient: 'from-pink-500/20 to-fuchsia-500/10' },
  ];

  const techStack = [
    { name: 'React', color: '#61DAFB' },
    { name: 'Node.js', color: '#68A063' },
    { name: 'Socket.IO', color: '#010101' },
    { name: 'MongoDB', color: '#47A248' },
    { name: 'Tailwind', color: '#38BDF8' },
    { name: 'Gemini AI', color: '#7c5cfc' },
    { name: 'Express', color: '#ffffff' },
    { name: 'Framer Motion', color: '#FF0055' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">
      {/* Ambient background */}
      <div className="mesh-bg" />
      <div className="noise-overlay" />

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className="fixed top-0 w-full z-50 glass-strong">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-accent to-accent-secondary rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="text-white font-extrabold text-xs">CN</span>
            </div>
            <span className="text-lg font-bold tracking-tight">CollabNote</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#features" className="hidden md:block text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
            <a href="#tech" className="hidden md:block text-sm text-text-secondary hover:text-text-primary transition-colors">Stack</a>
            <Button variant="primary" size="sm" onClick={() => navigate('/auth')}>
              Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-40 pb-16 px-6">
        {/* Floating orbs */}
        <div className="orb orb-accent w-[500px] h-[500px] -top-40 -left-40 animate-orbit opacity-60" />
        <div className="orb orb-teal w-[400px] h-[400px] top-20 -right-32 animate-orbit-reverse opacity-50" />
        <div className="orb orb-purple w-[300px] h-[300px] bottom-0 left-1/3 animate-orbit opacity-40" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col items-center">
            {/* Status badge */}
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-xs font-semibold text-accent bg-accent/8 border border-accent/15 rounded-full backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                Powered by Gemini 1.5 Flash
                <ChevronRight className="w-3 h-3 text-accent/60" />
              </div>
            </motion.div>

            {/* Headline — the star of the show */}
            <motion.h1
              variants={fadeUp}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-black tracking-[-0.04em] leading-[1.1] pb-4 mb-10"
            >
              <span className="block">Notes that</span>
              <span className="text-gradient-hero block mt-1">think together</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed font-light"
            >
              Real-time collaboration, AI intelligence, and version control — all in one
              workspace designed for teams that move fast.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="shadow-[0_0_40px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_0_60px_rgba(var(--accent-rgb),0.4)] px-8"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Start Building — It's Free
              </Button>
              <Button
                size="lg"
                variant="glass"
                onClick={() => navigate('/auth')}
                className="border-border-hover"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="mt-20 flex items-center gap-4 text-sm text-text-muted">
              <div className="flex -space-x-2">
                {['#7c5cfc', '#00d4aa', '#f59e0b', '#ec4899'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-bg-primary flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: c }}>
                    {['J', 'A', 'S', 'M'][i]}
                  </div>
                ))}
              </div>
              <span>Join <strong className="text-text-primary">2,400+</strong> users already collaborating</span>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── App Preview Window ─── */}
        <div className="max-w-5xl mx-auto mt-24 px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Multi-layered glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-purple-500/10 to-accent-secondary/15 rounded-3xl blur-[60px] opacity-50" />
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/10 to-accent-secondary/10 rounded-2xl opacity-30" />

            <div className="relative bg-bg-secondary/90 backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden shadow-2xl">
              {/* Window chrome */}
              <div className="bg-bg-tertiary/80 border-b border-white/5 px-5 py-3.5 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-8 py-1.5 bg-bg-primary/50 rounded-lg text-[11px] text-text-muted border border-white/5 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500/40" />
                    collabnote.app/workspace
                  </div>
                </div>
                <div className="w-16" />
              </div>

              {/* App content mockup */}
              <div className="flex min-h-[340px]">
                {/* Sidebar mockup */}
                <div className="hidden md:flex flex-col w-52 border-r border-white/5 p-4 gap-2.5 bg-bg-primary/30">
                  <div className="h-9 w-full bg-accent/15 rounded-lg border border-accent/10 flex items-center gap-2 px-3">
                    <div className="w-3.5 h-3.5 rounded bg-accent/40" />
                    <div className="h-2 w-16 bg-accent/30 rounded-full" />
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {['w-3/4', 'w-2/3', 'w-4/5', 'w-1/2', 'w-3/5'].map((w, i) => (
                      <div key={i} className={`h-7 ${w} bg-white/3 rounded-md hover:bg-white/5 transition-colors`} />
                    ))}
                  </div>
                  <div className="mt-auto">
                    <div className="h-7 w-2/3 bg-white/3 rounded-md" />
                  </div>
                </div>

                {/* Editor area */}
                <div className="flex-1 p-6 relative">
                  {/* Title bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-7 w-48 bg-white/5 rounded-lg" />
                    <div className="flex gap-2">
                      <div className="h-6 w-6 bg-white/3 rounded-md" />
                      <div className="h-6 w-6 bg-white/3 rounded-md" />
                    </div>
                  </div>

                  {/* Text lines mockup */}
                  <div className="space-y-3 max-w-lg">
                    <div className="h-3 w-full bg-white/4 rounded-full" />
                    <div className="h-3 w-11/12 bg-white/4 rounded-full" />
                    <div className="h-3 w-4/5 bg-white/3 rounded-full" />
                    <div className="h-3 w-9/12 bg-white/3 rounded-full" />
                    <div className="h-3 w-10/12 bg-white/4 rounded-full" />
                    <div className="h-3 w-3/5 bg-white/3 rounded-full" />
                  </div>

                  {/* Floating cursor 1 */}
                  <motion.div
                    className="absolute"
                    style={{ top: '40%', right: '25%' }}
                    animate={{ x: [0, 25, -15, 0], y: [0, -20, 8, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                      <path d="M1 1L7 18L9 10L15 8L1 1Z" fill="#7c5cfc" stroke="#a78bfa" strokeWidth="1" />
                    </svg>
                    <div className="absolute left-4 top-5 px-2.5 py-1 bg-accent text-white text-[9px] font-semibold rounded-md shadow-lg whitespace-nowrap animate-pulse-soft">
                      Jabir
                    </div>
                  </motion.div>

                  {/* Floating cursor 2 */}
                  <motion.div
                    className="absolute"
                    style={{ top: '55%', right: '45%' }}
                    animate={{ x: [0, -20, 10, 0], y: [0, 15, -10, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  >
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                      <path d="M1 1L7 18L9 10L15 8L1 1Z" fill="#00d4aa" stroke="#34d399" strokeWidth="1" />
                    </svg>
                    <div className="absolute left-4 top-5 px-2.5 py-1 bg-emerald-500 text-white text-[9px] font-semibold rounded-md shadow-lg whitespace-nowrap">
                      Alex
                    </div>
                  </motion.div>

                  {/* AI suggestion popup */}
                  <motion.div
                    className="absolute bottom-6 right-6 hidden lg:block"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.9] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 3, ease: 'easeInOut' }}
                  >
                    <div className="bg-accent/10 backdrop-blur-md border border-accent/20 rounded-xl px-4 py-3 shadow-lg">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider">AI Suggestion</span>
                      </div>
                      <div className="text-xs text-text-secondary max-w-[200px]">
                        "Consider adding a conclusion section to summarize key points..."
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-semibold text-accent bg-accent/8 border border-accent/15 rounded-full"
            >
              <Zap className="w-3 h-3" />
              Features
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] mb-5"
            >
              Everything your
              <br />
              <span className="text-gradient">team needs</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary text-lg max-w-xl mx-auto font-light"
            >
              A complete workspace that combines real-time editing with AI-powered intelligence.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="cn-card-glow p-7 group cursor-default"
                >
                  {/* Icon with gradient bg */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="w-5 h-5 text-text-primary" />
                  </div>
                  <h3 className="text-[15px] font-bold mb-2 text-text-primary group-hover:text-accent transition-colors">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-light">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-secondary/50 border border-border rounded-2xl p-12 relative overflow-hidden"
          >
            {/* Subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent-secondary/5 pointer-events-none" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 relative z-10">
              {[
                { value: '<50ms', label: 'Sync Latency', icon: '⚡' },
                { value: '99.9%', label: 'Uptime SLA', icon: '🛡️' },
                { value: '50k+', label: 'Active Users', icon: '👥' },
                { value: '1.2M+', label: 'Notes Created', icon: '📝' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-lg mb-2">{s.icon}</div>
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tighter text-text-primary mb-1">{s.value}</div>
                  <div className="text-xs text-text-muted font-medium uppercase tracking-widest">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ TECH STACK ═══════════════ */}
      <section id="tech" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-semibold text-accent bg-accent/8 border border-accent/15 rounded-full"
          >
            Technology
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-[-0.035em] mb-16"
          >
            Built with <span className="text-gradient">cutting-edge</span> tools
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="px-5 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:border-accent/30 hover:bg-accent/5 transition-all cursor-default flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tech.color }} />
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-bg-secondary to-accent-secondary/10" />
            <div className="absolute inset-0 bg-bg-primary/40" />

            {/* Border glow */}
            <div className="absolute inset-0 rounded-3xl border border-accent/15" />

            <div className="relative z-10 px-10 py-20 md:px-16 md:py-24 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-extrabold tracking-[-0.04em] mb-5"
              >
                Ready to <span className="text-gradient">get started</span>?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-text-secondary text-lg mb-10 max-w-lg mx-auto font-light"
              >
                Free forever for individuals. No credit card required.
                Join thousands already building together.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  size="xl"
                  onClick={() => navigate('/auth')}
                  className="shadow-[0_0_60px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_0_80px_rgba(var(--accent-rgb),0.4)] px-10"
                >
                  Create Your Workspace
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-accent to-accent-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-[9px]">CN</span>
            </div>
            <span className="font-bold tracking-tight text-sm">CollabNote</span>
          </div>
          <p className="text-xs text-text-muted">© 2026 CollabNote. Crafted with care.</p>
          <div className="flex gap-2">
            <a href="#" className="p-2 rounded-lg border border-border hover:border-accent/30 text-text-muted hover:text-accent transition-all">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg border border-border hover:border-accent/30 text-text-muted hover:text-accent transition-all">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
