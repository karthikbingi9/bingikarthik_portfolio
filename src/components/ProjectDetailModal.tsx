import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-detail-title"
    >
      <div className="relative w-full max-w-2xl bg-[#0A0A0C] border border-zinc-800 rounded-xl overflow-hidden my-auto">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-zinc-800 bg-[#050505]">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="font-mono">{project.index}</span>
            <span aria-hidden="true">·</span>
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.statusLabel}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Case Study Details"
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h2 id="project-detail-title" className="text-2xl font-bold text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm text-zinc-300 mt-2 leading-relaxed">{project.summary}</p>
          </div>

          <div className="space-y-2 border-t border-zinc-800 pt-5">
            <h3 className="text-xs font-semibold text-zinc-400">Objective & Context</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{project.problemStatement}</p>
          </div>

          <div className="space-y-2 border-t border-zinc-800 pt-5">
            <h3 className="text-xs font-semibold text-zinc-400">
              Documented Scope & Practice Activities
            </h3>
            <ul className="space-y-2 text-sm text-zinc-200">
              {project.implementationDetails.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="font-mono text-xs text-zinc-500 mt-0.5 tabular-nums">
                    0{idx + 1}.
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 border-t border-zinc-800 pt-5">
            <h3 className="text-xs font-semibold text-zinc-400">Focus Areas & Tooling</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300 font-mono">
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
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
            <div className="text-xs font-semibold text-zinc-300">
              Verification & Documentation Status
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{project.verificationNotice}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            {project.repositoryUrl ? (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Visit GitHub Profile</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            ) : (
              <span className="text-xs text-zinc-500">
                Repository link to be added upon formal documentation
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
