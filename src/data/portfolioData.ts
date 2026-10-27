export type SkillStage = 'foundational' | 'learning' | 'planned';

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  stage: SkillStage;
  stageLabel: string;
  summary: string;
  verifiedNote: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  category: string;
  statusLabel: string;
  isVerifiedComplete: boolean;
  summary: string;
  problemStatement: string;
  implementationDetails: string[];
  technologies: string[];
  verificationNotice: string;
  repositoryUrl?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  dateLabel: string;
  type: string;
  highlights: string[];
  verificationNotice: string;
}

export interface RoadmapTask {
  id: string;
  text: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: string;
  windowLabel: string;
  title: string;
  statusLabel: string;
  summary: string;
  tasks: RoadmapTask[];
}

export const PORTFOLIO_PROFILE = {
  fullName: 'Bingi Karthik',
  displayName: 'BINGI KARTHIK',
  monogram: 'BK',
  role: 'DevOps Engineer',
  level: 'Early-Career / Fresher (Class of 2027)',
  location: 'Hyderabad, Telangana, India',
  email: 'karthikbingi9@gmail.com',
  phone: '+91 7207187870',
  githubUrl: 'https://github.com/karthikbingi9',
  githubHandle: 'github.com/karthikbingi9',
  linkedinUrl: 'https://www.linkedin.com/in/karthikbingi/',
  linkedinHandle: 'linkedin.com/in/karthikbingi',
  tagline:
    'Fast-learning, adaptable aspiring DevOps Engineer building foundational fluency in Linux, Git, AWS, and CI/CD automation.',
  shortIntro:
    'Undergraduate engineering student at MLR Institute of Technology and Management (Expected 2027) focused on a disciplined career transition toward full-time DevOps Engineering.',
  bioParagraphs: [
    'I am a fast learner who adapts quickly to evolving technical environments while maintaining a high standard of professionalism and accountability. I am currently pursuing a Bachelor of Technology in Electrical and Electronics Engineering at MLR Institute of Technology and Management in Hyderabad (Expected Graduation: 2027, CGPA: 7.8).',
    'My immediate technical focus is building a strong, practical foundation in Linux system administration, Git version control, Amazon Web Services (AWS), computer networking fundamentals, and CI/CD workflow automation with GitHub Actions.',
    'Rather than overstating unverified credentials, this portfolio documents my confirmed academic background, industrial training, hands-on command-line practice, and my structured 90-day development roadmap toward production-ready DevOps engineering.'
  ],
  brandPillars: [
    {
      title: 'Meticulous & High-Craft',
      description:
        'Focused on clean documentation, reproducible command-line workflows, and disciplined foundational practice before scaling complexity.'
    },
    {
      title: 'Systems Thinker',
      description:
        'Approaching operating systems, version control, networking, and cloud infrastructure as interconnected components that require clear mental models.'
    },
    {
      title: 'Product-Minded Engineer',
      description:
        'Aligning infrastructure and deployment automation with developer velocity across AI/ML infrastructure, Fintech, and Developer Tools.'
    }
  ],
  careerGoals: {
    targetRole: 'Full-Time DevOps Engineer',
    targetDomains: ['AI/ML Infrastructure', 'Fintech', 'Developer Tools'],
    targetAudience: [
      'Engineering hiring managers at venture-backed startups',
      'Recruiters at large technology organizations',
      'Prospective freelance collaborators',
      'Open-source contributors'
    ]
  },
  education: {
    degree: 'Bachelor of Technology (B.Tech) in Electrical and Electronics Engineering',
    institution: 'MLR Institute of Technology and Management (MLRITM)',
    location: 'Hyderabad, Telangana, India',
    expectedGraduation: '2027',
    cgpa: '7.8 / 10.0',
    notes:
      'Pursuing core undergraduate engineering degree while actively building practical DevOps Engineering skills.'
  },
  certificationsNotice:
    'No formal certifications, competition rankings, or course-completion credentials are currently listed. Section intentionally kept transparent until credentials are earned and verified.'
};

