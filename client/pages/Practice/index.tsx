import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowLeft, CheckCircle, XCircle, Sparkles, Lightbulb, Trophy } from "lucide-react";
import EncouragementMessage from "@/components/EncouragementMessage";
import { useNarration } from "@/hooks/useNarration";
import { downloadCertificate as downloadCertUtil } from "@/lib/cert";
import { parseVttEndTime } from "@/lib/vtt";

interface Option { text: string; correct: boolean; explanation: string; }
interface Scene { id: number; videoUrl: string; vtt: string; question: string; options: Option[]; poster: string; }
interface PracticeModule { id: number; title: string; scenes: Scene[]; }

const m1Scenes: Scene[] = [
  {
    id: 1,
    videoUrl: "https://videos.pexels.com/video-files/5200029/5200029-sd_640_360_25fps.mp4",
    poster: "https://www.gstatic.com/webp/gallery/4.webp",
    vtt: `WEBVTT\n\n00:00.000 --> 00:04.000\nA rainy morning and a football final today.\n\n00:04.000 --> 00:08.000\nPlans may change—we can feel disappointed, but keep trying.\n\n00:08.000 --> 00:12.000\nListen to the feelings behind the story.\n`,
    question: "What is Aarav most likely feeling?",
    options: [
      { text: "Excited", correct: false, explanation: "Rain and a sigh before an important match suggest disappointment, not excitement." },
      { text: "Disappointed", correct: true, explanation: "The rainy weather threatens his football final and he sighs—clear clues of disappointment." },
      { text: "Angry", correct: false, explanation: "There is no sign of anger like shouting or frustration; it's more of a let-down." },
      { text: "Confused", correct: false, explanation: "Aarav knows what's happening; he's not unsure or puzzled." }
    ]
  },
  {
    id: 2,
    videoUrl: "https://videos.pexels.com/video-files/5184436/5184436-hd_1080_1920_30fps.mp4",
    poster: "https://www.gstatic.com/webp/gallery/2.webp",
    vtt: `WEBVTT\n\n00:00.000 --> 00:04.000\nDays of practice lead to smooth performance.\n\n00:04.000 --> 00:08.000\nProud smiles show hard work paying off.\n`,
    question: "Which feeling best matches Maya's emotion?",
    options: [
      { text: "Proud", correct: true, explanation: "Her hard work paid off and the applause confirms a sense of pride and accomplishment." },
      { text: "Jealous", correct: false, explanation: "Jealousy would be about wanting what others have, but this success is hers." },
      { text: "Bored", correct: false, explanation: "Launching a successful rocket with applause is exciting, not boring." },
      { text: "Scared", correct: false, explanation: "Nothing in the story suggests fear or danger." }
    ]
  },
  {
    id: 3,
    videoUrl: "https://videos.pexels.com/video-files/8612321/8612321-sd_426_240_25fps.mp4",
    poster: "https://www.gstatic.com/webp/gallery/5.webp",
    vtt: `WEBVTT\n\n00:00.000 --> 00:04.000\nPromises matter—forgetting lets others down.\n\n00:04.000 --> 00:08.000\nOwning mistakes is the first step to fixing them.\n`,
    question: "What should Vikram feel based on the story?",
    options: [
      { text: "Guilty", correct: true, explanation: "He broke a promise and let his sister down, which naturally leads to guilt." },
      { text: "Proud", correct: false, explanation: "Pride doesn't fit because he didn't keep his word or achieve something good." },
      { text: "Surprised", correct: false, explanation: "Nothing unexpected happened; he simply forgot." },
      { text: "Confident", correct: false, explanation: "Confidence is unrelated here; the situation calls for responsibility." }
    ]
  }
];

