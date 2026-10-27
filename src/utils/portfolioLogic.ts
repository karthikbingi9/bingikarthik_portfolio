import {
  SkillItem,
  SkillStage,
  RoadmapPhase,
  PORTFOLIO_PROFILE,
  SKILLS_DATA,
  EXPERIENCE_DATA,
  PROJECTS_DATA,
  ROADMAP_PHASES
} from '../data/portfolioData';

export type SkillFilter = 'all' | SkillStage;

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
}

export type ChatTaskMode = 'general' | 'fast' | 'complex';
export type ImageResolutionSize = '1K' | '2K' | '4K';
export type SupportedAspectRatio = '1:1' | '4:3' | '16:9';

export function filterSkills(
  skills: SkillItem[],
  filter: SkillFilter,
  query: string = ''
): SkillItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  return skills.filter((skill) => {
    const matchesStage = filter === 'all' || skill.stage === filter;
    if (!matchesStage) return false;
    if (!normalizedQuery) return true;
    return (
      skill.name.toLowerCase().includes(normalizedQuery) ||
      skill.category.toLowerCase().includes(normalizedQuery) ||
      skill.summary.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function calculateRoadmapProgress(
  phases: RoadmapPhase[],
  completedTaskIds: string[]
): {
  completedCount: number;
  totalCount: number;
  percentage: number;
  phaseBreakdown: Array<{
    phaseId: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
} {
  const completedSet = new Set(completedTaskIds);
  let totalCount = 0;
  let completedCount = 0;

  const phaseBreakdown = phases.map((phase) => {
    const total = phase.tasks.length;
    const completed = phase.tasks.filter((t) => completedSet.has(t.id)).length;
    totalCount += total;
    completedCount += completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      phaseId: phase.id,
      completed,
      total,
      percentage
    };
  });

  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    completedCount,
    totalCount,
    percentage,
    phaseBreakdown
  };
}

export function validateContactForm(input: ContactFormInput): ContactValidationResult {
  const errors: ContactValidationResult['errors'] = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const subject = input.subject.trim();
  const message = input.message.trim();

  if (!name) {
    errors.name = 'Please enter your full name.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!subject) {
    errors.subject = 'Please specify a subject or role inquiry.';
  }

  if (!message) {
    errors.message = 'Please enter a message.';
  } else if (message.length < 10) {
    errors.message = 'Message must be at least 10 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function resolveChatModel(mode: ChatTaskMode): string {
  switch (mode) {
    case 'fast':
      return 'gemini-3.1-flash-lite';
    case 'complex':
      return 'gemini-4-argon';
    case 'general':
    default:
      return 'gemini-3.8-flash';
  }
}

export function validateImageRequest(
  prompt: string,
  size: string,
  aspectRatio: string
): { isValid: boolean; error?: string; normalizedPrompt: string } {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a visual prompt to generate an image.',
      normalizedPrompt: ''
    };
  }
  const validSizes: ImageResolutionSize[] = ['1K', '2K', '4K'];
  if (!validSizes.includes(size as ImageResolutionSize)) {
    return {
      isValid: false,
      error: 'Resolution size must be 1K, 2K, or 4K.',
      normalizedPrompt: trimmed
    };
  }
  const validRatios: SupportedAspectRatio[] = ['1:1', '4:3', '16:9'];
  if (!validRatios.includes(aspectRatio as SupportedAspectRatio)) {
    return {
      isValid: false,
      error: 'Aspect ratio must be 1:1, 4:3, or 16:9.',
      normalizedPrompt: trimmed
    };
  }

  const normalizedPrompt = `${trimmed}. Strict black-and-white monochrome editorial aesthetic, high contrast, architectural minimalism, zero color saturation.`;
  return {
    isValid: true,
    normalizedPrompt
  };
}

export function generatePlainTextResume(): string {
  const lines: string[] = [
    `${PORTFOLIO_PROFILE.displayName}`,
    `${PORTFOLIO_PROFILE.role} — ${PORTFOLIO_PROFILE.level}`,
    `${PORTFOLIO_PROFILE.location}`,
    `Email: ${PORTFOLIO_PROFILE.email} | Phone: ${PORTFOLIO_PROFILE.phone}`,
    `GitHub: ${PORTFOLIO_PROFILE.githubUrl}`,
    `LinkedIn: ${PORTFOLIO_PROFILE.linkedinUrl}`,
    '',
    '====================================================================',
    'PROFESSIONAL SUMMARY',
    '====================================================================',
    PORTFOLIO_PROFILE.tagline,
    '',
    ...PORTFOLIO_PROFILE.bioParagraphs,
    '',
    '====================================================================',
    'EDUCATION',
    '====================================================================',
    `${PORTFOLIO_PROFILE.education.degree}`,
    `${PORTFOLIO_PROFILE.education.institution}, ${PORTFOLIO_PROFILE.education.location}`,
    `Expected Graduation: ${PORTFOLIO_PROFILE.education.expectedGraduation} | CGPA: ${PORTFOLIO_PROFILE.education.cgpa}`,
    '',
    '====================================================================',
    'TECHNICAL SKILLS (VERIFIED & TRANSPARENT STATUS)',
    '====================================================================',
    ...SKILLS_DATA.map(
      (s) => `- ${s.name} [${s.stageLabel}]: ${s.summary} (${s.verifiedNote})`
    ),
    '',
    '====================================================================',
    'EXPERIENCE & INDUSTRIAL TRAINING',
    '====================================================================',
    ...EXPERIENCE_DATA.flatMap((exp) => [
      `${exp.role} (${exp.dateLabel})`,
      `${exp.organization} — ${exp.location}`,
      ...exp.highlights.map((h) => `  * ${h}`),
      `  [Note: ${exp.verificationNotice}]`,
      ''
    ]),
    '====================================================================',
    'PROJECTS & HANDS-ON PRACTICE LABS',
    '====================================================================',
    ...PROJECTS_DATA.flatMap((proj) => [
      `${proj.index}. ${proj.title} [${proj.statusLabel}]`,
      `   Summary: ${proj.summary}`,
      ...proj.implementationDetails.map((d) => `   - ${d}`),
      `   Status Notice: ${proj.verificationNotice}`,
      ''
    ]),
    '====================================================================',
    'PLANNED 90-DAY DEVOPS DEVELOPMENT ROADMAP',
    '====================================================================',
    ...ROADMAP_PHASES.flatMap((phase) => [
      `${phase.title} (${phase.windowLabel}) — ${phase.statusLabel}`,
      ...phase.tasks.map((t) => `  [ ] ${t.text}`),
      ''
    ]),
    '====================================================================',
    'CERTIFICATIONS & FORMAL ACHIEVEMENTS',
    '====================================================================',
    PORTFOLIO_PROFILE.certificationsNotice
  ];

  return lines.join('\n');
}
