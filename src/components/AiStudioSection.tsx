import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  ExternalLink,
  Search
} from 'lucide-react';
import {
  ChatTaskMode,
  ImageResolutionSize,
  SupportedAspectRatio,
  GroundingSource,
  resolveChatModel,
  validateImageRequest
} from '../utils/portfolioLogic';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  modelUsed?: string;
  sources?: GroundingSource[];
}

interface GeneratedImageItem {
  id: string;
  prompt: string;
  imageUrl: string;
  imageSize: ImageResolutionSize;
  aspectRatio: SupportedAspectRatio;
  createdAt: string;
}

interface GroundedSearchResult {
  query: string;
  answer: string;
  modelUsed: string;
  sources: GroundingSource[];
}

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-msg',
    role: 'model',
    text: "Hello! I am Bingi Karthik's Portfolio Assistant. You can ask me about his B.Tech EEE background at MLRITM (Expected 2027, CGPA 7.8), his Substation Internship in Suraram, his hands-on Linux & Git practice, or his 90-day DevOps learning roadmap. Toggle Google Search Grounding anytime for live web-backed answers.",
    modelUsed: 'gemini-3.8-flash'
  }
];

const STARTER_PROMPTS = [
  "Summarize Karthik's verified technical skills and current learning focus.",
  'What is included in his 90-day DevOps development roadmap?',
  'Tell me about his education at MLRITM and Substation internship.',
  'Suggest a beginner GitHub Actions lab for Phase 2 of his roadmap.'
];

const GROUNDED_SEARCH_PRESETS = [
  'Latest AWS IAM and EC2 security best practices for entry-level DevOps engineers',
  'GitHub Actions CI workflow best practices for static site validation',
  'Essential Linux CLI and grep commands for cloud troubleshooting'
];

const MONOCHROME_IMAGE_PRESETS = [
  'Minimalist brutalist concrete data center corridor in stark black and white',
  'Abstract geometric network topology lines on deep matte black background',
  'High-contrast monochrome architectural server rack perspective with dramatic rim light'
];