const m2Scenes: Scene[] = [
  {
    id: 1,
    videoUrl: "https://videos.pexels.com/video-files/7494784/7494784-sd_540_960_30fps.mp4",
    poster: "https://www.gstatic.com/webp/gallery/3.webp",
    vtt: `WEBVTT\n\n00:00.000 --> 00:04.000\nTry, learn, and try again—this is growth.\n\n00:04.000 --> 00:08.000\nSmall steps lead to big wins.\n`,
    question: "Which trait best describes Arun?",
    options: [
      { text: "Persistence", correct: true, explanation: "He kept trying new ideas until he solved the puzzle." },
      { text: "Frustration", correct: false, explanation: "He felt challenged but did not give up in frustration." },
      { text: "Laziness", correct: false, explanation: "He kept working—this is the opposite of laziness." },
      { text: "Fearful", correct: false, explanation: "There is no sign of fear; he is determined." }
    ]
  },
  {
    id: 2,
    videoUrl: "https://videos.pexels.com/video-files/8612321/8612321-sd_426_240_25fps.mp4",
    poster: "https://www.gstatic.com/webp/gallery/1.webp",
    vtt: `WEBVTT\n\n00:00.000 --> 00:04.000\nKindness is inviting others and sharing.\n\n00:04.000 --> 00:08.000\nBeing friendly makes everyone feel welcome.\n`,
    question: "What emotion or value is Leela showing?",
    options: [
      { text: "Kindness", correct: true, explanation: "She included someone and shared—clear signs of kindness." },
      { text: "Anger", correct: false, explanation: "Her actions were friendly, not angry." },
      { text: "Jealousy", correct: false, explanation: "She was generous, not jealous." },
      { text: "Boredom", correct: false, explanation: "She actively helped someone; boredom doesn't fit." }
    ]
  },
  {
    id: 3,
    videoUrl: "https://videos.pexels.com/video-files/7494784/7494784-sd_540_960_30fps.mp4",
    poster: "https://www.gstatic.com/webp/gallery/2.webp",
    vtt: `WEBVTT\n\n00:00.000 --> 00:04.000\nAfter a loss, we learn and plan.\n\n00:04.000 --> 00:08.000\nPractice makes us stronger next time.\n`,
    question: "How did the team feel after the coach's words?",
    options: [
      { text: "Motivated", correct: true, explanation: "They planned extra practice and looked forward to improving." },
      { text: "Hopeless", correct: false, explanation: "They made a plan and felt encouraged, not hopeless." },
      { text: "Confused", correct: false, explanation: "Their next steps were clear—practice and improve." },
      { text: "Angry", correct: false, explanation: "There's no sign of anger; the tone is positive." }
    ]
  }
];

const modules: PracticeModule[] = [
  { id: 1, title: "Feelings in Daily Life", scenes: m1Scenes },
  { id: 2, title: "Growing Strong Minds", scenes: m2Scenes }
];