export const SKILLS_DATA: SkillItem[] = [
  {
    id: 'linux',
    name: 'Linux Operating System',
    category: 'Operating Systems',
    stage: 'foundational',
    stageLabel: 'Beginner · Active Practice',
    summary:
      'Practicing command-line navigation, file-system operations, file permissions, text searching with grep and regular expressions, process inspection, and package management.',
    verifiedNote: 'Confirmed beginner proficiency through hands-on CLI practice.'
  },
  {
    id: 'git',
    name: 'Git Version Control',
    category: 'Version Control',
    stage: 'foundational',
    stageLabel: 'Fundamentals · Active Practice',
    summary:
      'Familiar with core Git commands, repository initialization, staging, commits, branching fundamentals, and remote GitHub workflows.',
    verifiedNote: 'Confirmed basic command-line familiarity.'
  },
  {
    id: 'c-java',
    name: 'C & Java Programming',
    category: 'Programming Languages',
    stage: 'foundational',
    stageLabel: 'Core Fundamentals',
    summary:
      'Foundational knowledge of structured programming in C and object-oriented programming concepts in Java.',
    verifiedNote: 'Confirmed foundational programming knowledge.'
  },
  {
    id: 'aws',
    name: 'Amazon Web Services (AWS)',
    category: 'Cloud Computing',
    stage: 'learning',
    stageLabel: 'Currently Learning',
    summary:
      'Studying core AWS infrastructure concepts including IAM, EC2, S3, VPC, and security groups for upcoming cloud lab exercises.',
    verifiedNote: 'In active study; production cloud deployments not yet confirmed.'
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions (CI/CD)',
    category: 'CI/CD Automation',
    stage: 'learning',
    stageLabel: 'Currently Learning',
    summary:
      'Studying automated continuous integration and workflow configuration in GitHub Actions.',
    verifiedNote: 'Currently learning; practical workflow implementation not yet confirmed.'
  },
  {
    id: 'networking',
    name: 'Computer Networking',
    category: 'Networking',
    stage: 'learning',
    stageLabel: 'Currently Learning',
    summary:
      'Studying core networking fundamentals to support cloud architecture, routing, and security group configuration.',
    verifiedNote: 'Foundational concepts currently in progress.'
  },
  {
    id: 'containers',
    name: 'Containerization & Orchestration',
    category: 'Containers',
    stage: 'planned',
    stageLabel: 'Planned on Roadmap',
    summary:
      'Scheduled after completing core Linux, Git, and AWS foundational milestones.',
    verifiedNote: 'Not yet started — transparently listed as a future learning goal.'
  },
  {
    id: 'iac',
    name: 'Terraform & Ansible (IaC)',
    category: 'Infrastructure as Code',
    stage: 'planned',
    stageLabel: 'Planned on Roadmap',
    summary:
      'Infrastructure provisioning and configuration management scheduled for subsequent learning phases.',
    verifiedNote: 'Not yet started — transparently listed as a future learning goal.'
  },
  {
    id: 'observability',
    name: 'Monitoring & Observability',
    category: 'Observability',
    stage: 'planned',
    stageLabel: 'Planned on Roadmap',
    summary:
      'System telemetry, logging, and alerting tools to be selected and studied after foundational deployment labs.',
    verifiedNote: 'No tools confirmed yet.'
  }
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'linux-git-practice',
    index: '01',
    title: 'Linux and Git Practice Lab',
    category: 'DevOps Practice & Technical Learning',
    statusLabel: 'Active Hands-On Practice',
    isVerifiedComplete: false,
    summary:
      'Structured command-line and version-control practice focused on building day-to-day operational fluency in Linux environments and Git workflows.',
    problemStatement:
      'Developing reliable DevOps automation requires deep comfort with the Linux shell, file permissions, process management, text processing, and clean version-control habits before moving to cloud orchestration.',
    implementationDetails: [
      'Practicing Linux commands and file-system hierarchy navigation.',
      'Learning file permissions, ownership rules, and standard command-line utilities.',
      'Performing text searching with grep and constructing regular expressions.',
      'Exploring Linux processes and package management fundamentals.',
      'Practicing Git commands and version-control fundamentals for source tracking.'
    ],
    technologies: ['Linux CLI', 'grep & Regex', 'File Permissions', 'Process Management', 'Git'],
    verificationNotice:
      'Current status: Active learning and hands-on practice. No completed production DevOps deployment or automated pipeline project has been confirmed yet.',
    repositoryUrl: 'https://github.com/karthikbingi9'
  },
  {
    id: 'eee-academic-projects',
    index: '02',
    title: 'Electrical and Electronics Engineering — Academic Projects',
    category: 'Academic Engineering Domain',
    statusLabel: 'Academic Coursework · Details Pending Confirmation',
    isVerifiedComplete: false,
    summary:
      'Academic coursework and engineering project explorations within the Electrical and Electronics Engineering curriculum at MLRITM.',
    problemStatement:
      'Applying electrical engineering principles across power electronics, electrical systems, and practical engineering applications.',
    implementationDetails: [
      'Worked on academic projects within the Electrical and Electronics Engineering domain at MLR Institute of Technology and Management.',
      'Focused on areas of interest including power electronics, electrical systems, and engineering applications.',
      'Individual project titles, specific objectives, hardware/software tools, and measured outcomes are held for formal documentation.'
    ],
    technologies: ['Electrical Systems', 'Power Electronics', 'Engineering Fundamentals'],
    verificationNotice:
      'Note: Specific project titles, objectives, tools, and implementation details are to be documented once confirmed. No unverified project metrics have been added.'
  }
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'substation-internship',
    role: 'Industrial Training / Internship — Electrical Power Substation',
    organization: 'Electrical Power Substation',
    location: 'Suraram, Hyderabad, Telangana, India',
    dateLabel: 'Dates to be confirmed',
    type: 'Industrial Training / Internship',
    highlights: [
      'Completed an on-site internship at an electrical power substation in Suraram, Hyderabad.',
      'Gained direct field exposure to the electrical power-system environment and operational substation setting.'
    ],
    verificationNotice:
      'Further details—including exact internship dates, specific equipment observed, technical responsibilities, safety procedures, and practical activities—are marked for addition after confirmation.'
  }
];

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'phase-1',
    phaseNumber: '01',
    windowLabel: 'Days 1–30',
    title: 'Phase 1: Linux and Git',
    statusLabel: 'Planned Learning Objective · Active Focus',
    summary:
      'Strengthen core command-line operations, shell scripting fundamentals, and structured version control documentation.',
    tasks: [
      {
        id: 'p1-t1',
        text: 'Strengthen command-line proficiency, permissions, processes, and basic Bash scripting.'
      },
      {
        id: 'p1-t2',
        text: 'Practice Git branching, commits, merges, and working with remote repositories.'
      },
      {
        id: 'p1-t3',
        text: 'Maintain a dedicated GitHub repository documenting exercises and lessons learned.'
      }
    ]
  },
  {
    id: 'phase-2',
    phaseNumber: '02',
    windowLabel: 'Days 31–60',
    title: 'Phase 2: AWS and GitHub Actions',
    statusLabel: 'Planned Learning Objective',
    summary:
      'Build foundational cloud infrastructure literacy on AWS and create initial automated workflows with GitHub Actions.',
    tasks: [
      {
        id: 'p2-t1',
        text: 'Study AWS IAM, EC2, S3, VPC, and security groups.'
      },
      {
        id: 'p2-t2',
        text: 'Build and document a small AWS cloud lab environment.'
      },
      {
        id: 'p2-t3',
        text: 'Create and test a basic GitHub Actions CI workflow.'
      }
    ]
  },
  {
    id: 'phase-3',
    phaseNumber: '03',
    windowLabel: 'Days 61–90',
    title: 'Phase 3: Practical Portfolio Project',
    statusLabel: 'Planned Learning Objective',
    summary:
      'Combine cloud hosting and workflow automation into a documented, reproducible deployment project.',
    tasks: [
      {
        id: 'p3-t1',
        text: 'Build a small application or static website deployment.'
      },
      {
        id: 'p3-t2',
        text: 'Automate a testing or validation step using GitHub Actions.'
      },
      {
        id: 'p3-t3',
        text: 'Document the architecture, setup instructions, security considerations, and troubleshooting process.'
      }
    ]
  }
];
