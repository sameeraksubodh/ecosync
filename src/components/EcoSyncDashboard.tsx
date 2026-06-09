import { useState, useCallback } from 'react';
import {
  Leaf,
  TrendingDown,
  Trophy,
  Upload,
  Camera,
  Loader2,
  CheckCircle2,
  Send,
  Sparkles,
  Target,
  Lock,
  Gift,
  TreeDeciduous,
  TreePine,
  Mountain,
  CloudSun,
  ChevronRight,
  Award,
  Zap,
  Recycle,
  UtensilsCrossed,
  Car,
  Lightbulb,
  Flame,
} from 'lucide-react';

export interface ChartData {
  category: string;
  value: number;
  color: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  locked: boolean;
}

interface ParsedItem {
  name: string;
  co2: number;
  category: string;
}

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

function CO2Chart({ data }: { data: ChartData[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -90;

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, '0', end.x, end.y].join(' ');
  };

  const segments = data.map((d) => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle + 90;
    const endAngle = startAngle + angle;
    currentAngle += angle;
    return { ...d, path: describeArc(100, 100, 80, startAngle, endAngle) };
  });

  return (
    <div className="flex flex-col items-center" data-testid="co2-chart">
      <div className="relative w-52 h-52">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {segments.map((s, i) => (
            <path
              key={i}
              d={s.path}
              fill="none"
              stroke={s.color}
              strokeWidth="24"
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-800" data-testid="chart-total">{total}</span>
          <span className="text-sm text-gray-500">kg CO2</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4 w-full">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/60 border border-gray-100">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
            <p className="text-xs font-medium text-gray-700 truncate">{s.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VirtualForest({ credits }: { credits: number }) {
  const trees = Math.floor(credits / 100);
  const growth = (credits % 100) / 100;

  return (
    <div className="relative h-48 bg-gradient-to-b from-teal-100/50 to-emerald-50/30 rounded-xl overflow-hidden border border-emerald-100" data-testid="virtual-forest">
      <CloudSun className="absolute top-3 right-4 w-8 h-8 text-amber-400 animate-float" />
      <div className="absolute bottom-0 left-0 right-0 h-16">
        <Mountain className="absolute bottom-0 left-1/4 w-24 h-16 text-gray-200/40 transform -translate-x-1/2" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-emerald-400/60 to-emerald-300/40 rounded-b-xl" />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {Array.from({ length: Math.min(trees + 1, 7) }).map((_, i) => (
          <TreePine
            key={i}
            className={`w-8 h-10 ${
              i === trees ? 'text-teal-400' : 'text-emerald-500'
            }`}
            style={{
              transform: `scale(${i === trees ? 0.6 + growth * 0.4 : 1})`,
              opacity: i === trees ? 0.5 + growth * 0.5 : 1,
            }}
          />
        ))}
      </div>
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
        <div className="flex items-center gap-1.5">
          <TreeDeciduous className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700" data-testid="tree-count">{trees} trees</span>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendUp = true,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-emerald-100/50 shadow-lg rounded-xl p-4" data-testid="kpi-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800" data-testid="kpi-value">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div className="p-2.5 bg-emerald-50 rounded-xl">{icon}</div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
          <TrendingDown className={`w-4 h-4 ${trendUp ? 'text-emerald-600' : 'text-red-500 rotate-180'}`} />
          <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>{trend}</span>
        </div>
      )}
    </div>
  );
}