export default function Practice() {
  const [moduleIndex, setModuleIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [videoWatched, setVideoWatched] = useState(false);
  const [retestMode, setRetestMode] = useState(false);

  const currentModule = modules[moduleIndex];
  const scene = currentModule.scenes[sceneIndex];

  const vttUrl = useMemo(() => `data:text/vtt;charset=utf-8,${encodeURIComponent(scene.vtt)}`,[moduleIndex, sceneIndex]);
  const [narrationOn, setNarrationOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { supported: narrationSupported } = useNarration(videoRef.current, scene.vtt, narrationOn);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [mutedUI, setMutedUI] = useState(true);
  const [completedCount, setCompletedCount] = useState<number>(() => { try { return Number(localStorage.getItem('senti.practice.completedCount') || 0); } catch { return 0; } });

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const end = parseVttEndTime(scene.vtt);
    const onTime = () => {
      if (end && el.currentTime >= end) {
        try { el.pause(); } catch {}
        setVideoWatched(true);
        setMutedUI(false);
      }
    };
    el.addEventListener('timeupdate', onTime);
    return () => { el.removeEventListener('timeupdate', onTime); };
  }, [sceneIndex, moduleIndex]);

  useEffect(() => {
    // reset per scene
    setSelectedIndex(null);
    setShowExplanation(false);
    setVideoWatched(retestMode ? true : false);
    setMutedUI(!retestMode);
    try {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    } catch {}
  }, [moduleIndex, sceneIndex, retestMode]);


  const totalScenes = currentModule.scenes.length;
  const progress = Math.round(((sceneIndex + 1) / totalScenes) * 100);

  const handleSelect = (idx: number) => {
    if (!videoWatched && !retestMode) return;
    if (showExplanation) return;
    setSelectedIndex(idx);
    const isCorrect = scene.options[idx].correct;
    setAnswers(prev => [...prev, isCorrect]);
    setShowExplanation(true);
  };

  const next = () => {
    if (sceneIndex < totalScenes - 1) {
      setSceneIndex(sceneIndex + 1);
    } else {
      // Module finished
      const totalCorrect = answers.filter(Boolean).length;
      const accuracy = Math.round((totalCorrect / Math.max(answers.length, 1)) * 100);
      try {
        const best = Number(localStorage.getItem("senti.practice.bestAccuracy") || 0);
        if (accuracy > best) localStorage.setItem("senti.practice.bestAccuracy", String(accuracy));
        localStorage.setItem("senti.practice.lastAccuracy", String(accuracy));
        localStorage.setItem("senti.practice.lastTotal", String(answers.length));
        if (totalCorrect === answers.length && answers.length > 0) {
          localStorage.setItem("senti.practice.allCorrect", "1");
        }
      } catch {}
    }
  };

  const finished = answers.length >= totalScenes && sceneIndex === totalScenes - 1 && showExplanation;
  const totalCorrect = answers.filter(Boolean).length;
  const accuracy = answers.length ? Math.round((totalCorrect / answers.length) * 100) : 0;
  const allCorrect = finished && totalCorrect === answers.length;

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <header className="p-6 backdrop-blur-sm bg-white/80 border-b border-purple-100">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-fun flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">Practice Results</h1>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 border-2 border-purple-100 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Great Practice!</h2>
            <div className="text-6xl font-bold mb-2 text-purple-600">{accuracy}%</div>
            <div className="text-gray-600 mb-6">{totalCorrect}/{answers.length} correct</div>
            <Progress value={accuracy} className="h-4 mb-6" />
            <EncouragementMessage type={allCorrect ? 'completion' : accuracy >= 60 ? 'success' : 'effort'} className="mb-6" />
            <div className="flex gap-4 justify-center flex-wrap">
              {allCorrect ? (
                moduleIndex < modules.length - 1 ? (
                  <Button
                    onClick={() => {
                      // move to next exercise set (module)
                      setModuleIndex(moduleIndex + 1);
                      setSceneIndex(0);
                      setAnswers([]);
                      setShowExplanation(false);
                      setSelectedIndex(null);
                      setRetestMode(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                  >
                    Next Exercise
                  </Button>
                ) : (
                  <Link to="/dashboard">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">All Done! Go to Dashboard</Button>
                  </Link>
                )
              ) : (
                <Button onClick={() => { try { const c = Number(localStorage.getItem('senti.practice.retests')||0)+1; localStorage.setItem('senti.practice.retests', String(c)); } catch {}; setSceneIndex(0); setAnswers([]); setShowExplanation(false); setSelectedIndex(null); setRetestMode(true); }} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">Retest (Questions unlocked)</Button>
              )}

              <Link to="/dashboard">
                <Button variant="outline" className="border-2 border-purple-200 hover:bg-purple-50">Generate Certificate</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">Practice Stories</h1>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            {modules.map((m, i) => (
              <Button key={m.id} variant={i === moduleIndex ? 'default' : 'outline'} onClick={() => { setModuleIndex(i); setSceneIndex(0); setAnswers([]); setRetestMode(false); }} className={i === moduleIndex ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : ''}>
                {m.title}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Practice Progress</span>
              <span className="text-sm font-bold text-gray-900">{progress}%</span>
            </div>
            <Badge className="bg-green-100 text-green-700">Completed {completedCount}/{totalScenes}</Badge>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <Card className="p-8 border-2 border-purple-100">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-yellow-700 mb-3">
              <Lightbulb className="w-5 h-5" />
              <span className="text-sm">Watch the story video, then answer the question. {retestMode && (<span className="ml-1 text-green-700 font-medium">Retest: questions unlocked</span>)}
              </span>
            </div>
            <div className="relative">
              <video ref={videoRef} controls playsInline preload="auto" controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture className="w-full h-64 md:h-80 object-cover rounded-xl border-2 border-blue-200 mb-2" poster={scene.poster} onEnded={() => { setVideoWatched(true); setMutedUI(false); }}>
                <source src={scene.videoUrl} type="video/mp4" />
                <track kind="subtitles" srcLang="en" label="English" default src={vttUrl} />
              </video>
              {!retestMode && mutedUI && (
                <button onClick={() => { setMutedUI(false); try { if (videoRef.current) { videoRef.current.muted = false; videoRef.current.volume = 1; videoRef.current.play().catch(() => {}); } } catch {} }} className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-sm font-medium rounded-xl">
                  Tap to enable sound
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              {!videoWatched && !retestMode ? (
                <p className="text-sm text-gray-600">Finish the video to unlock the question.</p>
              ) : <span />}
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

          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {scene.question}
          </h3>

          <div className="space-y-3">
            {scene.options.map((opt, idx) => (
              <OptionButton key={idx} option={opt} idx={idx} disabled={!videoWatched && !retestMode} showExplanation={showExplanation} selectedIndex={selectedIndex} onSelect={() => handleSelect(idx)} />
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                <Badge className="bg-green-100 text-green-700">
                  Correct Answer
                </Badge>
                <span className="font-medium text-gray-800">{scene.options.find(o=>o.correct)?.text}</span>
              </div>
              <Button onClick={() => {
                // mark completion for this scene
                const newCompleted = Math.max(completedCount, sceneIndex + 1);
                setCompletedCount(newCompleted);
                try { localStorage.setItem('senti.practice.completedCount', String(newCompleted)); } catch {}
                if (sceneIndex < totalScenes - 1) {
                  setSceneIndex(sceneIndex + 1);
                } else {
                  next();
                }
              }} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                {sceneIndex < totalScenes - 1 ? "Next Exercise" : "Finish Exercises"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function OptionButton({ option, idx, disabled, showExplanation, selectedIndex, onSelect }: { option: Option; idx: number; disabled: boolean; showExplanation: boolean; selectedIndex: number | null; onSelect: () => void; }) {
  const isSelected = selectedIndex === idx;
  const isCorrect = option.correct;
  const showColors = showExplanation;

  let classes = "w-full text-left p-4 rounded-xl border-2 transition-all";
  if (disabled && !showExplanation) {
    classes += " opacity-60 cursor-not-allowed";
  } else if (showColors) {
    if (isCorrect) classes += " bg-green-50 border-green-300";
    if (isSelected && !isCorrect) classes += " bg-red-50 border-red-300";
  } else if (isSelected) {
    classes += " border-blue-300 bg-blue-50";
  } else {
    classes += " hover:bg-gray-50 border-gray-200";
  }

  return (
    <button className={classes} onClick={() => { if (!disabled) onSelect(); }} disabled={disabled}>
      <Inner option={option} showColors={showColors} isSelected={isSelected} />
    </button>
  );
}

function Inner({ option, showColors, isSelected }: { option: Option; showColors: boolean; isSelected: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-6 h-6 rounded-full border flex items-center justify-center mt-1 ${
        showColors ? (option.correct ? "bg-green-500 border-green-500" : isSelected ? "bg-red-500 border-red-500" : "border-gray-300") : "border-gray-300"
      }`}>
        {showColors && (option.correct ? <CheckCircle className="w-4 h-4 text-white" /> : isSelected ? <XCircle className="w-4 h-4 text-white" /> : null)}
      </div>
      <div>
        <div className="font-medium text-gray-800">{option.text}</div>
        {showColors && isSelected && !option.correct && (
          <div className="text-sm text-red-700 mt-1">{option.explanation}</div>
        )}
        {showColors && option.correct && (
          <div className="text-sm text-green-700 mt-1">{option.explanation}</div>
        )}
      </div>
    </div>
  );
}
