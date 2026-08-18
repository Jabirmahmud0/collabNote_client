import React from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight, BookOpen, Briefcase, Check, CheckCircle2, Command,
  Download, FileText, GitCompare, GraduationCap, History, Lightbulb,
  MessageSquare, Sparkles, Tag, Users, Zap,
} from 'lucide-react';

const workflowSteps = [
  {
    number: '01',
    icon: FileText,
    title: 'Capture the first draft',
    text: 'Turn meeting notes, research, and rough ideas into a structured document without breaking your flow.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Shape it together',
    text: 'Invite teammates, follow live cursors, and make decisions in the same shared context.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Refine and share',
    text: 'Summarize the outcome, organize it with smart tags, then export or revisit any previous version.',
  },
];

const aiActions = [
  { icon: Sparkles, title: 'Instant summaries', text: 'Turn long notes into clear takeaways and next steps.' },
  { icon: Tag, title: 'Smart organization', text: 'Generate useful tags that keep related knowledge connected.' },
  { icon: GitCompare, title: 'Revision clarity', text: 'Compare versions visually and understand exactly what changed.' },
  { icon: Download, title: 'Flexible handoff', text: 'Export polished notes to PDF, Markdown, or portable JSON.' },
];

const useCases = [
  {
    icon: Briefcase,
    title: 'Product teams',
    text: 'Keep specs, feedback, decisions, and launch notes aligned from discovery to delivery.',
    tags: ['Product briefs', 'Decision logs'],
    accent: 'from-violet-500/18 to-indigo-500/5',
  },
  {
    icon: MessageSquare,
    title: 'Fast-moving meetings',
    text: 'Co-write agendas, capture decisions live, and leave every conversation with clear ownership.',
    tags: ['Agendas', 'Action items'],
    accent: 'from-cyan-500/16 to-blue-500/5',
  },
  {
    icon: GraduationCap,
    title: 'Research and study',
    text: 'Build a shared source of truth for references, findings, summaries, and evolving ideas.',
    tags: ['Research notes', 'Study guides'],
    accent: 'from-emerald-500/16 to-teal-500/5',
  },
  {
    icon: BookOpen,
    title: 'Team knowledge',
    text: 'Create living documentation that remains searchable, current, and easy to contribute to.',
    tags: ['Playbooks', 'Onboarding'],
    accent: 'from-amber-500/16 to-orange-500/5',
  },
];

const Reveal = ({ children, className = '', delay = 0 }) => {
  const reduceMotion = useReducedMotion();

  return (
    <Motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: reduceMotion ? 0 : 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </Motion.div>
  );
};

const SectionIntro = ({ eyebrow, icon, title, accent, description, align = 'center' }) => (
  <Reveal className={align === 'left' ? 'max-w-2xl' : 'max-w-3xl mx-auto text-center'}>
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-[11px] font-bold uppercase tracking-[0.16em] text-accent bg-accent/8 border border-accent/15 rounded-full">
      {React.createElement(icon, { className: 'w-3.5 h-3.5' })}
      {eyebrow}
    </div>
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.045em] leading-[1.05] mb-6">
      {title} <span className="text-gradient">{accent}</span>
    </h2>
    <p className="text-base md:text-lg text-text-secondary leading-relaxed font-light">
      {description}
    </p>
  </Reveal>
);

