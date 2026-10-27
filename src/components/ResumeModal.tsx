import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import {
  PORTFOLIO_PROFILE,
  SKILLS_DATA,
  EXPERIENCE_DATA,
  PROJECTS_DATA,
  ROADMAP_PHASES
} from '../data/portfolioData';
import { generatePlainTextResume } from '../utils/portfolioLogic';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownloadTxt = () => {
    const content = generatePlainTextResume();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Bingi_Karthik_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <div className="relative w-full max-w-4xl bg-[#0A0A0C] border border-zinc-800 rounded-xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-zinc-800 bg-[#050505] no-print shrink-0">
          <div>
            <h2 id="resume-modal-title" className="text-base font-semibold text-white">
              Interactive Printable Résumé — {PORTFOLIO_PROFILE.fullName}
            </h2>
            <p className="text-xs text-zinc-400">
              Verified academic and DevOps foundation profile · Ready for print or text export
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-200 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download .TXT</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Résumé Modal"
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-6 md:p-10 overflow-y-auto space-y-8 print-only-sheet text-zinc-200">
          {/* Header */}
          <div className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {PORTFOLIO_PROFILE.displayName}
              </h1>
              <p className="text-sm text-zinc-300 mt-1">
                {PORTFOLIO_PROFILE.role} <span aria-hidden="true">·</span> {PORTFOLIO_PROFILE.level}
              </p>
              <p className="text-xs text-zinc-400 mt-1">{PORTFOLIO_PROFILE.location}</p>
            </div>
            <div className="text-xs text-zinc-300 space-y-1 md:text-right font-mono">
              <div>{PORTFOLIO_PROFILE.email}</div>
              <div>{PORTFOLIO_PROFILE.phone}</div>
              <div>{PORTFOLIO_PROFILE.githubHandle}</div>
              <div>{PORTFOLIO_PROFILE.linkedinHandle}</div>
            </div>
          </div>

          {/* Summary */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wider text-zinc-400">
              01. Professional Summary
            </h3>
            <p className="text-sm text-zinc-200 leading-relaxed">
              {PORTFOLIO_PROFILE.bioParagraphs[0]} {PORTFOLIO_PROFILE.bioParagraphs[1]}
            </p>
          </section>

          {/* Education */}
          <section className="space-y-3 border-t border-zinc-800/80 pt-6">
            <h3 className="text-xs font-semibold tracking-wider text-zinc-400">
              02. Education
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {PORTFOLIO_PROFILE.education.degree}
                </h4>
                <p className="text-xs text-zinc-300">
                  {PORTFOLIO_PROFILE.education.institution} <span aria-hidden="true">·</span>{' '}
                  {PORTFOLIO_PROFILE.education.location}
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-300 tabular-nums shrink-0">
                Expected Graduation: {PORTFOLIO_PROFILE.education.expectedGraduation}{' '}
                <span aria-hidden="true">·</span> CGPA: {PORTFOLIO_PROFILE.education.cgpa}
              </div>
            </div>
          </section>

          {/* Technical Skills */}
          <section className="space-y-3 border-t border-zinc-800/80 pt-6">
            <h3 className="text-xs font-semibold tracking-wider text-zinc-400">
              03. Technical Skills & Transparent Proficiency Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SKILLS_DATA.map((skill) => (
                <div key={skill.id} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-white">{skill.name}</span>
                    <span className="text-xs text-zinc-400">{skill.stageLabel}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{skill.summary}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="space-y-3 border-t border-zinc-800/80 pt-6">
            <h3 className="text-xs font-semibold tracking-wider text-zinc-400">
              04. Industrial Training & Experience
            </h3>
            {EXPERIENCE_DATA.map((exp) => (
              <div key={exp.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h4 className="text-sm font-semibold text-white">{exp.role}</h4>
                  <span className="text-xs text-zinc-400 font-mono">
                    {exp.location} <span aria-hidden="true">·</span> {exp.dateLabel}
                  </span>
                </div>
                <ul className="list-disc list-inside text-xs text-zinc-300 space-y-1">
                  {exp.highlights.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <p className="text-xs text-zinc-500 italic">{exp.verificationNotice}</p>
              </div>
            ))}
          </section>

          {/* Projects & Practice Labs */}
          <section className="space-y-4 border-t border-zinc-800/80 pt-6">
            <h3 className="text-xs font-semibold tracking-wider text-zinc-400">
              05. Projects & Hands-On Practice Labs
            </h3>
            {PROJECTS_DATA.map((proj) => (
              <div key={proj.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h4 className="text-sm font-semibold text-white">
                    {proj.index}. {proj.title}
                  </h4>
                  <span className="text-xs text-zinc-400">{proj.statusLabel}</span>
                </div>
                <p className="text-xs text-zinc-300">{proj.summary}</p>
                <p className="text-xs text-zinc-500 italic">{proj.verificationNotice}</p>
              </div>
            ))}
          </section>

          {/* 90-Day Roadmap */}
          <section className="space-y-3 border-t border-zinc-800/80 pt-6">
            <h3 className="text-xs font-semibold tracking-wider text-zinc-400">
              06. Planned 90-Day DevOps Development Roadmap
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ROADMAP_PHASES.map((phase) => (
                <div key={phase.id} className="space-y-1.5">
                  <div className="text-xs font-semibold text-white">{phase.title}</div>
                  <div className="text-xs text-zinc-400">
                    {phase.windowLabel} <span aria-hidden="true">·</span> Planned Objective
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1">
                    {phase.tasks.map((t) => (
                      <li key={t.id}>- {t.text}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
