import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

function getGenAIClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

const PORTFOLIO_SYSTEM_INSTRUCTION = `You are the official AI Portfolio Assistant for Bingi Karthik's personal portfolio website.
Always remain truthful, concise, and professional. Never invent or fabricate achievements, certifications, work dates, or completed DevOps production deployments.

Verified Profile Facts for Bingi Karthik:
- Full Name: Bingi Karthik
- Role Goal: Full-time DevOps Engineer (Fresher / Early-Career)
- Location: Hyderabad, Telangana, India
- Contact: Email: karthikbingi9@gmail.com | Phone: +91 7207187870
- Links: GitHub: https://github.com/karthikbingi9 | LinkedIn: https://www.linkedin.com/in/karthikbingi/
- Education: Bachelor of Technology (B.Tech) in Electrical and Electronics Engineering at MLR Institute of Technology and Management (MLRITM), Hyderabad. Expected Graduation: 2027. CGPA: 7.8.
- Experience: Industrial Training / Internship at an Electrical Power Substation in Suraram, Hyderabad, Telangana (dates and specific equipment details pending confirmation).
- Technical Skills (Verified Status):
  * Foundational / Active Practice: Linux (Beginner; basic CLI commands, file operations, permissions, grep, regex, processes, package management), Git (basic command familiarity), C and Java (fundamentals).
  * Currently Learning: Amazon Web Services (AWS), GitHub Actions (CI/CD), Computer Networking fundamentals.
  * Planned on Roadmap (Not yet started): Containerization & Orchestration (Docker/Kubernetes), Infrastructure as Code (Terraform & Ansible), Monitoring & Observability.
  * Certifications: None currently listed.
- Planned 90-Day Development Roadmap:
  * Phase 1 (Linux & Git): CLI proficiency, permissions, processes, basic Bash scripting, Git branching/commits/merges, documented GitHub learning repo.
  * Phase 2 (AWS & GitHub Actions): Study IAM, EC2, S3, VPC, security groups, build a small cloud lab, create/test a basic GitHub Actions workflow.
  * Phase 3 (Practical Portfolio Project): Deploy a small application or static site, automate a testing/validation step with GitHub Actions, document architecture and troubleshooting.

If asked about unverified items, state clearly which items are confirmed and which are part of Karthik's active 90-day learning roadmap.`;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history = [], mode = 'general', rolePersona = 'recruiter' } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      const selectedModel =
        mode === 'fast'
          ? 'gemini-3.1-flash-lite'
          : mode === 'complex'
            ? 'gemini-4-argon'
            : 'gemini-3.8-flash';

      const roleAddendum =
        rolePersona === 'mentor'
          ? '\n\nCurrent Role Mode: DevOps Lab Mentor — Help Karthik or visitors design practical Linux, Git, AWS, and GitHub Actions lab exercises aligned with his 90-day roadmap.'
          : '\n\nCurrent Role Mode: Portfolio Guide for Hiring Managers & Recruiters — Answer questions clearly about Karthik Bingi, his verified skills, education, substation internship, and structured DevOps learning roadmap.';

      const ai = getGenAIClient();

      const formattedHistory = Array.isArray(history)
        ? history
            .filter(
              (item) =>
                item &&
                (item.role === 'user' || item.role === 'model') &&
                typeof item.text === 'string' &&
                item.text.trim().length > 0
            )
            .map((item) => ({
              role: item.role as 'user' | 'model',
              parts: [{ text: item.text }]
            }))
        : [];

      let response: GenerateContentResponse;
      let actualModelUsed = selectedModel;
      try {
        const chat = ai.chats.create({
          model: selectedModel,
          history: formattedHistory,
          config: {
            systemInstruction: PORTFOLIO_SYSTEM_INSTRUCTION + roleAddendum
          }
        });

        response = await chat.sendMessage({
          message: message.trim()
        });
      } catch (primaryErr: unknown) {
        if (selectedModel !== 'gemini-3.8-flash') {
          actualModelUsed = 'gemini-3.8-flash';
          const fallbackChat = ai.chats.create({
            model: 'gemini-3.8-flash',
            history: formattedHistory,
            config: {
              systemInstruction: PORTFOLIO_SYSTEM_INSTRUCTION + roleAddendum
            }
          });
          response = await fallbackChat.sendMessage({
            message: message.trim()
          });
        } else {
          throw primaryErr;
        }
      }

      const replyText = response.text || 'No response generated.';
      res.json({
        reply: replyText,
        modelUsed: actualModelUsed
      });
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error ? error.message : 'Failed to communicate with Gemini API.';
      res.status(500).json({
        error: errMessage
      });
    }
  });

  app.post('/api/generate-image', async (req, res) => {
    try {
      const {
        prompt,
        imageSize = '1K',
        aspectRatio = '16:9'
      }: {
        prompt?: string;
        imageSize?: '1K' | '2K' | '4K';
        aspectRatio?: '1:1' | '4:3' | '16:9' | '3:4' | '9:16';
      } = req.body;

      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        res.status(400).json({ error: 'Prompt is required for image generation.' });
        return;
      }

      const validSizes = ['1K', '2K', '4K'];
      const resolvedSize = validSizes.includes(imageSize) ? imageSize : '1K';
      const validRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
      const resolvedRatio = validRatios.includes(aspectRatio) ? aspectRatio : '16:9';

      const monochromePrompt = `${prompt.trim()}. Strict black-and-white monochrome editorial photography, stark architectural contrast, fine grain, zero color saturation.`;

      const ai = getGenAIClient();

      let imageUrl = '';
      let accompanyingText = '';
      let modelUsed = 'gemini-3-pro-image-preview';

      try {
        let response: GenerateContentResponse;
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
              parts: [{ text: monochromePrompt }]
            },
            config: {
              imageConfig: {
                aspectRatio: resolvedRatio,
                imageSize: resolvedSize
              }
            }
          });
        } catch (_firstErr: unknown) {
          modelUsed = 'gemini-3-pro-image';
          response = await ai.models.generateContent({
            model: 'gemini-3-pro-image',
            contents: {
              parts: [{ text: monochromePrompt }]
            },
            config: {
              imageConfig: {
                aspectRatio: resolvedRatio,
                imageSize: resolvedSize
              }
            }
          });
        }

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          } else if (part.text) {
            accompanyingText += part.text;
          }
        }
      } catch (_paidTierError: unknown) {
        const dims =
          resolvedRatio === '1:1'
            ? { w: 1024, h: 1024 }
            : resolvedRatio === '4:3'
              ? { w: 1200, h: 900 }
              : { w: 1600, h: 900 };
        const escapedPrompt = prompt
          .trim()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .slice(0, 68);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dims.w} ${dims.h}" width="${dims.w}" height="${dims.h}">
          <rect width="100%" height="100%" fill="#050505"/>
          <g stroke="#27272a" stroke-width="1">
            <line x1="0" y1="${dims.h * 0.25}" x2="${dims.w}" y2="${dims.h * 0.25}"/>
            <line x1="0" y1="${dims.h * 0.5}" x2="${dims.w}" y2="${dims.h * 0.5}"/>
            <line x1="0" y1="${dims.h * 0.75}" x2="${dims.w}" y2="${dims.h * 0.75}"/>
            <line x1="${dims.w * 0.25}" y1="0" x2="${dims.w * 0.25}" y2="${dims.h}"/>
            <line x1="${dims.w * 0.5}" y1="0" x2="${dims.w * 0.5}" y2="${dims.h}"/>
            <line x1="${dims.w * 0.75}" y1="0" x2="${dims.w * 0.75}" y2="${dims.h}"/>
          </g>
          <circle cx="${dims.w * 0.5}" cy="${dims.h * 0.45}" r="${Math.min(dims.w, dims.h) * 0.22}" fill="none" stroke="#fafafa" stroke-width="2"/>
          <rect x="${dims.w * 0.35}" y="${dims.h * 0.3}" width="${dims.w * 0.3}" height="${dims.h * 0.3}" fill="none" stroke="#a1a1aa" stroke-width="1.5"/>
          <text x="60" y="${dims.h - 90}" fill="#fafafa" font-family="monospace" font-size="24" font-weight="bold">BINGI KARTHIK · MONOCHROME STUDIO (${resolvedSize} · ${resolvedRatio})</text>
          <text x="60" y="${dims.h - 50}" fill="#a1a1aa" font-family="monospace" font-size="18">${escapedPrompt}</text>
        </svg>`;
        imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
        accompanyingText = 'Generated with monochrome architectural vector fallback (Free Tier).';
      }

      res.json({
        imageUrl,
        caption: accompanyingText,
        imageSize: resolvedSize,
        aspectRatio: resolvedRatio,
        modelUsed
      });
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error ? error.message : 'Failed to generate image via Gemini API.';
      res.status(500).json({
        error: errMessage
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://localhost:${PORT}`);
  });
}

startServer();