function ReceiptScanner() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);

  const mockParsedItems: ParsedItem[] = [
    { name: 'Organic Red Meat (1.5kg)', co2: 4.2, category: 'Food' },
    { name: 'Dairy Milk (2L)', co2: 1.1, category: 'Food' },
    { name: 'Imported Avocados (3pc)', co2: 0.8, category: 'Food' },
    { name: 'Local Vegetables', co2: 0.2, category: 'Food' },
  ];

  const handleUpload = useCallback(() => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setParsedItems(mockParsedItems);
        setIsComplete(true);
      }, 2500);
    }, 1000);
  }, []);

  const handleReset = () => {
    setIsUploading(false);
    setIsAnalyzing(false);
    setIsComplete(false);
    setParsedItems([]);
  };

  const totalCO2 = parsedItems.reduce((sum, item) => sum + item.co2, 0);

  return (
    <div data-testid="receipt-scanner">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5 text-teal-600" />
        <h3 className="font-semibold text-gray-800">Receipt-to-Impact Scanner</h3>
      </div>

      {isComplete ? (
        <div className="animate-slide-up" data-testid="analysis-complete">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold text-gray-800">Receipt Analyzed</h4>
            </div>
            <button onClick={handleReset} className="text-xs text-gray-500">Upload New</button>
          </div>
          <div className="space-y-2 mb-4">
            {parsedItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-gray-100">
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-sm font-medium text-gray-800">{item.co2}kg CO2</span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-700">Total Impact</span>
              <span className="text-xl font-bold text-emerald-800" data-testid="total-co2">{totalCO2.toFixed(1)}kg CO2</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isUploading || isAnalyzing
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-gray-200 hover:border-emerald-400'
          }`}
        >
          {isUploading || isAnalyzing ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" data-testid="loading-spinner" />
              <p className="text-sm text-gray-600">
                {isUploading ? 'Uploading receipt...' : 'AI analyzing receipt items...'}
              </p>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">Drag & drop your receipt</p>
              <button
                onClick={handleUpload}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium px-4 py-2 rounded-lg mt-4 hover:from-emerald-700"
                data-testid="scan-button"
              >
                <Camera className="w-4 h-4 inline mr-2" />
                Scan Receipt
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const [isClaimed, setIsClaimed] = useState(false);
  const progressPercent = Math.min((challenge.progress / challenge.total) * 100, 100);
  const isComplete = challenge.progress >= challenge.total;

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-emerald-100/50 shadow-lg rounded-xl p-4" data-testid="challenge-card">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl shrink-0 ${challenge.locked ? 'bg-gray-100 text-gray-400' : isComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-teal-50 text-teal-600'}`}>
          {challenge.locked ? <Lock className="w-5 h-5" /> : challenge.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-gray-800 truncate">{challenge.title}</h4>
            <div className="flex items-center gap-1 shrink-0">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-amber-600">+{challenge.reward}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{challenge.description}</p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium text-gray-700" data-testid="challenge-progress">{challenge.progress}/{challenge.total}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          {!challenge.locked && (
            <button
              onClick={() => setIsClaimed(true)}
              disabled={!isComplete || isClaimed}
              className={`w-full mt-3 py-2 rounded-lg text-sm font-medium ${
                isClaimed
                  ? 'bg-gray-100 text-gray-400'
                  : isComplete
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              data-testid={isComplete && !isClaimed ? 'claim-button' : undefined}
            >
              {isClaimed ? 'Claimed' : isComplete ? 'Claim Reward' : 'In Progress'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: "Hi there! I noticed you bought beef and dairy this week. If you swap just one meal next week to this plant-based alternative, you'll save 5kg of CO2!" },
    { id: 2, sender: 'ai', text: "Small changes add up! Your current footprint is 12kg CO2 this week, which is 8% lower than last week. Great progress!" },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: text.trim() }]);
    setInputValue('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: "Great question! I'm analyzing your habits to provide personalized suggestions..." }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full" data-testid="ai-chatbot">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <Sparkles className="w-5 h-5 text-teal-600" />
        <h3 className="font-semibold text-gray-800">EcoCoach AI</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-white/80 border border-gray-100 text-gray-700'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about eco-friendly swaps..."
            className="flex-1 px-4 py-2.5 text-sm bg-white/70 border border-gray-100 rounded-xl"
            data-testid="chat-input"
          />
          <button onClick={() => handleSend()} className="p-2.5 bg-emerald-600 text-white rounded-xl" data-testid="send-button">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface EcoSyncDashboardProps {
  chartData?: ChartData[];
  challenges?: Challenge[];
  ecoCredits?: number;
}

export function EcoSyncDashboard({
  chartData = [
    { category: 'Transport', value: 4.2, color: '#3b82f6' },
    { category: 'Food', value: 5.8, color: '#f59e0b' },
    { category: 'Utilities', value: 2.0, color: '#ef4444' },
  ],
  challenges = [
    { id: '1', title: 'Meatless Monday Quest', description: 'Go meat-free for one day this week', reward: 50, progress: 0, total: 1, locked: false },
    { id: '2', title: 'Commute Commando', description: 'Walk or bike 5 miles instead of driving', reward: 75, progress: 3, total: 5, locked: false },
    { id: '3', title: 'Unplugged Evening', description: 'Turn off all electronics for 3 hours', reward: 100, progress: 0, total: 1, locked: true },
  ],
  ecoCredits = 450,
}: EcoSyncDashboardProps) {
  const challengeIcons = [
    <UtensilsCrossed className="w-5 h-5" key="utensils" />,
    <Car className="w-5 h-5" key="car" />,
    <Lightbulb className="w-5 h-5" key="lightbulb" />,
  ];

  const challengesWithIcons = challenges.map((c, i) => ({
    ...c,
    icon: challengeIcons[i] || <Leaf className="w-5 h-5" key="leaf" />,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-gray-100" data-testid="eco-dashboard">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-md">
                <Leaf className="w-6 h-6 text-white" data-testid="logo-icon" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">EcoSync AI</h1>
                <p className="text-xs text-gray-500">Carbon Footprint Tracker</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-700" data-testid="credits-display">{ecoCredits} Credits</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hero Section */}
            <section className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Weekly CO2 Breakdown</h2>
                  </div>
                  <CO2Chart data={chartData} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <TreeDeciduous className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Your Virtual Forest</h2>
                  </div>
                  <VirtualForest credits={ecoCredits} />
                </div>
              </div>
            </section>

            {/* KPI Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KPICard title="Current Footprint" value="12.0 kg" subtitle="CO2 this week" icon={<Leaf className="w-5 h-5 text-emerald-600" />} trend="8% vs last week" trendUp />
              <KPICard title="Guild Rank" value="#12" subtitle="EcoWarriors Guild" icon={<Trophy className="w-5 h-5 text-amber-500" />} />
              <KPICard title="Total Saved" value="156 kg" subtitle="CO2 saved all time" icon={<Award className="w-5 h-5 text-teal-600" />} />
            </section>

            {/* Receipt Scanner */}
            <section className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
              <ReceiptScanner />
            </section>

            {/* Challenges */}
            <section className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-gray-800">Active Challenges</h2>
                </div>
                <button className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {challengesWithIcons.map((challenge, i) => (
                  <ChallengeCard key={challenge.id || i} challenge={challenge as Challenge & { icon: React.ReactNode }} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - AI Chatbot */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl h-[600px] flex flex-col overflow-hidden">
                <AIChatbot />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-6 border-t border-gray-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-">
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-500">Making sustainable living simple and rewarding</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default EcoSyncDashboard;