export const WorkflowSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="workflow" className="py-28 md:py-36 px-6 relative overflow-hidden">
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[46rem] h-[28rem] bg-accent/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionIntro
          eyebrow="A calmer workflow"
          icon={Zap}
          title="From first thought to"
          accent="shared momentum"
          description="CollabNote keeps drafting, discussion, AI assistance, and handoff in one continuous workspace."
          align="left"
        />

        <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-10 lg:gap-16 items-center mt-16">
          <div className="space-y-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.number} delay={index * 0.09}>
                  <div className="group relative p-5 rounded-2xl border border-border bg-bg-secondary/45 hover:bg-bg-secondary/80 hover:border-accent/25 transition-all duration-300 ease-out">
                    <div className="flex gap-4">
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center text-accent group-hover:-translate-y-1 transition-transform duration-300 ease-out motion-reduce:transform-none">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted mb-1">Step {step.number}</div>
                        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{step.text}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="relative [perspective:1400px]" delay={0.12}>
            <Motion.div
              animate={reduceMotion ? undefined : { y: [0, -7, 0], rotateX: [0, 1.2, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative rounded-[28px] border border-white/10 bg-bg-secondary/75 backdrop-blur-2xl p-3 shadow-[0_40px_100px_rgba(0,0,0,0.35)] will-change-transform"
            >
              <div className="rounded-[20px] border border-border bg-bg-primary/85 overflow-hidden">
                <div className="h-12 px-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-text-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    All changes saved
                  </div>
                </div>

                <div className="grid sm:grid-cols-[1fr_160px] min-h-[390px]">
                  <div className="p-7 md:p-9 border-r border-border relative">
                    <div className="flex items-start justify-between gap-4 mb-8">
                      <div>
                        <div className="text-[10px] text-accent uppercase tracking-[0.18em] mb-2">Product / Planning</div>
                        <div className="text-2xl font-bold tracking-tight">Q3 launch brief</div>
                      </div>
                      <div className="flex -space-x-2">
                        {['JM', 'AK', 'SL'].map((name, index) => (
                          <div key={name} className="w-8 h-8 rounded-full border-2 border-bg-primary flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: ['#7c5cfc', '#00b894', '#f59e0b'][index] }}>
                            {name}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                      <p><span className="text-text-primary font-semibold">Goal.</span> Make the release easier to understand and faster to adopt.</p>
                      <div className="h-px bg-border" />
                      <div className="space-y-3">
                        {['Confirm launch narrative', 'Review onboarding flow', 'Publish customer FAQ'].map((item, index) => (
                          <div key={item} className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${index === 0 ? 'bg-accent border-accent' : 'border-border-hover'}`}>
                              {index === 0 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={index === 0 ? 'line-through text-text-muted' : ''}>{item}</span>
                          </div>
                        ))}
                      </div>
                      <div className="relative mt-6 px-3 py-2 bg-accent/10 border-l-2 border-accent rounded-r-lg text-text-primary">
                        Keep the value proposition concrete and outcome-led.
                        <div className="absolute -right-2 -bottom-6 px-2 py-1 text-[9px] text-white bg-accent rounded-md shadow-lg">Jabir</div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block p-4 bg-bg-secondary/35">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-text-muted mb-4">In this note</div>
                    {['Overview', 'Goals', 'Timeline', 'Owners'].map((item, index) => (
                      <div key={item} className={`px-3 py-2 rounded-lg text-xs mb-1 ${index === 1 ? 'bg-accent/10 text-accent' : 'text-text-muted'}`}>
                        {item}
                      </div>
                    ))}
                    <div className="mt-8 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 mb-2">
                        <Users className="w-3 h-3" /> 3 online
                      </div>
                      <p className="text-[10px] leading-relaxed text-text-muted">Everyone is working from the latest version.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export const IntelligenceSection = () => (
  <section id="intelligence" className="py-28 md:py-36 px-6 relative">
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <Reveal className="order-2 lg:order-1">
        <div className="relative rounded-[28px] p-3 border border-accent/15 bg-gradient-to-br from-accent/10 via-bg-secondary/70 to-emerald-500/8 shadow-[0_35px_90px_rgba(0,0,0,0.28)]">
          <div className="rounded-[20px] border border-border bg-bg-primary/90 overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <Command className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">Ask CollabNote AI</span>
              <span className="ml-auto text-[10px] text-text-muted border border-border rounded-md px-2 py-1">Ctrl + K</span>
            </div>
            <div className="p-5 md:p-7">
              <div className="rounded-xl border border-accent/20 bg-accent/7 p-4 mb-5 text-sm text-text-primary">
                Summarize this launch brief and extract the next actions.
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-[0.14em]">
                  <Sparkles className="w-3.5 h-3.5" /> Generated response
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  The team is preparing the Q3 release around a clearer onboarding story. Three actions remain before launch:
                </p>
                {['Finalize the customer-facing narrative', 'Assign an owner to onboarding QA', 'Publish the FAQ before launch day'].map((action) => (
                  <div key={action} className="flex items-start gap-3 p-3 rounded-xl bg-bg-secondary/55 border border-border text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                    {action}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2">
                <span className="px-3 py-2 rounded-lg text-xs font-semibold bg-accent text-white">Insert into note</span>
                <span className="px-3 py-2 rounded-lg text-xs text-text-secondary border border-border">Try again</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="order-1 lg:order-2">
        <SectionIntro
          eyebrow="Useful AI, in context"
          icon={Sparkles}
          title="Less busywork. More"
          accent="useful thinking"
          description="AI tools live beside your work, so every summary, tag, and next step starts with the context your team already created."
          align="left"
        />
        <div className="grid sm:grid-cols-2 gap-3 mt-10">
          {aiActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Reveal key={action.title} delay={index * 0.07}>
                <div className="h-full p-4 rounded-2xl border border-border bg-bg-secondary/35 hover:border-accent/25 hover:-translate-y-1 transition-all duration-300 ease-out motion-reduce:transform-none">
                  <Icon className="w-4 h-4 text-accent mb-3" />
                  <h3 className="text-sm font-bold mb-1.5">{action.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{action.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export const UseCasesSection = () => (
  <section id="use-cases" className="py-28 md:py-36 px-6 relative overflow-hidden">
    <div className="absolute right-0 top-1/3 w-80 h-80 bg-accent-secondary/8 rounded-full blur-[100px] pointer-events-none" />
    <div className="max-w-6xl mx-auto relative z-10">
      <SectionIntro
        eyebrow="Made for real work"
        icon={Lightbulb}
        title="One workspace, many"
        accent="ways to think"
        description="Flexible enough for an individual idea, structured enough for a team-wide source of truth."
      />

      <div className="grid md:grid-cols-2 gap-5 mt-16">
        {useCases.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={index * 0.08}>
              <div className={`group h-full min-h-64 p-7 md:p-8 rounded-3xl border border-border bg-gradient-to-br ${item.accent} relative overflow-hidden hover:border-white/15 transition-all duration-300 ease-out`}>
                <div className="absolute -right-12 -bottom-16 w-48 h-48 rounded-full border border-white/5 group-hover:scale-110 transition-transform duration-500 ease-out motion-reduce:transform-none" />
                <div className="flex items-start justify-between relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-bg-primary/45 border border-white/8 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-text-primary" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-text-muted group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 motion-reduce:transform-none" />
                </div>
                <div className="mt-12 relative z-10">
                  <h3 className="text-2xl font-bold tracking-tight mb-3">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-md mb-6">{item.text}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-text-secondary bg-bg-primary/45 border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export const ProductPromise = () => (
  <section className="px-6 pb-12">
    <Reveal className="max-w-6xl mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 rounded-3xl border border-border bg-bg-secondary/45 overflow-hidden">
        {[
          { icon: Zap, title: 'Live by default', text: 'No manual refreshes' },
          { icon: History, title: 'Every version', text: 'Nothing gets lost' },
          { icon: Sparkles, title: 'AI in context', text: 'Help where you work' },
          { icon: Users, title: 'Built to share', text: 'Simple team access' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="p-6 border-b sm:border-b-0 border-r last:border-r-0 border-border flex items-center gap-3">
              <Icon className="w-4 h-4 text-accent shrink-0" />
              <div>
                <div className="text-sm font-bold">{item.title}</div>
                <div className="text-xs text-text-muted">{item.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  </section>
);
