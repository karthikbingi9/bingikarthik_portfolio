import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterSkills,
  calculateRoadmapProgress,
  validateContactForm,
  resolveChatModel,
  validateImageRequest,
  generatePlainTextResume,
  extractSearchGroundingSources
} from './portfolioLogic';
import { SKILLS_DATA, ROADMAP_PHASES } from '../data/portfolioData';

test('filterSkills filters accurately by stage and search query', () => {
  const all = filterSkills(SKILLS_DATA, 'all');
  assert.equal(all.length, SKILLS_DATA.length);

  const foundational = filterSkills(SKILLS_DATA, 'foundational');
  assert.equal(foundational.length, 3);
  assert.ok(foundational.every((s) => s.stage === 'foundational'));

  const learning = filterSkills(SKILLS_DATA, 'learning');
  assert.equal(learning.length, 3);
  assert.ok(learning.every((s) => s.stage === 'learning'));

  const planned = filterSkills(SKILLS_DATA, 'planned');
  assert.equal(planned.length, 3);
  assert.ok(planned.every((s) => s.stage === 'planned'));

  const linuxSearch = filterSkills(SKILLS_DATA, 'all', 'grep');
  assert.equal(linuxSearch.length, 1);
  assert.equal(linuxSearch[0].id, 'linux');
});

test('calculateRoadmapProgress computes overall and per-phase percentages', () => {
  const initial = calculateRoadmapProgress(ROADMAP_PHASES, []);
  assert.equal(initial.completedCount, 0);
  assert.equal(initial.totalCount, 9);
  assert.equal(initial.percentage, 0);

  const phase1Done = calculateRoadmapProgress(ROADMAP_PHASES, ['p1-t1', 'p1-t2', 'p1-t3']);
  assert.equal(phase1Done.completedCount, 3);
  assert.equal(phase1Done.percentage, 33);
  assert.equal(phase1Done.phaseBreakdown[0].percentage, 100);
  assert.equal(phase1Done.phaseBreakdown[1].percentage, 0);
});

test('validateContactForm enforces required fields and email format', () => {
  const emptyResult = validateContactForm({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  assert.equal(emptyResult.isValid, false);
  assert.ok(emptyResult.errors.name);
  assert.ok(emptyResult.errors.email);
  assert.ok(emptyResult.errors.subject);
  assert.ok(emptyResult.errors.message);

  const invalidEmailResult = validateContactForm({
    name: 'Recruiter Name',
    email: 'invalid-email',
    subject: 'DevOps Role',
    message: 'We would love to connect regarding our junior DevOps role.'
  });
  assert.equal(invalidEmailResult.isValid, false);
  assert.ok(invalidEmailResult.errors.email);

  const validResult = validateContactForm({
    name: 'Anita Rao',
    email: 'anita@techcorp.io',
    subject: 'Junior DevOps Engineer Interview',
    message: 'Hi Karthik, we reviewed your Linux and AWS roadmap and would like to chat.'
  });
  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test('resolveChatModel maps task complexity modes to required Gemini models', () => {
  assert.equal(resolveChatModel('fast'), 'gemini-3.1-flash-lite');
  assert.equal(resolveChatModel('general'), 'gemini-3.8-flash');
  assert.equal(resolveChatModel('complex'), 'gemini-4-argon');
});

test('validateImageRequest checks prompt, resolution (1K/2K/4K), and aspect ratio', () => {
  const empty = validateImageRequest('   ', '1K', '16:9');
  assert.equal(empty.isValid, false);

  const badSize = validateImageRequest('Minimalist server rack', '8K', '16:9');
  assert.equal(badSize.isValid, false);

  const valid = validateImageRequest('Brutalist server architecture', '2K', '16:9');
  assert.equal(valid.isValid, true);
  assert.ok(valid.normalizedPrompt.includes('Strict black-and-white monochrome'));
});

test('generatePlainTextResume includes verified contact, education, and transparency notices', () => {
  const resumeText = generatePlainTextResume();
  assert.ok(resumeText.includes('BINGI KARTHIK'));
  assert.ok(resumeText.includes('karthikbingi9@gmail.com'));
  assert.ok(resumeText.includes('+91 7207187870'));
  assert.ok(resumeText.includes('MLR Institute of Technology and Management'));
  assert.ok(resumeText.includes('7.8 / 10.0'));
  assert.ok(resumeText.includes('Suraram, Hyderabad'));
});

test('extractSearchGroundingSources extracts and deduplicates web grounding chunks', () => {
  const chunks = [
    { web: { uri: 'https://docs.github.com/en/actions', title: 'GitHub Actions Documentation' } },
    { web: { uri: 'https://docs.github.com/en/actions', title: 'Duplicate Entry' } },
    { web: { uri: 'https://aws.amazon.com/ec2/', title: 'Amazon EC2' } },
    {}
  ];
  const sources = extractSearchGroundingSources(chunks);
  assert.equal(sources.length, 2);
  assert.equal(sources[0].uri, 'https://docs.github.com/en/actions');
  assert.equal(sources[0].title, 'GitHub Actions Documentation');
  assert.equal(sources[1].uri, 'https://aws.amazon.com/ec2/');
});
