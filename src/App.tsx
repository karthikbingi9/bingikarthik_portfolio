/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Search,
  Square,
  CheckSquare
} from 'lucide-react';
import {
  PORTFOLIO_PROFILE,
  SKILLS_DATA,
  PROJECTS_DATA,
  EXPERIENCE_DATA,
  ROADMAP_PHASES,
  ProjectItem
} from './data/portfolioData';
import {
  SkillFilter,
  filterSkills,
  calculateRoadmapProgress,
  validateContactForm,
  ContactFormInput
} from './utils/portfolioLogic';
import { ResumeModal } from './components/ResumeModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AiStudioSection } from './components/AiStudioSection';

interface SubmittedInquiry extends ContactFormInput {
  id: string;
  submittedAt: string;
}

export default function App() {
  // Modals
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Skills Filter State
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('all');
  const [skillQuery, setSkillQuery] = useState('');

  // 90-Day Roadmap Interactive Milestone Tracker State
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  // Clipboard Copy State
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Contact Form State
  const [contactInput, setContactInput] = useState<ContactFormInput>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactErrors, setContactErrors] = useState<{
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }>({});
  const [submittedInquiries, setSubmittedInquiries] = useState<SubmittedInquiry[]>([]);

  const filteredSkills = filterSkills(SKILLS_DATA, skillFilter, skillQuery);
  const roadmapStats = calculateRoadmapProgress(ROADMAP_PHASES, completedTasks);

  const toggleRoadmapTask = (taskId: string) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard?.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(contactInput);
    if (!validation.isValid) {
      setContactErrors(validation.errors);
      return;
    }

    setContactErrors({});
    const newEntry: SubmittedInquiry = {
      ...contactInput,
      id: `inq-${Date.now()}`,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSubmittedInquiries((prev) => [newEntry, ...prev]);
    setContactInput({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] selection:bg-white selection:text-black">
      {/* Top Bar Contract: 3 Zones Separated by gap-8 */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-4 bg-[#050505]/90 backdrop-blur-md border-b border-zinc-900 no-print">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display"
        >
          {PORTFOLIO_PROFILE.fullName}
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400"
        >
          <a
            href="#about"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            About
          </a>
          <a
            href="#skills"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Skills
          </a>
          <a
            href="#projects"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Projects
          </a>
          <a
            href="#roadmap"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Roadmap
          </a>
          <a
            href="#studio"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            AI Studio
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsResumeOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            View Résumé
          </button>
        </div>
      </header>

      <main id="top" className="no-print">
        {/* Hero Section: Split-Screen with Full-Width Key Metrics Row Below */}
        <section className="py-16 md:py-24 border-b border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Left Column: Typographic Hierarchy & Primary CTAs */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
                <div className="space-y-5">
                  {/* Unboxed Metadata with Typographic Separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono">
                    <span>Hyderabad, India</span>
                    <span aria-hidden="true">·</span>
                    <span>B.Tech EEE ’27 (MLRITM)</span>
                    <span aria-hidden="true">·</span>
                    <span>Aspiring DevOps Engineer</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] max-w-2xl">
                    {PORTFOLIO_PROFILE.displayName}
                  </h1>

                  <p className="text-lg md:text-xl text-zinc-200 font-medium leading-snug max-w-2xl">
                    {PORTFOLIO_PROFILE.tagline}
                  </p>

                  <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl">
                    {PORTFOLIO_PROFILE.shortIntro} Focused on AI/ML Infrastructure, Fintech, and
                    Developer Tools with complete transparency between verified skills and planned
                    learning milestones.
                  </p>
                </div>

                {/* Primary & Secondary Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#roadmap"
                    className="px-5 py-2.5 text-xs font-semibold text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0"
                  >
                    Explore 90-Day Roadmap
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsResumeOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Printable Résumé</span>
                  </button>
                  <a
                    href={PORTFOLIO_PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href={PORTFOLIO_PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Right Column: Monochrome Monogram & Identity Dossier Card */}
              <div className="lg:col-span-5 bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between space-y-8">
                <div className="flex items-start justify-between gap-4">
                  {/* Architectural Monochrome Monogram */}
                  <div
                    className="w-24 h-24 rounded-xl bg-white text-black flex items-center justify-center text-4xl font-bold tracking-tighter font-display select-none shrink-0"
                    aria-label="BK Monogram"
                  >
                    {PORTFOLIO_PROFILE.monogram}
                  </div>
                  <div className="text-right font-mono text-xs text-zinc-400 space-y-1">
                    <div className="text-white font-semibold">{PORTFOLIO_PROFILE.role}</div>
                    <div>Fresher · Class of 2027</div>
                    <div>Hyderabad, IN</div>
                  </div>
                </div>

                <div className="space-y-4 border-t border-zinc-800/80 pt-6">
                  <div className="text-xs font-mono text-zinc-400">
                    Core Brand Impressions
                  </div>
                  <div className="space-y-2.5">
                    {PORTFOLIO_PROFILE.brandPillars.map((pillar, idx) => (
                      <div
                        key={pillar.title}
                        className="flex items-baseline justify-between gap-4 text-xs border-b border-zinc-900 pb-2 last:border-none last:pb-0"
                      >
                        <span className="font-mono text-zinc-500 tabular-nums">0{idx + 1}</span>
                        <span className="font-semibold text-white flex-1">{pillar.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-800/80 pt-4 flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>{PORTFOLIO_PROFILE.email}</span>
                  <a
                    href="#contact"
                    className="text-white underline underline-offset-4 hover:text-zinc-300"
                  >
                    Direct Contact
                  </a>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Key Facts Row Below Hero Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-zinc-900">
              <div className="space-y-1">
                <div className="text-xs text-zinc-500">Undergraduate Degree</div>
                <div className="text-xl font-bold text-white font-display">B.Tech in EEE</div>
                <div className="text-xs text-zinc-400">MLRITM, Hyderabad</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-zinc-500">Graduation & Academic Standing</div>
                <div className="text-xl font-bold text-white font-mono tabular-nums">
                  2027 · 7.8 CGPA
                </div>
                <div className="text-xs text-zinc-400">Verified Academic Record</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-zinc-500">Immediate Technical Focus</div>
                <div className="text-xl font-bold text-white font-display">
                  Linux · Git · AWS
                </div>
                <div className="text-xs text-zinc-400">Plus GitHub Actions CI/CD</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-zinc-500">Target Career Domains</div>
                <div className="text-xl font-bold text-white font-display">
                  AI/ML · Fintech · DevTools
                </div>
                <div className="text-xs text-zinc-400">Full-Time DevOps Engineering</div>
              </div>
            </div>
          </div>
        </section>

        {/* 01. About & Career Objectives */}
        <section id="about" className="py-20 border-b border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-mono text-zinc-400">
                  01. Personal Identity & Career Direction
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Disciplined Transition Toward DevOps Engineering
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Built for engineering hiring managers at venture-backed startups, recruiters at
                  large technology companies, prospective freelance clients, and fellow open-source
                  contributors.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-4 text-sm md:text-base text-zinc-300 leading-relaxed">
                {PORTFOLIO_PROFILE.bioParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* 3 Brand Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-900">
              {PORTFOLIO_PROFILE.brandPillars.map((pillar, idx) => (
                <div
                  key={pillar.title}
                  className="p-6 bg-[#0A0A0C] border border-zinc-800/90 rounded-xl space-y-2.5"
                >
                  <div className="text-xs font-mono text-zinc-500 tabular-nums">0{idx + 1}</div>
                  <h3 className="text-base font-semibold text-white">{pillar.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 02. Technical Skills & Transparent Proficiency Matrix */}
        <section id="skills" className="py-20 border-b border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="text-xs font-mono text-zinc-400">
                  02. Technical Foundation & Roadmap Transparency
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Verified Skills & Current Learning Status
                </h2>
                <p className="text-sm text-zinc-400">
                  Every skill is categorized transparently into active foundational practice,
                  subjects currently in study, or upcoming roadmap milestones.
                </p>
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-64">
                <label htmlFor="skill-search-input" className="sr-only">
                  Filter skills by keyword
                </label>
                <Search
                  className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  id="skill-search-input"
                  type="text"
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  placeholder="Search Linux, AWS, grep..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs text-white bg-[#0A0A0C] border border-zinc-800 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:border-white"
                />
              </div>
            </div>

            {/* Interactive Segmented Filter Controls */}
            <div
              className="flex flex-wrap items-center gap-1 p-1 bg-[#0A0A0C] border border-zinc-800 rounded-lg w-fit"
              role="group"
              aria-label="Filter Technical Skills by Stage"
            >
              {[
                { id: 'all', label: 'All Capabilities (9)' },
                { id: 'foundational', label: 'Foundational & Active Practice (3)' },
                { id: 'learning', label: 'Currently Learning (3)' },
                { id: 'planned', label: 'Planned on Roadmap (3)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSkillFilter(tab.id as SkillFilter)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    skillFilter === tab.id
                      ? 'bg-white text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            {filteredSkills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredSkills.map((skill) => (
                  <article
                    key={skill.id}
                    className="p-6 bg-[#0A0A0C] border border-zinc-800 rounded-xl flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <h3 className="text-base font-semibold text-white">{skill.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                        <span>{skill.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-zinc-300">{skill.stageLabel}</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed pt-1">{skill.summary}</p>
                    </div>
                    <div className="pt-3 border-t border-zinc-900 text-xs text-zinc-500">
                      {skill.verifiedNote}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-[#0A0A0C] border border-zinc-800 rounded-xl text-center space-y-3">
                <p className="text-sm text-zinc-300">
                  No skills matched &ldquo;{skillQuery}&rdquo; in this category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSkillFilter('all');
                    setSkillQuery('');
                  }}
                  className="px-4 py-2 text-xs font-medium text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Reset Skill Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 03. Experience & Education */}
        <section id="experience" className="py-20 border-b border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            <div className="space-y-3 max-w-2xl">
              <div className="text-xs font-mono text-zinc-400">
                03. Industrial Training, Education & Credentials
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Experience & Academic Foundation
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Substation Internship Card */}
              {EXPERIENCE_DATA.map((exp) => (
                <div
                  key={exp.id}
                  className="p-8 bg-[#0A0A0C] border border-zinc-800 rounded-xl flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono">
                      <span>{exp.type}</span>
                      <span aria-hidden="true">·</span>
                      <span>{exp.location}</span>
                      <span aria-hidden="true">·</span>
                      <span>{exp.dateLabel}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>

                    <ul className="space-y-2 text-sm text-zinc-300">
                      {exp.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="font-mono text-xs text-zinc-500 mt-1">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-lg text-xs text-zinc-400 leading-relaxed">
                    <span className="font-semibold text-zinc-200">Verification Note: </span>
                    {exp.verificationNotice}
                  </div>
                </div>
              ))}

              {/* Education Card */}
              <div className="p-8 bg-[#0A0A0C] border border-zinc-800 rounded-xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono">
                    <span>Undergraduate Degree</span>
                    <span aria-hidden="true">·</span>
                    <span>Expected Graduation: {PORTFOLIO_PROFILE.education.expectedGraduation}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-white">CGPA: {PORTFOLIO_PROFILE.education.cgpa}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {PORTFOLIO_PROFILE.education.degree}
                  </h3>

                  <p className="text-sm text-zinc-300">
                    {PORTFOLIO_PROFILE.education.institution},{' '}
                    {PORTFOLIO_PROFILE.education.location}
                  </p>

                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {PORTFOLIO_PROFILE.education.notes}
                  </p>
                </div>

                <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-lg text-xs text-zinc-400 leading-relaxed">
                  <span className="font-semibold text-zinc-200">
                    Certifications & Formal Achievements:{' '}
                  </span>
                  {PORTFOLIO_PROFILE.certificationsNotice}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04. Projects & Hands-On Practice Labs */}
        <section id="projects" className="py-20 border-b border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 space-y-10">
            <div className="space-y-3 max-w-2xl">
              <div className="text-xs font-mono text-zinc-400">
                04. Projects & Technical Practice
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Hands-On Practice Labs & Academic Work
              </h2>
              <p className="text-sm text-zinc-400">
                Select any card below to inspect the full documented scope, tools practiced, and
                transparent verification status.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {PROJECTS_DATA.map((project) => (
                <article
                  key={project.id}
                  className="p-8 bg-[#0A0A0C] border border-zinc-800 rounded-2xl flex flex-col justify-between space-y-6 hover:border-zinc-600 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono">
                      <span>{project.index}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-zinc-200">{project.statusLabel}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white">{project.title}</h3>

                    <p className="text-sm text-zinc-300 leading-relaxed">{project.summary}</p>

                    <ul className="space-y-1.5 text-xs text-zinc-400 pt-2">
                      {project.implementationDetails.slice(0, 3).map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-mono text-zinc-500">-</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-zinc-900">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
                      {project.technologies.map((tech, idx) => (
                        <React.Fragment key={tech}>
                          <span>{tech}</span>
                          {idx < project.technologies.length - 1 && (
                            <span aria-hidden="true" className="text-zinc-600">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-500 italic">{project.verificationNotice}</p>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="px-4 py-2 text-xs font-semibold text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Inspect Lab Details
                      </button>
                      {project.repositoryUrl && (
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-white transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>GitHub Profile</span>
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 05. Planned 90-Day DevOps Development Roadmap */}
        <section id="roadmap" className="py-20 border-b border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="text-xs font-mono text-zinc-400">
                  05. Structured Learning Journey
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Planned 90-Day DevOps Development Roadmap
                </h2>
                <p className="text-sm text-zinc-400">
                  Note: These phases are planned learning objectives, not completed achievements.
                  You can toggle milestones below to simulate roadmap progression.
                </p>
              </div>

              {/* Interactive Checklist Progress Summary */}
              <div className="p-4 bg-[#0A0A0C] border border-zinc-800 rounded-xl min-w-[240px] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Simulated Progress</span>
                  <span className="text-white font-semibold tabular-nums">
                    {roadmapStats.completedCount} / {roadmapStats.totalCount} ({roadmapStats.percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-200"
                    style={{ width: `${roadmapStats.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {ROADMAP_PHASES.map((phase, index) => {
                const phaseStat = roadmapStats.phaseBreakdown[index];
                return (
                  <div
                    key={phase.id}
                    className="p-6 bg-[#0A0A0C] border border-zinc-800 rounded-xl flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                        <span>
                          Phase {phase.phaseNumber} · {phase.windowLabel}
                        </span>
                        <span className="tabular-nums">
                          {phaseStat.completed}/{phaseStat.total}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">{phase.summary}</p>

                      <div className="space-y-2.5 pt-2 border-t border-zinc-900">
                        {phase.tasks.map((task) => {
                          const isChecked = completedTasks.includes(task.id);
                          return (
                            <button
                              key={task.id}
                              type="button"
                              onClick={() => toggleRoadmapTask(task.id)}
                              className="w-full flex items-start gap-3 text-left p-2.5 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-colors cursor-pointer"
                            >
                              {isChecked ? (
                                <CheckSquare
                                  className="w-4 h-4 text-white shrink-0 mt-0.5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Square
                                  className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5"
                                  aria-hidden="true"
                                />
                              )}
                              <span
                                className={`text-xs leading-relaxed ${
                                  isChecked ? 'text-white line-through' : 'text-zinc-300'
                                }`}
                              >
                                {task.text}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-900 text-xs font-mono text-zinc-500">
                      {phase.statusLabel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 06. AI Portfolio Assistant & Monochrome Visual Studio */}
        <AiStudioSection />

        {/* 07. Contact & Validated Inquiry Form */}
        <section id="contact" className="py-20 border-t border-zinc-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left 5 Cols: Direct Verified Contact Channels */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-zinc-400">07. Direct Contact</div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    Connect With {PORTFOLIO_PROFILE.fullName}
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Available for entry-level DevOps Engineer opportunities, internships, and
                    collaborative infrastructure projects in Hyderabad or remote.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="p-4 bg-[#0A0A0C] border border-zinc-800 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-zinc-500">Email Address</div>
                      <a
                        href={`mailto:${PORTFOLIO_PROFILE.email}`}
                        className="text-sm font-mono text-white hover:underline"
                      >
                        {PORTFOLIO_PROFILE.email}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(PORTFOLIO_PROFILE.email, 'email')}
                      aria-label="Copy Email Address"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:text-white cursor-pointer"
                    >
                      {copiedField === 'email' ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Phone */}
                  <div className="p-4 bg-[#0A0A0C] border border-zinc-800 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-zinc-500">Phone (India)</div>
                      <a
                        href={`tel:${PORTFOLIO_PROFILE.phone.replace(/\s+/g, '')}`}
                        className="text-sm font-mono text-white hover:underline tabular-nums"
                      >
                        {PORTFOLIO_PROFILE.phone}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(PORTFOLIO_PROFILE.phone, 'phone')}
                      aria-label="Copy Phone Number"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:text-white cursor-pointer"
                    >
                      {copiedField === 'phone' ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Social Profiles */}
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href={PORTFOLIO_PROFILE.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-[#0A0A0C] border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs text-zinc-500">GitHub</div>
                        <div className="text-xs font-mono text-white mt-0.5">@karthikbingi9</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-zinc-400" aria-hidden="true" />
                    </a>
                    <a
                      href={PORTFOLIO_PROFILE.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-[#0A0A0C] border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs text-zinc-500">LinkedIn</div>
                        <div className="text-xs font-mono text-white mt-0.5">/in/karthikbingi</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-zinc-400" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right 7 Cols: Interactive Contact Form */}
              <div className="lg:col-span-7 bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-8 space-y-6">
                <h3 className="text-lg font-bold text-white">Send a Direct Inquiry</h3>

                <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-zinc-300 mb-1.5"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={contactInput.name}
                        onChange={(e) =>
                          setContactInput((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-3.5 py-2.5 text-sm text-white bg-zinc-950 border border-zinc-800 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:border-white"
                      />
                      {contactErrors.name && (
                        <p role="alert" className="text-xs text-zinc-300 mt-1 font-mono">
                          ! {contactErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-zinc-300 mb-1.5"
                      >
                        Your Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={contactInput.email}
                        onChange={(e) =>
                          setContactInput((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 text-sm text-white bg-zinc-950 border border-zinc-800 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:border-white"
                      />
                      {contactErrors.email && (
                        <p role="alert" className="text-xs text-zinc-300 mt-1 font-mono">
                          ! {contactErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-medium text-zinc-300 mb-1.5"
                    >
                      Role / Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={contactInput.subject}
                      onChange={(e) =>
                        setContactInput((prev) => ({ ...prev, subject: e.target.value }))
                      }
                      placeholder="e.g. Junior DevOps Engineer Role / Collaboration"
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-zinc-950 border border-zinc-800 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:border-white"
                    />
                    {contactErrors.subject && (
                      <p role="alert" className="text-xs text-zinc-300 mt-1 font-mono">
                        ! {contactErrors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-zinc-300 mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={contactInput.message}
                      onChange={(e) =>
                        setContactInput((prev) => ({ ...prev, message: e.target.value }))
                      }
                      placeholder="Share details about the opportunity, team, or technical discussion..."
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-zinc-950 border border-zinc-800 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:border-white resize-none"
                    />
                    {contactErrors.message && (
                      <p role="alert" className="text-xs text-zinc-300 mt-1 font-mono">
                        ! {contactErrors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Send Inquiry
                  </button>
                </form>

                {/* Recorded Inquiries Confirmation List */}
                {submittedInquiries.length > 0 && (
                  <div
                    data-testid="submitted-inquiries-log"
                    className="pt-4 border-t border-zinc-800 space-y-3"
                  >
                    <div className="text-xs font-semibold text-white">
                      Recorded Inquiry Dispatch ({submittedInquiries.length})
                    </div>
                    {submittedInquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between text-zinc-300 font-medium">
                          <span>
                            {inq.subject} — from {inq.name} ({inq.email})
                          </span>
                          <span className="font-mono text-zinc-500">{inq.submittedAt}</span>
                        </div>
                        <p className="text-zinc-400">{inq.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Minimalist Footer */}
      <footer className="py-10 border-t border-zinc-900 text-xs text-zinc-500 no-print">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {PORTFOLIO_PROFILE.displayName} <span aria-hidden="true">·</span> DevOps Engineer
            Portfolio <span aria-hidden="true">·</span> Hyderabad, India
          </div>
          <div className="flex items-center gap-6">
            <a
              href={PORTFOLIO_PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href={PORTFOLIO_PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <button
              type="button"
              onClick={() => setIsResumeOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Printable Résumé
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