export const AiStudioSection: React.FC = () => {
  // Multi-Turn Chat State
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [chatMode, setChatMode] = useState<ChatTaskMode>('general');
  const [rolePersona, setRolePersona] = useState<'recruiter' | 'mentor'>('recruiter');
  const [useSearchGroundingInChat, setUseSearchGroundingInChat] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatThreadRef = useRef<HTMLDivElement>(null);

  // Right Column Studio Tab: 'search' (Google Search Grounding) or 'image' (1K/2K/4K Monochrome Art)
  const [activeStudioTab, setActiveStudioTab] = useState<'search' | 'image'>('search');

  // Google Search Grounding State
  const [searchQuery, setSearchQuery] = useState(GROUNDED_SEARCH_PRESETS[0]);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [groundedResult, setGroundedResult] = useState<GroundedSearchResult | null>(null);

  // Image Studio State
  const [imagePrompt, setImagePrompt] = useState(MONOCHROME_IMAGE_PRESETS[0]);
  const [imageSize, setImageSize] = useState<ImageResolutionSize>('1K');
  const [aspectRatio, setAspectRatio] = useState<SupportedAspectRatio>('16:9');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageItem[]>([]);

  useEffect(() => {
    if (chatThreadRef.current) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
    }
  }, [messages, isSendingChat]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText !== undefined ? customText : inputMessage).trim();
    if (!textToSend || isSendingChat) return;

    setChatError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend
    };

    const historyForApi = messages.map((m) => ({
      role: m.role,
      text: m.text
    }));

    setMessages((prev) => [...prev, userMsg]);
    if (customText === undefined) {
      setInputMessage('');
    }
    setIsSendingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyForApi,
          mode: chatMode,
          rolePersona,
          useSearchGrounding: useSearchGroundingInChat
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get a response from the Gemini assistant.');
      }

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply,
        modelUsed: data.modelUsed || resolveChatModel(chatMode),
        sources: Array.isArray(data.sources) ? data.sources : []
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to reach Gemini chat endpoint.';
      setChatError(msg);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_CHAT_MESSAGES);
    setChatError(null);
    setInputMessage('');
  };

  const handleGroundedSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchError('Please enter a DevOps or cloud topic to search.');
      return;
    }

    setSearchError(null);
    setIsSearchingWeb(true);

    try {
      const response = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Google Search Grounding request failed.');
      }

      setGroundedResult({
        query: trimmed,
        answer: data.answer,
        modelUsed: data.modelUsed || 'gemini-3.8-flash',
        sources: Array.isArray(data.sources) ? data.sources : []
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to complete grounded search.';
      setSearchError(msg);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageError(null);

    const validation = validateImageRequest(imagePrompt, imageSize, aspectRatio);
    if (!validation.isValid) {
      setImageError(validation.error || 'Invalid image request.');
      return;
    }

    setIsGeneratingImage(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt.trim(),
          imageSize,
          aspectRatio
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Image generation failed.');
      }

      const newItem: GeneratedImageItem = {
        id: `img-${Date.now()}`,
        prompt: imagePrompt.trim(),
        imageUrl: data.imageUrl,
        imageSize,
        aspectRatio,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setGeneratedImages((prev) => [newItem, ...prev]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate image.';
      setImageError(msg);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <section
      id="studio"
      className="py-20 border-t border-zinc-900"
      aria-labelledby="studio-heading"
    >
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs text-zinc-400 font-mono">
              06. Interactive Portfolio Assistant, Search Grounding & Visual Studio
            </div>
            <h2
              id="studio-heading"
              className="text-2xl md:text-3xl font-bold tracking-tight text-white"
            >
              Multi-Turn Portfolio Chatbot & Live Google Search Grounding
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Powered by server-side Gemini models (`gemini-3.8-flash`, `gemini-3.1-flash-lite`,
            `gemini-4-argon`), live Google Search Grounding, and a 1K/2K/4K monochrome art studio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 7 Cols: Multi-Turn Gemini Chatbot */}
          <div className="lg:col-span-7 bg-[#0A0A0C] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Top Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-zinc-300" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-white">
                    Multi-Turn Portfolio & DevOps Chatbot
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset Thread</span>
                </button>
              </div>

              {/* Role & Model Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="chat-role-select"
                    className="block text-xs text-zinc-400 mb-1.5"
                  >
                    Assistant Role Persona
                  </label>
                  <select
                    id="chat-role-select"
                    value={rolePersona}
                    onChange={(e) => setRolePersona(e.target.value as 'recruiter' | 'mentor')}
                    className="w-full px-3 py-2 text-xs text-white bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-white"
                  >
                    <option value="recruiter">Recruiter & Hiring Manager Guide</option>
                    <option value="mentor">DevOps Lab & Roadmap Mentor</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="chat-model-select"
                    className="block text-xs text-zinc-400 mb-1.5"
                  >
                    Gemini Reasoning Mode
                  </label>
                  <select
                    id="chat-model-select"
                    value={chatMode}
                    onChange={(e) => setChatMode(e.target.value as ChatTaskMode)}
                    className="w-full px-3 py-2 text-xs text-white bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-white font-mono"
                  >
                    <option value="general">General (gemini-3.8-flash)</option>
                    <option value="fast">Fast Low-Latency (gemini-3.1-flash-lite)</option>
                    <option value="complex">Complex Deep Reasoning (gemini-4-argon)</option>
                  </select>
                </div>
              </div>

              {/* Google Search Grounding Toggle for Chat */}
              <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800/90 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Globe className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
                  <span>Ground chat answers with live Google Search (gemini-3.8-flash)</span>
                </div>
                <input
                  id="chat-search-grounding-toggle"
                  type="checkbox"
                  checked={useSearchGroundingInChat}
                  onChange={(e) => setUseSearchGroundingInChat(e.target.checked)}
                  aria-label="Ground chat answers with live Google Search"
                  className="w-4 h-4 accent-white cursor-pointer"
                />
              </div>

              {/* Scrollable Message Thread */}
              <div
                ref={chatThreadRef}
                data-testid="chat-message-thread"
                className="h-72 overflow-y-auto space-y-4 pr-2 py-2 border-y border-zinc-900"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                      <span>{msg.role === 'user' ? 'You' : 'Assistant'}</span>
                      {msg.modelUsed && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{msg.modelUsed}</span>
                        </>
                      )}
                    </div>
                    <div
                      className={`max-w-[88%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-white text-black font-medium'
                          : 'bg-zinc-900/90 text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      {msg.text}

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-zinc-800 space-y-1.5">
                          <div className="text-xs font-mono text-zinc-400">
                            Google Search Grounding Citations:
                          </div>
                          <ul className="space-y-1">
                            {msg.sources.map((src) => (
                              <li key={src.uri}>
                                <a
                                  href={src.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-white underline underline-offset-2 hover:text-zinc-300 break-all"
                                >
                                  <span>{src.title}</span>
                                  <ExternalLink
                                    className="w-3 h-3 shrink-0"
                                    aria-hidden="true"
                                  />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isSendingChat && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400 py-2 font-mono">
                    <span>
                      Generating response with{' '}
                      {useSearchGroundingInChat
                        ? 'gemini-3.8-flash + googleSearch'
                        : resolveChatModel(chatMode)}
                      ...
                    </span>
                  </div>
                )}
              </div>

              {chatError && (
                <div
                  role="alert"
                  className="p-3 text-xs text-zinc-200 bg-zinc-900 border border-zinc-700 rounded-lg"
                >
                  <span className="font-semibold text-white">Assistant Notice: </span>
                  {chatError}
                </div>
              )}

              {/* Quick Starter Prompts */}
              <div className="space-y-1.5">
                <div className="text-xs text-zinc-500">Suggested Questions:</div>
                <div className="flex flex-wrap gap-2">
                  {STARTER_PROMPTS.map((promptText) => (
                    <button
                      key={promptText}
                      type="button"
                      onClick={() => handleSendMessage(promptText)}
                      disabled={isSendingChat}
                      className="px-3 py-1.5 text-xs text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-white transition-colors text-left cursor-pointer disabled:opacity-50"
                    >
                      {promptText}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3 pt-2"
            >
              <label htmlFor="portfolio-chat-input" className="sr-only">
                Ask a question about Bingi Karthik
              </label>
              <input
                id="portfolio-chat-input"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about Karthik's education, Linux practice, or 90-day DevOps roadmap..."
                className="flex-1 px-4 py-2.5 text-sm text-white bg-zinc-950 border border-zinc-800 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                disabled={isSendingChat || !inputMessage.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* Right 5 Cols: Segmented Studio for Live Google Search Grounding & Monochrome Art Generator */}
          <div className="lg:col-span-5 bg-[#0A0A0C] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
            {/* Segmented Mode Switcher */}
            <div className="space-y-4">
              <div
                className="grid grid-cols-2 gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-lg"
                role="group"
                aria-label="Select Studio Utility"
              >
                <button
                  type="button"
                  onClick={() => setActiveStudioTab('search')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeStudioTab === 'search'
                      ? 'bg-white text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Google Search Grounding</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStudioTab('image')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeStudioTab === 'image'
                      ? 'bg-white text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Monochrome Visuals</span>
                </button>
              </div>

              {activeStudioTab === 'search' ? (
                /* Tab 1: Live Google Search Grounding (gemini-3.8-flash + googleSearch) */
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                    <h3 className="text-base font-semibold text-white">
                      DevOps & Cloud Research Grounding
                    </h3>
                    <span className="text-xs font-mono text-zinc-400">
                      gemini-3.8-flash · googleSearch
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Query live web documentation and up-to-date engineering guidance across AWS,
                    Linux, Git, and GitHub Actions with verifiable source citations.
                  </p>

                  <form onSubmit={handleGroundedSearch} className="space-y-4">
                    <div>
                      <label
                        htmlFor="grounded-search-input"
                        className="block text-xs text-zinc-300 font-medium mb-1.5"
                      >
                        Technical Research Query
                      </label>
                      <textarea
                        id="grounded-search-input"
                        rows={2}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search live AWS, GitHub Actions, or Linux documentation..."
                        className="w-full px-3.5 py-2.5 text-xs text-white bg-zinc-950 border border-zinc-800 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:border-white resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs text-zinc-500">Research Topics:</div>
                      <div className="flex flex-col gap-1.5">
                        {GROUNDED_SEARCH_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setSearchQuery(preset)}
                            className="px-3 py-1.5 text-xs text-zinc-400 bg-zinc-950 border border-zinc-800/80 rounded-lg hover:text-white hover:border-zinc-700 transition-colors text-left truncate cursor-pointer"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSearchingWeb}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Search className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>
                        {isSearchingWeb
                          ? 'Searching Google & Grounding...'
                          : 'Search with Google Grounding'}
                      </span>
                    </button>
                  </form>

                  {searchError && (
                    <div
                      role="alert"
                      className="p-3 text-xs text-zinc-200 bg-zinc-900 border border-zinc-700 rounded-lg"
                    >
                      <span className="font-semibold text-white">Search Notice: </span>
                      {searchError}
                    </div>
                  )}

                  {/* Grounded Search Results & Extracted Links */}
                  <div className="pt-3 border-t border-zinc-800">
                    {groundedResult ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                          <span>Grounded Response</span>
                          <span>{groundedResult.modelUsed}</span>
                        </div>
                        <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">
                          {groundedResult.answer}
                        </div>
                        {groundedResult.sources.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="text-xs font-mono text-zinc-400">
                              Verified Web Sources ({groundedResult.sources.length}):
                            </div>
                            <ul className="space-y-1">
                              {groundedResult.sources.map((src) => (
                                <li key={src.uri}>
                                  <a
                                    href={src.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-white underline underline-offset-2 hover:text-zinc-300 break-all"
                                  >
                                    <span>{src.title}</span>
                                    <ExternalLink
                                      className="w-3 h-3 shrink-0"
                                      aria-hidden="true"
                                    />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-36 rounded-lg border border-zinc-800/80 bg-zinc-950 flex flex-col items-center justify-center p-5 text-center space-y-1.5">
                        <div className="text-xs font-medium text-zinc-300">
                          Live Google Search Grounding Ready
                        </div>
                        <p className="text-xs text-zinc-500 max-w-xs">
                          Run a query above to retrieve up-to-date technical answers and source
                          links using gemini-3.8-flash with googleSearch.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Tab 2: Monochrome Visual Generator (gemini-3-pro-image-preview) */
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                    <h3 className="text-base font-semibold text-white">
                      Monochrome Case-Study Art Generator
                    </h3>
                    <span className="text-xs font-mono text-zinc-400">
                      gemini-3-pro-image-preview
                    </span>
                  </div>

                  <form onSubmit={handleGenerateImage} className="space-y-4">
                    <div>
                      <label
                        htmlFor="image-prompt-input"
                        className="block text-xs text-zinc-300 font-medium mb-1.5"
                      >
                        Visual Concept Prompt
                      </label>
                      <textarea
                        id="image-prompt-input"
                        rows={2}
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        placeholder="Describe a monochrome architectural or infrastructure visual..."
                        className="w-full px-3.5 py-2.5 text-xs text-white bg-zinc-950 border border-zinc-800 rounded-lg placeholder:text-zinc-500 focus:outline-none focus:border-white resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs text-zinc-500">Monochrome Presets:</div>
                      <div className="flex flex-col gap-1.5">
                        {MONOCHROME_IMAGE_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setImagePrompt(preset)}
                            className="px-3 py-1.5 text-xs text-zinc-400 bg-zinc-950 border border-zinc-800/80 rounded-lg hover:text-white hover:border-zinc-700 transition-colors text-left truncate cursor-pointer"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Resolution Size (1K, 2K, 4K) & Aspect Ratio Controls */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs text-zinc-300 font-medium mb-1.5">
                          Image Size (Resolution)
                        </span>
                        <div
                          className="grid grid-cols-3 gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-lg"
                          role="group"
                          aria-label="Select Image Size"
                        >
                          {(['1K', '2K', '4K'] as ImageResolutionSize[]).map((sizeOption) => (
                            <button
                              key={sizeOption}
                              type="button"
                              onClick={() => setImageSize(sizeOption)}
                              aria-pressed={imageSize === sizeOption}
                              className={`py-1.5 text-xs font-mono font-medium rounded transition-colors cursor-pointer ${
                                imageSize === sizeOption
                                  ? 'bg-white text-black'
                                  : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              {sizeOption}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="aspect-ratio-select"
                          className="block text-xs text-zinc-300 font-medium mb-1.5"
                        >
                          Aspect Ratio
                        </label>
                        <select
                          id="aspect-ratio-select"
                          value={aspectRatio}
                          onChange={(e) =>
                            setAspectRatio(e.target.value as SupportedAspectRatio)
                          }
                          className="w-full px-3 py-2 text-xs text-white bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-white font-mono"
                        >
                          <option value="16:9">16:9 (Landscape Header)</option>
                          <option value="4:3">4:3 (Case Study Card)</option>
                          <option value="1:1">1:1 (Square Emblem)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isGeneratingImage}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingImage
                        ? `Synthesizing ${imageSize} Monochrome Visual...`
                        : `Generate ${imageSize} Monochrome Visual`}
                    </button>
                  </form>

                  {imageError && (
                    <div
                      role="alert"
                      className="p-3 text-xs text-zinc-200 bg-zinc-900 border border-zinc-700 rounded-lg"
                    >
                      <span className="font-semibold text-white">Generation Notice: </span>
                      {imageError}
                    </div>
                  )}

                  <div className="pt-3 border-t border-zinc-800">
                    {generatedImages.length > 0 ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                          <span>Latest Output ({generatedImages[0].imageSize})</span>
                          <span>{generatedImages[0].aspectRatio}</span>
                        </div>
                        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                          <img
                            src={generatedImages[0].imageUrl}
                            alt={generatedImages[0].prompt}
                            referrerPolicy="no-referrer"
                            className="w-full h-36 object-cover grayscale contrast-125"
                          />
                        </div>
                        <p className="text-xs text-zinc-400 truncate">
                          {generatedImages[0].prompt}
                        </p>
                      </div>
                    ) : (
                      <div className="h-36 rounded-lg border border-zinc-800/80 bg-zinc-950 flex flex-col items-center justify-center p-5 text-center space-y-1.5">
                        <div className="text-xs font-medium text-zinc-300">
                          Monochrome Visual Canvas Ready ({imageSize})
                        </div>
                        <p className="text-xs text-zinc-500 max-w-xs">
                          Select 1K, 2K, or 4K resolution above to generate custom monochrome cover
                          art.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
