import { useState, useEffect, useRef } from "react";
import { useNarration } from "@/hooks/useNarration";
import { parseVttEndTime } from "@/lib/vtt";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Smile, Frown, Meh, ArrowRight, Sparkles, Zap, BookOpen, Gamepad2, Gauge } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const [currentEmotion, setCurrentEmotion] = useState(0);
  const emotions = [
    { icon: Smile, text: "Happy", color: "sentiment-positive", message: "I love ice cream!" },
    { icon: Frown, text: "Sad", color: "sentiment-negative", message: "I lost my favorite toy..." },
    { icon: Meh, text: "Neutral", color: "sentiment-neutral", message: "It's a regular Tuesday." }
  ];

  // Demo video quiz state
  const [demoReady, setDemoReady] = useState(false);
  const [demoAnswered, setDemoAnswered] = useState(false);
  const [demoSelected, setDemoSelected] = useState<number | null>(null);
  const [demoCorrect, setDemoCorrect] = useState(false);
  const demoVtt = `WEBVTT\n\n00:00.000 --> 00:03.000\nWelcome to the SentiLearn demo!\n\n00:03.000 --> 00:07.000\nWe learn emotions from words and stories.\n\n00:07.000 --> 00:11.000\nAfter the video, try the quick question below.\n`;
  const demoVttUrl = `data:text/vtt;charset=utf-8,${encodeURIComponent(demoVtt)}`;
  const [narrationOn, setNarrationOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { supported: narrationSupported } = useNarration(videoRef.current, demoVtt, narrationOn);
  const [mutedUI, setMutedUI] = useState(true);
  const demoOptions = [
    { text: "Understanding emotions from stories", correct: true },
    { text: "Learning multiplication tables", correct: false },
    { text: "Practicing geography maps", correct: false }
  ];
  const demoExplanation = demoSelected === null ? "" : demoOptions[demoSelected].correct
    ? "Correct! SentiLearn helps understand emotions from stories and words."
    : "Not quite. This demo is about understanding emotions from stories.";
  const handleDemoSelect = (idx: number) => {
    if (!demoReady || demoAnswered) return;
    setDemoSelected(idx);
    const isCorrect = demoOptions[idx].correct;
    setDemoCorrect(isCorrect);
    setDemoAnswered(true);
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const end = parseVttEndTime(demoVtt) || Infinity;
    const onTime = () => {
      if (el.currentTime >= end) {
        try { el.pause(); } catch {}
        setDemoReady(true);
      }
    };
    el.addEventListener('timeupdate', onTime);
    return () => { el.removeEventListener('timeupdate', onTime); };
  }, [videoRef.current]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEmotion((prev) => (prev + 1) % emotions.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const CurrentEmotionIcon = emotions[currentEmotion].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="p-6 backdrop-blur-sm bg-white/80 border-b border-purple-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-fun flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">SentiLearn</h1>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/demo" className="text-gray-600 hover:text-purple-600 transition-colors">Try Demo</Link>
            <Link to="/learn" className="text-gray-600 hover:text-purple-600 transition-colors">Learn</Link>
            <Link to="/games" className="text-gray-600 hover:text-purple-600 transition-colors">Games</Link>
            <Link to="/practice" className="text-gray-600 hover:text-purple-600 transition-colors">Practice</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">Dashboard</Link>
            {(() => {
              const name = typeof window !== 'undefined' ? localStorage.getItem('senti.user.name') : null;
              return name ? (
                <>
                  <span className="text-gray-700">Hi, <span className="font-semibold">{name}</span></span>
                  <Link to="/logout" className="text-purple-600 hover:text-purple-700 transition-colors">Logout</Link>
                </>
              ) : (
                <Link to="/login" className="text-purple-600 hover:text-purple-700 transition-colors">Login</Link>
              );
            })()}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
              <Sparkles className="w-4 h-4 mr-1" />
              Learn with AI Magic
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Teaching Computers</span><br />
              <span className="text-gray-800">to Feel Emotions!</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have you ever wondered how computers know if you're happy, sad, or excited when you write something? 
              Let's explore the amazing world of <strong>Sentiment Analysis</strong> together!
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="w-32 h-32 rounded-full gradient-fun flex items-center justify-center animate-float">
                <CurrentEmotionIcon className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <Badge className={`${emotions[currentEmotion].color} animate-bounce-gentle`}>
                  {emotions[currentEmotion].text}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl">
                <Zap className="w-5 h-5 mr-2" />
                Try It Now!
              </Button>
            </Link>
            <Link to="/learn">
              <Button size="lg" variant="outline" className="border-2 border-purple-200 hover:bg-purple-50 px-8 py-4 rounded-xl">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            🤖 The Story of Smart Computers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-2 border-blue-100 hover:border-blue-200 transition-all hover:shadow-lg">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-800">Once Upon a Time...</h3>
              <p className="text-gray-600 leading-relaxed">
                Humans could easily tell if someone was happy, sad, or angry just by listening to them. 
                But computers? They only understood 1s and 0s!
              </p>
            </Card>

            <Card className="p-8 border-2 border-green-100 hover:border-green-200 transition-all hover:shadow-lg">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-green-800">Scientists Had an Idea</h3>
              <p className="text-gray-600 leading-relaxed">
                What if we could teach computers to understand emotions by looking at the words people use? 
                Just like how you know your friend is excited when they use lots of exclamation marks!!!
              </p>
            </Card>

            <Card className="p-8 border-2 border-purple-100 hover:border-purple-200 transition-all hover:shadow-lg">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-purple-800">Magic Happened!</h3>
              <p className="text-gray-600 leading-relaxed">
                And so Sentiment Analysis was born! Now computers can read your messages and understand 
                if you're feeling happy 😊, sad 😢, or just okay 😐
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Preview */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">
            See It in Action! ✨
          </h2>

          <Card className="p-8 border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-orange-50">
            <h3 className="text-2xl font-semibold mb-6 text-orange-800">
              How does the computer know this message is...
            </h3>

            <div className="bg-white rounded-xl p-6 mb-6 border-2 border-orange-200">
              <p className="text-lg font-medium text-gray-700 mb-4">
                "{emotions[currentEmotion].message}"
              </p>
              <div className="flex justify-center">
                <Badge className={`${emotions[currentEmotion].color} text-lg px-4 py-2`}>
                  <CurrentEmotionIcon className="w-5 h-5 mr-2" />
                  {emotions[currentEmotion].text}
                </Badge>
              </div>
            </div>

            <div className="mb-6 text-left">
              <div className="relative">
                <video ref={videoRef} controls playsInline preload="auto" controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture className="w-full h-64 md:h-80 object-cover rounded-xl border-2 border-orange-200" poster="https://www.gstatic.com/webp/gallery/1.webp" onEnded={() => setDemoReady(true)}>
                  <source src="https://videos.pexels.com/video-files/8088338/8088338-sd_540_960_30fps.mp4" type="video/mp4" />
                  <track kind="subtitles" srcLang="en" label="English" default src={demoVttUrl} />
                </video>
                {mutedUI && (
                  <button onClick={() => { setMutedUI(false); try { if (videoRef.current) { videoRef.current.muted = false; videoRef.current.volume = 1; videoRef.current.play().catch(() => {}); } } catch {} }} className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-sm font-medium rounded-xl">
                    Tap to enable sound
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600">Watch the short demo, then answer the question below.</p>
                <div className="flex items-center gap-3">
                  <input type="range" min={0} max={100} defaultValue={100} className="w-28" onChange={(e) => { if (videoRef.current) videoRef.current.volume = Number(e.target.value)/100; }} />
                  {narrationSupported && (
                    <button onClick={() => setNarrationOn(v => !v)} className={`text-xs px-3 py-1 rounded-full border ${narrationOn ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50 border-gray-300 text-gray-700'}`}>
                      {narrationOn ? 'Narration: On' : 'Narration: Off'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="text-left">
              <h4 className="text-lg font-semibold mb-3 text-orange-800">Quick Question</h4>
              <div className="space-y-3">
                {demoOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${demoAnswered ? (opt.correct ? 'bg-green-50 border-green-300' : idx === demoSelected ? 'bg-red-50 border-red-300' : 'border-gray-200') : 'hover:bg-orange-50 border-gray-200'}`}
                    disabled={!demoReady || demoAnswered}
                    onClick={() => handleDemoSelect(idx)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              {demoAnswered && (
                <div className="mt-4 text-sm">
                  <div className={`p-3 rounded-xl border-2 ${demoCorrect ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'}`}>
                    {demoExplanation}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link to="/demo">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl">
                  Discover the Clues
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/practice">
                <Button variant="outline" className="border-2 border-orange-200 hover:bg-orange-50 px-6 py-3 rounded-xl">
                  Try Video Practice
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            What Will You Learn? 🎓
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/demo" className="group">
              <Card className="p-6 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg group-hover:scale-105">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-800">Interactive Demo</h3>
                <p className="text-gray-600">Type your own messages and watch the computer analyze them instantly!</p>
              </Card>
            </Link>

            <Link to="/learn" className="group">
              <Card className="p-6 border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg group-hover:scale-105">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-800">Learning Modules</h3>
                <p className="text-gray-600">Step-by-step lessons that teach you how sentiment analysis really works!</p>
              </Card>
            </Link>

            <Link to="/games" className="group">
              <Card className="p-6 border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-lg group-hover:scale-105">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Gamepad2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Fun Games</h3>
                <p className="text-gray-600">Play games where you guess emotions and compete with the computer!</p>
              </Card>
            </Link>

            <Link to="/practice" className="group">
              <Card className="p-6 border-2 border-pink-100 hover:border-pink-300 transition-all hover:shadow-lg group-hover:scale-105">
                <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-pink-800">Practice Stories</h3>
                <p className="text-gray-600">Answer story-based questions with instant feedback and explanations.</p>
              </Card>
            </Link>

            <Link to="/dashboard" className="group lg:col-span-2 lg:hidden block">
              <Card className="p-6 border-2 border-yellow-100 hover:border-yellow-300 transition-all hover:shadow-lg group-hover:scale-105">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                  <Gauge className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-800">Dashboard</h3>
                <p className="text-gray-600">Track your progress and download your certificate when ready.</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-fun flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">SentiLearn</h3>
          </div>
          <p className="text-gray-400">
            Teaching kids how computers understand emotions, one sentiment at a time! 💝
          </p>
        </div>
      </footer>
    </div>
  );
}
