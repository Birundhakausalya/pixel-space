import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Award, Gauge, BookOpen, Gamepad2, ListChecks, Download, Sparkles } from "lucide-react";
import { downloadCertificate as downloadCertUtil } from "@/lib/cert";
import EncouragementMessage from "@/components/EncouragementMessage";

function useProgress() {
  const [learnProgress, setLearnProgress] = useState(0);
  const [gamesBest, setGamesBest] = useState(0);
  const [gamesLast, setGamesLast] = useState(0);
  const [practiceBest, setPracticeBest] = useState(0);
  const [practiceLast, setPracticeLast] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    try {
      setLearnProgress(Number(localStorage.getItem("senti.learn.progress") || 0));
      setGamesBest(Number(localStorage.getItem("senti.games.bestAccuracy") || 0));
      setGamesLast(Number(localStorage.getItem("senti.games.lastAccuracy") || 0));
      setPracticeBest(Number(localStorage.getItem("senti.practice.bestAccuracy") || 0));
      setPracticeLast(Number(localStorage.getItem("senti.practice.lastAccuracy") || 0));
      setCompletedCount(Number(localStorage.getItem("senti.practice.completedCount") || 0));
    } catch {}
  }, []);

  const readyForCertificate = completedCount >= 20 || ((practiceBest === 100 || practiceLast === 100) || (learnProgress >= 60 && (gamesBest >= 60 || gamesLast >= 60) && (practiceBest >= 60 || practiceLast >= 60)));

  return { learnProgress, gamesBest, gamesLast, practiceBest, practiceLast, completedCount, readyForCertificate };
}

/* certificate SVG moved to shared util */
function generateCertificateSVG(name: string, stats: { learn: number; games: number; practice: number; }) {
  const date = new Date().toLocaleDateString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#fff9f9"/>
  <rect x="40" y="40" width="1120" height="720" rx="24" fill="none" stroke="url(#g)" stroke-width="8"/>
  <text x="50%" y="140" font-size="48" font-family="Segoe UI, Roboto, Arial" text-anchor="middle" fill="#111827">Certificate of Achievement</text>
  <text x="50%" y="210" font-size="24" font-family="Segoe UI, Roboto, Arial" text-anchor="middle" fill="#6b7280">awarded to</text>
  <text x="50%" y="280" font-size="56" font-family="Segoe UI, Roboto, Arial" text-anchor="middle" fill="#111827">${name}</text>
  <text x="50%" y="340" font-size="20" font-family="Segoe UI, Roboto, Arial" text-anchor="middle" fill="#6b7280">for outstanding progress in SentiLearn</text>
  <g transform="translate(200,380)">
    <rect width="800" height="2" fill="#e5e7eb"/>
  </g>
  <g transform="translate(200,420)">
    <rect width="800" height="120" rx="16" fill="#f3f4f6"/>
    <text x="400" y="50" font-size="20" text-anchor="middle" font-family="Segoe UI, Roboto, Arial" fill="#374151">Progress Summary</text>
    <text x="200" y="90" font-size="18" text-anchor="middle" font-family="Segoe UI, Roboto, Arial" fill="#111827">Learning: ${stats.learn}%</text>
    <text x="400" y="90" font-size="18" text-anchor="middle" font-family="Segoe UI, Roboto, Arial" fill="#111827">Games: ${stats.games}%</text>
    <text x="600" y="90" font-size="18" text-anchor="middle" font-family="Segoe UI, Roboto, Arial" fill="#111827">Practice: ${stats.practice}%</text>
  </g>
  <g transform="translate(200,580)">
    <text x="0" y="0" font-size="18" font-family="Segoe UI, Roboto, Arial" fill="#6b7280">Date: ${date}</text>
    <text x="800" y="0" font-size="18" font-family="Segoe UI, Roboto, Arial" text-anchor="end" fill="#6b7280">Signature: SentiLearn</text>
  </g>
</svg>`;
}

export default function Dashboard() {
  const { learnProgress, gamesBest, gamesLast, practiceBest, practiceLast, completedCount, readyForCertificate } = useProgress();
  const [name, setName] = useState("");

  const bestGame = Math.max(gamesBest, gamesLast);
  const bestPractice = Math.max(practiceBest, practiceLast);
  const overall = useMemo(() => Math.round((learnProgress + bestGame + bestPractice) / 3), [learnProgress, bestGame, bestPractice]);

  const downloadCertificate = () => {
    const displayName = name.trim() || "SentiLearn Student";
    downloadCertUtil(displayName, { learn: learnProgress, games: bestGame, practice: bestPractice });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="p-6 backdrop-blur-sm bg-white/80 border-b border-purple-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="hover:bg-purple-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-fun flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-2 border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-blue-800 font-semibold">
                <BookOpen className="w-5 h-5" /> Learning Progress
              </div>
              <Badge className="bg-blue-100 text-blue-700">{learnProgress}%</Badge>
            </div>
            <Progress value={learnProgress} className="h-3" />
          </Card>

          <Card className="p-6 border-2 border-green-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-green-800 font-semibold">
                <Gamepad2 className="w-5 h-5" /> Best Game Accuracy
              </div>
              <Badge className="bg-green-100 text-green-700">{bestGame}%</Badge>
            </div>
            <Progress value={bestGame} className="h-3" />
          </Card>

          <Card className="p-6 border-2 border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-purple-800 font-semibold">
                <ListChecks className="w-5 h-5" /> Best Practice Accuracy
              </div>
              <Badge className="bg-purple-100 text-purple-700">{bestPractice}%</Badge>
            </div>
            <Progress value={bestPractice} className="h-3" />
          </Card>

          <Card className="p-6 border-2 border-yellow-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-yellow-800 font-semibold">
                <ListChecks className="w-5 h-5" /> Exercises Completed
              </div>
              <Badge className="bg-yellow-100 text-yellow-700">{completedCount}/20</Badge>
            </div>
            <Progress value={Math.min(100, (completedCount/20)*100)} className="h-3" />
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 border-2 border-yellow-100 lg:col-span-2">
            <div className="flex items-center gap-2 mb-2 text-yellow-800 font-semibold">
              <Gauge className="w-5 h-5" /> Overall Progress
            </div>
            <div className="flex items-center gap-4">
              <div className="text-6xl font-bold text-gradient">{overall}%</div>
              <div className="flex-1">
                <Progress value={overall} className="h-3 mb-2" />
                <EncouragementMessage type={overall >= 80 ? 'completion' : overall >= 60 ? 'success' : 'effort'} />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-pink-100">
            <div className="mb-4">
              <div className="flex items-center gap-2 font-semibold text-pink-800">
                <Sparkles className="w-5 h-5" /> Certificate
              </div>
              <p className="text-sm text-gray-600 mt-1">Enter your name and download your certificate when you meet the goals.</p>
            </div>
            <div className="space-y-3">
              <input
                className="w-full p-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 outline-none"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button onClick={downloadCertificate} disabled={!readyForCertificate} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                {readyForCertificate ? 'Download Certificate' : 'Keep Going to Unlock'}
              </Button>
              {!readyForCertificate && (
                <div className="text-xs text-gray-600">
                  Requirement: complete 20 exercises (or meet previous progress thresholds) to unlock.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
