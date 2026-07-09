'use client';

import React, { useState, useRef } from 'react';
import { 
  Key, Shield, AlertTriangle, FileText, Upload, Briefcase, 
  MapPin, DollarSign, Clock, CheckCircle, HelpCircle, 
  Terminal as TerminalIcon, Sparkles, ChevronRight, TrendingUp, 
  DollarSign as DollarIcon, Calendar, Download, RefreshCw, BarChart2, ShieldAlert, Award
} from 'lucide-react';

export default function Home() {
  // State variables
  const [step, setStep] = useState(1);
  const [apiProvider, setApiProvider] = useState<'openai' | 'gemini'>('openai');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  // Intake Form State
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [additionalText, setAdditionalText] = useState('');
  const [budget, setBudget] = useState('5000');
  const [locationCity, setLocationCity] = useState('Austin');
  const [locationCountry, setLocationCountry] = useState('US');
  const [weeklyHours, setWeeklyHours] = useState('20');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core Extracted Profile / Ideas State
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);

  // Validation SSE Stream State
  const [isValidating, setIsValidating] = useState(false);
  const [validationLogs, setValidationLogs] = useState<string[]>([]);
  const [activeAgent, setActiveAgent] = useState('');
  const [agentProgress, setAgentProgress] = useState(0);

  // Final Compiled Results
  const [marketData, setMarketData] = useState<any>(null);
  const [financialData, setFinancialData] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [advisorData, setAdvisorData] = useState<any>(null);

  // UI Tabs State
  const [activeTab, setActiveTab] = useState<'overview' | 'market' | 'financials' | 'risks' | 'roadmap' | 'advisor'>('overview');
  const [isDownloading, setIsDownloading] = useState(false);

  // Helpers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCvFile(e.dataTransfer.files[0]);
    }
  };

  const selectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  // Step 2 -> 3: Parse and Extract Profile Info
  const handleExtractProfile = async () => {
    if (!apiKey) {
      alert('Please enter your API Key first.');
      return;
    }
    setIsExtracting(true);
    const formData = new FormData();
    if (cvFile) formData.append('file', cvFile);
    formData.append('additional_text', additionalText);
    formData.append('budget', budget);
    formData.append('location_city', locationCity);
    formData.append('location_country', locationCountry);
    formData.append('weekly_hours', weeklyHours);

    try {
      const res = await fetch('http://localhost:8000/api/extract', {
        method: 'POST',
        headers: {
          'X-API-Provider': apiProvider,
          'X-API-Key': apiKey,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setProfile(data.profile);
      setSkills(data.skills);
      setStep(3);
    } catch (e: any) {
      console.error(e);
      alert(`Error extracting profile details: ${e.message}`);
    } finally {
      setIsExtracting(false);
    }
  };

  // Step 3 -> 4: Generate tailored opportunities
  const handleGenerateIdeas = async () => {
    setIsExtracting(true);
    try {
      const res = await fetch('http://localhost:8000/api/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Provider': apiProvider,
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ profile }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setIdeas(data.ideas || []);
      setStep(4);
    } catch (e: any) {
      console.error(e);
      alert(`Error generating opportunities: ${e.message}`);
    } finally {
      setIsExtracting(false);
    }
  };

  // Step 4 -> 5: Run Deep Validation SSE Stream for Selected Idea
  const handleStartValidation = async (idea: any) => {
    setSelectedIdea(idea);
    setStep(5);
    setIsValidating(true);
    setValidationLogs([]);
    setActiveAgent('Location Gate');
    setAgentProgress(10);

    try {
      const res = await fetch('http://localhost:8000/api/validate-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Provider': apiProvider,
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          profile,
          skills,
          idea,
        }),
      });

      if (!res.body) {
        throw new Error('SSE Stream not supported by backend');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (!dataStr) continue;
            try {
              const event = JSON.parse(dataStr);
              
              if (event.error) {
                setValidationLogs(prev => [...prev, `[ERROR] ${event.error}`]);
                setIsValidating(false);
                return;
              }

              // Update logs
              if (event.message) {
                setValidationLogs(prev => [...prev, event.message]);
              }

              // Process agent state
              if (event.agent) {
                setActiveAgent(event.agent);
                if (event.agent === 'Location Gate' && event.status === 'done') {
                  setAgentProgress(20);
                } else if (event.agent === 'Budget Gate' && event.status === 'done') {
                  setAgentProgress(35);
                } else if (event.agent === 'Market Research' && event.status === 'done') {
                  setMarketData(event.data);
                  setAgentProgress(50);
                } else if (event.agent === 'Financial Planner' && event.status === 'done') {
                  setFinancialData(event.data);
                  setAgentProgress(65);
                } else if (event.agent === 'Risk Analyzer' && event.status === 'done') {
                  setRiskData(event.data);
                  setAgentProgress(80);
                } else if (event.agent === 'Business Plan Generator' && event.status === 'done') {
                  setRoadmapData(event.data);
                  setAgentProgress(90);
                } else if (event.agent === 'Final Advisor' && event.status === 'done') {
                  setAdvisorData(event.data);
                  setAgentProgress(100);
                } else if (event.agent === 'Pipeline Complete') {
                  setStep(6);
                  setIsValidating(false);
                }
              }
            } catch (err) {
              console.error('Failed parsing line: ', line, err);
            }
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      setValidationLogs(prev => [...prev, `[EXCEPTION] ${e.message}`]);
      setIsValidating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('http://localhost:8000/api/download-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          skills,
          idea: selectedIdea,
          market: marketData,
          financials: financialData,
          risks: riskData,
          roadmap: roadmapData,
          advisor: advisorData
        }),
      });

      if (!res.ok) throw new Error('PDF Generation failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DPR_${selectedIdea?.id || 'business'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error(e);
      alert(`Could not download PDF: ${e.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setProfile(null);
    setSkills(null);
    setIdeas([]);
    setSelectedIdea(null);
    setMarketData(null);
    setFinancialData(null);
    setRiskData(null);
    setRoadmapData(null);
    setAdvisorData(null);
    setCvFile(null);
    setAdditionalText('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-brand-bg relative overflow-hidden font-sans">
      
      {/* Subtle Monochrome Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full py-5 px-6 md:px-12 flex justify-between items-center z-10 glass-panel border-b border-brand-border">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
          <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              R2B Venture Architect
            </h1>
            <p className="text-xs text-zinc-500">Research to Business Advisor</p>
          </div>
        </div>

        {step > 1 && (
          <button 
            onClick={handleReset} 
            className="text-xs font-semibold px-4 py-2 border border-brand-border rounded-lg bg-brand-card text-zinc-300 hover:text-white hover:border-white transition"
          >
            Start Over
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 flex flex-col justify-start z-10 relative">
        
        {/* STEP 1: API Configuration */}
        {step === 1 && (
          <div className="max-w-md w-full mx-auto my-auto py-8">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                Phase 1: Setup
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-4 mb-2 tracking-tight">
                Unlock Your Potential
              </h2>
              <p className="text-zinc-400 text-sm">
                Enter your API Key to initialize the 8 specialized Venture Advisor agents. Your key remains securely inside your session.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-brand-card/70 border border-brand-border glass-panel shadow-2xl relative overflow-hidden">
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => setApiProvider('openai')}
                  className={`flex-1 py-3 px-4 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    apiProvider === 'openai' 
                      ? 'bg-white border-white text-black shadow-md shadow-white/5' 
                      : 'bg-brand-card border-brand-border text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <Sparkles className="h-4 w-4" /> OpenAI
                </button>
                <button
                  onClick={() => setApiProvider('gemini')}
                  className={`flex-1 py-3 px-4 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    apiProvider === 'gemini' 
                      ? 'bg-white border-white text-black shadow-md shadow-white/5' 
                      : 'bg-brand-card border-brand-border text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <Sparkles className="h-4 w-4" /> Gemini
                </button>
              </div>

              <div className="mb-6 relative">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  API Key
                </label>
                <div className="relative rounded-xl border border-brand-border bg-zinc-950 overflow-hidden focus-within:border-white transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Key className="h-4 w-4" />
                  </div>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={apiProvider === 'openai' ? 'sk-...' : 'AIzaSy...'}
                    className="w-full py-3.5 pl-10 pr-10 bg-transparent text-sm text-white placeholder-zinc-700 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition"
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mb-6 p-4 rounded-xl bg-zinc-900/60 border border-brand-border text-zinc-400 text-xs">
                <Shield className="h-5 w-5 text-zinc-300 shrink-0" />
                <p>
                  Keys are used statefully in headers for downstream LLM REST calls and never cached or stored on our servers.
                </p>
              </div>

              <button
                disabled={!apiKey}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-black font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group text-sm"
              >
                Proceed to Intake <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Profile Intake */}
        {step === 2 && (
          <div className="max-w-2xl w-full mx-auto py-4">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                Phase 2: Profile Intake
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-4 mb-2 tracking-tight">
                Venture Foundation Intake
              </h2>
              <p className="text-zinc-400 text-sm">
                Provide your details. Upload a resume, specify constraints, and share your goals so the system can run Agent 1 and 2 validations.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-brand-card/70 border border-brand-border glass-panel shadow-2xl space-y-6">
              
              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  CV / Resume (PDF or DOCX)
                </label>
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={selectFile}
                  className="border-2 border-dashed border-brand-border hover:border-white/50 rounded-xl p-8 text-center bg-zinc-950/40 cursor-pointer transition-all flex flex-col items-center group relative overflow-hidden"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                  />
                  <div className="p-3 bg-zinc-900 border border-brand-border rounded-xl mb-4 group-hover:border-white transition-colors">
                    {cvFile ? <FileText className="h-6 w-6 text-white" /> : <Upload className="h-6 w-6 text-zinc-500" />}
                  </div>
                  {cvFile ? (
                    <div>
                      <p className="text-sm font-semibold text-white">{cvFile.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">{(cvFile.size / 1024).toFixed(1)} KB • Click to replace</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-zinc-350">Drag & drop your resume or click to browse</p>
                      <p className="text-xs text-zinc-500 mt-1">Supports PDF, DOCX or TXT files</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Available Startup Capital (USD)
                  </label>
                  <div className="relative rounded-xl border border-brand-border bg-zinc-950/80 overflow-hidden focus-within:border-white transition">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="5000"
                      className="w-full py-3 pl-9 pr-4 bg-transparent text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Weekly Commitment (Hours)
                  </label>
                  <div className="relative rounded-xl border border-brand-border bg-zinc-950/80 overflow-hidden focus-within:border-white transition">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <Clock className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      value={weeklyHours}
                      onChange={(e) => setWeeklyHours(e.target.value)}
                      placeholder="20"
                      className="w-full py-3 pl-9 pr-4 bg-transparent text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Operating City
                  </label>
                  <div className="relative rounded-xl border border-brand-border bg-zinc-950/80 overflow-hidden focus-within:border-white transition">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={locationCity}
                      onChange={(e) => setLocationCity(e.target.value)}
                      placeholder="Austin"
                      className="w-full py-3 pl-9 pr-4 bg-transparent text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Country Code (e.g. US, IN, UK)
                  </label>
                  <div className="relative rounded-xl border border-brand-border bg-zinc-950/80 overflow-hidden focus-within:border-white transition">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={locationCountry}
                      onChange={(e) => setLocationCountry(e.target.value)}
                      placeholder="US"
                      className="w-full py-3 pl-9 pr-4 bg-transparent text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Context */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Additional Background / Goals / Constraints
                </label>
                <textarea
                  value={additionalText}
                  onChange={(e) => setAdditionalText(e.target.value)}
                  placeholder="Tell us about specific interests, resources you already own (cars, space, licenses), or legal constraints (non-compete clauses, visa requirements)..."
                  className="w-full h-24 rounded-xl border border-brand-border bg-zinc-950/80 p-4 text-sm text-white focus:outline-none focus:border-white transition"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-semibold rounded-xl text-sm transition"
                >
                  Back
                </button>
                <button
                  disabled={isExtracting}
                  onClick={handleExtractProfile}
                  className="flex-1 py-3.5 bg-white disabled:bg-zinc-850 disabled:text-zinc-500 disabled:cursor-not-allowed hover:bg-zinc-200 text-black font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2 group shadow-md"
                >
                  {isExtracting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Extracting profile...
                    </>
                  ) : (
                    <>
                      Verify and Extract <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: Review Extracted Profile */}
        {step === 3 && profile && (
          <div className="max-w-3xl w-full mx-auto py-4">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                Phase 3: Verify Profile Constraints
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-4 mb-2 tracking-tight">
                Review Extracted Constraints
              </h2>
              <p className="text-zinc-400 text-sm">
                Lock your profile parameters. Verify that Agent 1 has parsed your constraints accurately. Correct any mistakes before finding opportunity ideas.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-brand-card/70 border border-brand-border glass-panel shadow-2xl space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Extracted Details</h3>
                  <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-brand-border">
                    <p className="text-sm"><span className="text-zinc-500">Name:</span> <span className="font-semibold text-zinc-200">{profile.founder_name}</span></p>
                    <p className="text-sm"><span className="text-zinc-500">Education:</span> <span className="font-semibold text-zinc-200">{profile.education}</span></p>
                    <p className="text-sm"><span className="text-zinc-500">Location:</span> <span className="font-semibold text-zinc-200">{profile.location?.city}, {profile.location?.country}</span></p>
                    <p className="text-sm"><span className="text-zinc-500">Visa / Legal status:</span> <span className="font-semibold text-zinc-200">{profile.constraints?.visa_status}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Audited Skill Gaps (Agent 2)</h3>
                  <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-brand-border">
                    <div>
                      <p className="text-xs text-white font-semibold border-l-2 border-white pl-2">Top Strengths:</p>
                      <p className="text-sm text-zinc-350 mt-1 pl-2.5">{skills.top_strengths?.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-300 font-semibold border-l-2 border-zinc-400 pl-2">Transferable Skills:</p>
                      <p className="text-sm text-zinc-350 mt-1 pl-2.5">{skills.transferable_skills?.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 font-semibold border-l-2 border-zinc-700 pl-2">Identified Skill Gaps:</p>
                      <p className="text-sm text-zinc-350 mt-1 pl-2.5">{skills.skill_gaps?.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Modify Profile Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-550 mb-1">Capital (USD)</label>
                    <input
                      type="number"
                      value={profile.available_capital_usd}
                      onChange={(e) => setProfile({...profile, available_capital_usd: parseFloat(e.target.value) || 0})}
                      className="w-full bg-zinc-900 border border-brand-border rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-550 mb-1">Hours/Week</label>
                    <input
                      type="number"
                      value={profile.weekly_hours_available}
                      onChange={(e) => setProfile({...profile, weekly_hours_available: parseInt(e.target.value) || 0})}
                      className="w-full bg-zinc-900 border border-brand-border rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-550 mb-1">Non-compete Clause?</label>
                    <select
                      value={profile.constraints?.non_competes ? "true" : "false"}
                      onChange={(e) => setProfile({
                        ...profile, 
                        constraints: { ...profile.constraints, non_competes: e.target.value === "true" }
                      })}
                      className="w-full bg-zinc-900 border border-brand-border rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-brand-border">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-semibold rounded-xl text-sm transition"
                >
                  Back
                </button>
                <button
                  disabled={isExtracting}
                  onClick={handleGenerateIdeas}
                  className="flex-1 py-3.5 bg-white hover:bg-zinc-200 text-black font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2 group shadow-md"
                >
                  {isExtracting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Matching opportunities...
                    </>
                  ) : (
                    <>
                      Lock & Generate Ideas <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 4: Idea grid */}
        {step === 4 && (
          <div className="py-4">
            <div className="text-center mb-10 max-w-xl mx-auto">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                Phase 4: Opportunities
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-4 mb-2 tracking-tight">
                Personalized Business Opportunities
              </h2>
              <p className="text-zinc-400 text-sm">
                Based on your skills and constraints, the opportunity agent has surfaced the following business concepts. Click any card to launch the validation pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {ideas.map((idea, index) => {
                const scoreColor = idea.suitability_score >= 85 ? 'text-white border-zinc-700 bg-zinc-900' 
                                 : idea.suitability_score >= 70 ? 'text-zinc-300 border-zinc-800 bg-zinc-950'
                                 : 'text-zinc-400 border-zinc-850 bg-zinc-950/40';

                return (
                  <div
                    key={index}
                    onClick={() => handleStartValidation(idea)}
                    className="group bg-brand-card hover:bg-brand-card-hover border border-brand-border hover:border-white/50 rounded-2xl p-6 cursor-pointer transition-all flex flex-col justify-between shadow-lg relative overflow-hidden"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-xs font-semibold border rounded-full px-3 py-1 ${scoreColor}`}>
                          Fit: {idea.suitability_score}%
                        </span>
                        <span className="text-xs text-zinc-400 capitalize bg-zinc-900 border border-zinc-800 rounded-full px-2 py-0.5">
                          {idea.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-white mb-2 group-hover:text-zinc-300 transition-colors">
                        {idea.title}
                      </h3>
                      <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                        {idea.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-800">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Est. Startup Cost:</span>
                        <span className="text-zinc-200 font-semibold">${idea.estimated_startup_cost_usd?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Monthly Target Revenue:</span>
                        <span className="text-zinc-200 font-semibold">${idea.estimated_monthly_revenue_usd?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-505 text-zinc-500">Complexity:</span>
                        <span className="text-zinc-200 font-semibold">{idea.complexity_score}/10</span>
                      </div>
                      
                      <button className="w-full mt-4 py-2.5 bg-zinc-905 bg-zinc-900 hover:bg-white border border-zinc-800 text-zinc-300 hover:text-black font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5">
                        Deep Validate Idea <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Real-time validation terminal */}
        {step === 5 && (
          <div className="max-w-2xl w-full mx-auto py-8">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                Phase 5: Agent Analysis
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-4 mb-2 tracking-tight">
                Deep Validation Pipeline
              </h2>
              <p className="text-zinc-400 text-sm">
                8 specialized agents are evaluating the viability of your business idea: running financial projections, stress testing legal constraints, and compiling market reports.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-brand-card/70 border border-brand-border glass-panel shadow-2xl space-y-6">
              
              {/* Progress Ring / Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">Current Agent: {activeAgent}</span>
                  <span className="text-zinc-400">{agentProgress}% Completed</span>
                </div>
                <div className="w-full bg-zinc-950 border border-brand-border rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-500" 
                    style={{ width: `${agentProgress}%` }}
                  />
                </div>
              </div>

              {/* Terminal Logs */}
              <div>
                <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TerminalIcon className="h-4 w-4 text-white animate-pulse" /> System Stream Logs
                </span>
                <div className="w-full h-64 bg-zinc-950 border border-brand-border rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-y-auto space-y-1.5 flex flex-col justify-start">
                  {validationLogs.map((log, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-zinc-500 select-none">&gt;</span>
                      <span className={log.includes('ERROR') ? 'text-zinc-400 border-l-2 border-zinc-700 pl-2 bg-zinc-900/40 rounded px-1' : log.includes('SUCCESS') || log.includes('PASS') ? 'text-white font-bold' : 'text-zinc-350'}>
                        {log}
                      </span>
                    </div>
                  ))}
                  {isValidating && (
                    <div className="flex items-center gap-2 text-zinc-550 animate-pulse-slow">
                      <span>&gt;</span>
                      <span>Processing downstream variables...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-zinc-500">
                  This multi-agent process takes approximately 10-15 seconds to run stress scenarios.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* STEP 6: Final Tabbed DPR Dashboard */}
        {step === 6 && (
          <div className="space-y-6 py-4">
            
            {/* Header info card */}
            <div className="p-8 rounded-2xl bg-brand-card/60 border border-brand-border glass-panel shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="text-xs font-semibold text-white uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 flex items-center gap-1 w-max">
                  <CheckCircle className="h-3.5 w-3.5" /> Validation Complete
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3 mb-2 tracking-tight">
                  {selectedIdea?.title}
                </h2>
                <p className="text-zinc-400 text-sm max-w-xl">
                  {selectedIdea?.description}
                </p>
              </div>

              <div className="flex gap-3 shrink-0">
                <button
                  disabled={isDownloading}
                  onClick={handleDownloadPDF}
                  className="py-3 px-5 bg-white disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 hover:bg-zinc-200 text-black font-extrabold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" /> Download Report
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="py-3 px-5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-semibold rounded-xl text-xs transition"
                >
                  Other Ideas
                </button>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-brand-border bg-zinc-950/40 flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-lg text-white border border-zinc-850">
                  <DollarIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-zinc-550 text-xs">Startup Cost</p>
                  <p className="text-base font-bold text-zinc-200">${selectedIdea?.estimated_startup_cost_usd?.toLocaleString()}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-brand-border bg-zinc-950/40 flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-lg text-white border border-zinc-850">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-zinc-550 text-xs">Target Revenue</p>
                  <p className="text-base font-bold text-zinc-200">${selectedIdea?.estimated_monthly_revenue_usd?.toLocaleString()}/mo</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-brand-border bg-zinc-950/40 flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-lg text-white border border-zinc-850">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-zinc-550 text-xs">Break-Even</p>
                  <p className="text-base font-bold text-zinc-200">{financialData?.break_even_timeline_months} Months</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-brand-border bg-zinc-950/40 flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-lg text-white border border-zinc-850">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-zinc-550 text-xs">Suitability</p>
                  <p className="text-base font-bold text-zinc-200">{selectedIdea?.suitability_score}%</p>
                </div>
              </div>
            </div>

            {/* Tabs Selector */}
            <div className="flex gap-2 border-b border-brand-border overflow-x-auto pb-px">
              {[
                { id: 'overview', name: 'Overview & GTM', icon: Briefcase },
                { id: 'market', name: 'Market Analysis', icon: BarChart2 },
                { id: 'financials', name: 'Financial Plan', icon: DollarSign },
                { id: 'risks', name: 'Risks & Mitigations', icon: ShieldAlert },
                { id: 'roadmap', name: 'Action Plan', icon: Calendar },
                { id: 'advisor', name: 'Government Schemes', icon: Sparkles }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 px-4 flex items-center gap-2 border-b-2 font-semibold text-xs whitespace-nowrap transition-colors ${
                      activeTab === tab.id 
                        ? 'border-white text-white font-bold' 
                        : 'border-transparent text-zinc-500 hover:text-zinc-350'
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Tabs Content */}
            <div className="bg-brand-card/30 border border-brand-border rounded-2xl p-8 glass-panel shadow-xl min-h-[400px]">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">Why This Concept Fits You</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/40 border border-brand-border p-4 rounded-xl">
                      {selectedIdea?.fit_justification}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Strengths Leveraged</h4>
                      <ul className="space-y-2">
                        {skills.top_strengths?.map((str: string, index: number) => (
                          <li key={index} className="text-sm flex items-center gap-2 text-zinc-300">
                            <span className="h-1.5 w-1.5 bg-white rounded-full shrink-0" /> {str}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Skill Gaps to Address</h4>
                      <ul className="space-y-2">
                        {skills.skill_gaps?.map((gap: string, index: number) => (
                          <li key={index} className="text-sm flex items-center gap-2 text-zinc-300">
                            <span className="h-1.5 w-1.5 bg-zinc-550 rounded-full shrink-0" /> {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {advisorData?.final_recommendation && (
                    <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-zinc-300 text-sm">
                      <span className="font-bold text-white block mb-1">Advisor's Final Verdict</span>
                      {advisorData.final_recommendation}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MARKET ANALYSIS */}
              {activeTab === 'market' && marketData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Demand Justification</h4>
                        <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/30 p-4 rounded-xl border border-brand-border">
                          {marketData.demand_justification}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-widest mb-2">Target Customers</h4>
                        <div className="space-y-3">
                          {marketData.target_customer_segments?.map((segment: any, index: number) => (
                            <div key={index} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 space-y-1">
                              <p className="text-sm font-semibold text-zinc-200">{segment.segment_name}</p>
                              <p className="text-xs text-zinc-450"><span className="text-zinc-550">Pain Point:</span> {segment.pain_point}</p>
                              <p className="text-xs text-zinc-450"><span className="text-zinc-550">Willingness to Pay:</span> {segment.willingness_to_pay}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-widest mb-2">Key Trends</h4>
                        <ul className="space-y-2">
                          {marketData.market_trends?.map((trend: string, index: number) => (
                            <li key={index} className="text-xs bg-zinc-950/60 border border-zinc-800 p-3 rounded-lg text-zinc-300">
                              {trend}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-widest mb-2">Competitors</h4>
                        <div className="space-y-2">
                          {marketData.competitor_profiles?.map((comp: any, index: number) => (
                            <div key={index} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="font-semibold text-zinc-200">{comp.competitor_name}</span>
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                  comp.threat_level === 'High' ? 'text-white border border-zinc-700 bg-zinc-950' : 'text-zinc-400 border border-zinc-850 bg-zinc-950'
                                }`}>Threat: {comp.threat_level}</span>
                              </div>
                              <p className="text-zinc-400"><span className="text-zinc-550">Why we win:</span> {comp.why_you_win}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FINANCIAL PLAN */}
              {activeTab === 'financials' && financialData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-widest mb-3">One-Time Startup Costs</h4>
                      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/20">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-zinc-900 text-zinc-450 text-xs uppercase">
                            <tr>
                              <th className="p-3">Category</th>
                              <th className="p-3 text-right">Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {financialData.startup_costs_breakdown?.map((cost: any, index: number) => (
                              <tr key={index} className="border-t border-zinc-850">
                                <td className="p-3 text-zinc-300">{cost.category}</td>
                                <td className="p-3 text-right font-semibold text-zinc-200">${cost.amount?.toLocaleString()}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-zinc-800 bg-zinc-900 font-bold">
                              <td className="p-3 text-white">Total Setup Costs</td>
                              <td className="p-3 text-right text-white">
                                ${financialData.startup_costs_breakdown?.reduce((acc: number, c: any) => acc + c.amount, 0)?.toLocaleString()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-widest mb-3">Monthly Operating Costs</h4>
                      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/20">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-zinc-900 text-zinc-450 text-xs uppercase">
                            <tr>
                              <th className="p-3">Category</th>
                              <th className="p-3 text-right">Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {financialData.monthly_operating_costs_breakdown?.map((cost: any, index: number) => (
                              <tr key={index} className="border-t border-zinc-850">
                                <td className="p-3 text-zinc-300">{cost.category}</td>
                                <td className="p-3 text-right font-semibold text-zinc-200">${cost.amount?.toLocaleString()}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-zinc-800 bg-zinc-900 font-bold">
                              <td className="p-3 text-white">Total Monthly Costs</td>
                              <td className="p-3 text-right text-white">
                                ${financialData.monthly_operating_costs_breakdown?.reduce((acc: number, c: any) => acc + c.amount, 0)?.toLocaleString()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-brand-border">
                    <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 text-center">
                      <p className="text-zinc-500 text-xs">Revenue Model</p>
                      <p className="text-base font-bold text-zinc-200 mt-1 capitalize">{financialData.revenue_model_type}</p>
                    </div>
                    <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 text-center">
                      <p className="text-zinc-500 text-xs">Target Monthly Rev</p>
                      <p className="text-base font-bold text-white mt-1">${financialData.monthly_revenue_target?.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 text-center">
                      <p className="text-zinc-500 text-xs">Estimated Year 1 Profit</p>
                      <p className="text-base font-bold text-white mt-1">${financialData.profit_estimate_12_months?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: RISKS & MITIGATIONS */}
              {activeTab === 'risks' && riskData && (
                <div className="space-y-6">
                  
                  {/* Gate Status Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-850 flex gap-3 text-xs">
                      <Shield className="h-5 w-5 text-white shrink-0" />
                      <div>
                        <span className="font-bold block text-zinc-300">Regulatory & Legal Verdict: {riskData.legal_verdict}</span>
                        <p className="text-zinc-500 mt-0.5">{riskData.legal_message}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-850 flex gap-3 text-xs">
                      <AlertTriangle className="h-5 w-5 text-white shrink-0" />
                      <div>
                        <span className="font-bold block text-zinc-300">Budget Constraint: LOCKED</span>
                        <p className="text-zinc-500 mt-0.5">Capital lock checks verify that setup expenses do not exceed availability limits.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-widest mb-3">Top 3 Failure Doom Scenarios</h4>
                    <div className="space-y-4">
                      {riskData.doom_scenarios?.map((scenario: any, index: number) => (
                        <div key={index} className="p-5 border border-zinc-800 bg-zinc-950/40 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">
                              Doom {scenario.rank} (Probability: {scenario.probability})
                            </span>
                            <span className="text-xs text-zinc-550">Impact: {scenario.impact}</span>
                          </div>
                          <p className="text-sm font-semibold text-zinc-200">{scenario.scenario}</p>
                          <p className="text-xs text-zinc-450"><span className="text-zinc-550">Early Warnings:</span> {scenario.early_warning_signs?.join(', ')}</p>
                          <div className="text-xs text-zinc-200 mt-1 p-3 bg-zinc-900/40 rounded-lg border border-zinc-850">
                            <span className="font-bold text-white">Mitigation Strategy:</span> {scenario.mitigation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: ACTION PLAN */}
              {activeTab === 'roadmap' && roadmapData && (
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-zinc-555 uppercase tracking-widest mb-4">4-Week Validation & Launch Sprint</h4>
                  
                  <div className="relative border-l border-zinc-850 ml-4 space-y-6">
                    {[
                      { key: 'week_1_validation', title: 'Week 1: Validate' },
                      { key: 'week_2_setup', title: 'Week 2: Set Up' },
                      { key: 'week_3_mvp', title: 'Week 3: Build MVP' },
                      { key: 'week_4_marketing', title: 'Week 4: Launch & GTM' }
                    ].map((wk) => {
                      const week = roadmapData[wk.key];
                      if (!week) return null;
                      return (
                        <div key={wk.key} className="relative pl-6">
                          <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-white border border-brand-bg shadow-sm" />
                          <h5 className="text-sm font-bold text-zinc-200">{wk.title}</h5>
                          <ul className="mt-2 space-y-1">
                            {week.deliverables?.map((del: string, idx: number) => (
                              <li key={idx} className="text-xs text-zinc-400 flex items-center gap-1.5">
                                <span className="h-1 w-1 bg-zinc-700 rounded-full" /> {del}
                              </li>
                            ))}
                          </ul>
                          <p className="text-[11px] text-zinc-350 mt-1.5 border-l border-zinc-650 pl-2 italic"><span className="font-semibold text-zinc-500 not-italic">Success Criteria:</span> {week.success_criteria}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 6: GOV SCHEMES */}
              {activeTab === 'advisor' && advisorData && (
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-widest mb-3">Recommended Regional Government Programs</h4>
                  
                  <div className="space-y-4">
                    {advisorData.government_schemes?.map((scheme: any, index: number) => (
                      <div key={index} className="p-5 border border-zinc-800 bg-zinc-950/40 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">
                            {scheme.type}
                          </span>
                          <span className="text-xs text-zinc-500">{profile.location?.city}, {profile.location?.country}</span>
                        </div>
                        <p className="text-sm font-bold text-zinc-200">{scheme.scheme_name}</p>
                        <p className="text-xs text-zinc-400">{scheme.description}</p>
                        <p className="text-xs text-zinc-350 font-semibold"><span className="text-zinc-500">Application Info:</span> <span className="underline decoration-zinc-750">{scheme.link_or_instructions}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-zinc-600 border-t border-zinc-850 bg-zinc-950/20">
        &copy; {new Date().getFullYear()} R2B Business Advisor. All rights reserved. Built with 8-agent validation architecture.
      </footer>

    </div>
  );
}
