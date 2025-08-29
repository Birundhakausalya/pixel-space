import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Gamepad2,
  Trophy,
  Smile,
  Frown,
  Meh,
  Star,
  RefreshCw,
  CheckCircle,
  XCircle,
  Brain,
  Target,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import EncouragementMessage from "@/components/EncouragementMessage";

interface GameQuestion {
  id: number;
  text: string;
  correctAnswer: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

const gameQuestions: GameQuestion[] = [
  {
    id: 1,
    text: "I love playing video games with my friends!",
    correctAnswer: 'positive',
    explanation: "The word 'love' is a strong positive emotion word, and the exclamation mark shows excitement!"
  },
  {
    id: 2,
    text: "This homework is so boring and difficult.",
    correctAnswer: 'negative',
    explanation: "Words like 'boring' and 'difficult' express negative feelings about the homework."
  },
  {
    id: 3,
    text: "Today is Wednesday.",
    correctAnswer: 'neutral',
    explanation: "This is just stating a fact without any emotional words or opinions."
  },
  {
    id: 4,
    text: "I can't wait for the weekend! It's going to be amazing!!!",
    correctAnswer: 'positive',
    explanation: "Phrases like 'can't wait' and 'amazing' with multiple exclamation marks show high excitement!"
  },
  {
    id: 5,
    text: "I hate vegetables and they taste awful.",
    correctAnswer: 'negative',
    explanation: "Both 'hate' and 'awful' are strong negative emotion words."
  },
  {
    id: 6,
    text: "The weather is okay today.",
    correctAnswer: 'neutral',
    explanation: "The word 'okay' typically indicates a neutral, neither good nor bad feeling."
  },
  {
    id: 7,
    text: "My birthday party was absolutely fantastic!",
    correctAnswer: 'positive',
    explanation: "'Absolutely fantastic' is a very strong positive expression showing great joy!"
  },
  {
    id: 8,
    text: "I'm feeling sad because my friend moved away.",
    correctAnswer: 'negative',
    explanation: "'Sad' is a clear negative emotion, and the reason explains why it's negative."
  }
];

export default function Games() {
  const [gameMode, setGameMode] = useState<'menu' | 'quiz' | 'speed' | 'results'>('menu');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentGameQuestions, setCurrentGameQuestions] = useState<GameQuestion[]>([]);

  const startQuizGame = () => {
    const shuffled = [...gameQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);
    setCurrentGameQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setShowExplanation(false);
    setGameMode('quiz');
  };

  const startSpeedGame = () => {
    const shuffled = [...gameQuestions].sort(() => 0.5 - Math.random());
    setCurrentGameQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(30);
    setGameMode('speed');
    
    // Start countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameMode('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswer = (selectedAnswer: 'positive' | 'negative' | 'neutral') => {
    const question = currentGameQuestions[currentQuestion];
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    setAnswers([...answers, isCorrect]);
    if (isCorrect) {
      setScore(score + 1);
    }
    
    if (gameMode === 'quiz') {
      setShowExplanation(true);
    } else {
      // Speed mode - go to next question immediately
      if (currentQuestion < currentGameQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setGameMode('results');
      }
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestion < currentGameQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameMode('results');
    }
  };

  const resetGame = () => {
    setGameMode('menu');
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setShowExplanation(false);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return Smile;
      case 'negative': return Frown;
      default: return Meh;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'sentiment-positive';
      case 'negative': return 'sentiment-negative';
      default: return 'sentiment-neutral';
    }
  };

  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Header */}
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
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gradient">Sentiment Games</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Let's Play & Learn!</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Test your sentiment analysis skills with fun games! Can you guess emotions better than a computer?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Quiz Game */}
            <Card className="p-8 border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-blue-800">Smart Quiz</h2>
                <p className="text-gray-600 mb-6">
                  Take your time and learn from detailed explanations after each question. Perfect for understanding the "why" behind sentiment analysis!
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    5 carefully selected questions
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Brain className="w-4 h-4" />
                    Detailed explanations
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4" />
                    Learn as you play
                  </div>
                </div>
                <Button 
                  onClick={startQuizGame}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl"
                >
                  Start Smart Quiz
                </Button>
              </div>
            </Card>

            {/* Speed Game */}
            <Card className="p-8 border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-lg">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-green-800">Speed Challenge</h2>
                <p className="text-gray-600 mb-6">
                  How many questions can you answer correctly in 30 seconds? Test your quick thinking and intuition!
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Zap className="w-4 h-4" />
                    30 second time limit
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    Quick decisions
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Trophy className="w-4 h-4" />
                    Beat your high score
                  </div>
                </div>
                <Button 
                  onClick={startSpeedGame}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-xl"
                >
                  Start Speed Challenge
                </Button>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Card className="p-6 border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-orange-50">
              <h3 className="text-xl font-semibold mb-3 text-orange-800">🎯 How to Play</h3>
              <p className="text-gray-700">
                Read each message and decide if it shows <strong>positive</strong> 😊, <strong>negative</strong> 😢, or <strong>neutral</strong> 😐 emotions. 
                Look for clue words and punctuation that give away the feelings!
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'results') {
    const percentage = Math.round((score / answers.length) * 100);
    const getMessage = () => {
      if (percentage >= 90) return "🏆 Sentiment Analysis Expert!";
      if (percentage >= 70) return "🌟 Great Job!";
      if (percentage >= 50) return "👍 Good Effort!";
      return "🎯 Keep Practicing!";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <header className="p-6 backdrop-blur-sm bg-white/80 border-b border-purple-100">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-fun flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">Game Results</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 border-2 border-purple-100 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4 text-gradient">{getMessage()}</h1>
            
            <div className="text-6xl font-bold mb-4 text-purple-600">
              {score}/{answers.length}
            </div>
            
            <div className="text-2xl font-semibold mb-6 text-gray-700">
              {percentage}% Correct
            </div>

            <Progress value={percentage} className="h-4 mb-6" />

            <EncouragementMessage
              type={percentage >= 80 ? 'completion' : percentage >= 60 ? 'success' : 'effort'}
              className="mb-6"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                <div className="text-2xl font-bold text-red-600">{answers.length - score}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={resetGame}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              <Link to="/demo">
                <Button variant="outline" className="border-2 border-purple-200 hover:bg-purple-50 px-6 py-3 rounded-xl">
                  Try Demo
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="outline" className="border-2 border-blue-200 hover:bg-blue-50 px-6 py-3 rounded-xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = currentGameQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / currentGameQuestions.length) * 100;

  // Safety check - if no question is available, go back to menu
  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Loading game...</p>
          <Button onClick={() => setGameMode('menu')}>Back to Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="p-6 backdrop-blur-sm bg-white/80 border-b border-purple-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-fun flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">
              {gameMode === 'quiz' ? 'Smart Quiz' : 'Speed Challenge'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {gameMode === 'speed' && (
              <Badge className="bg-red-100 text-red-700 text-lg px-3 py-1">
                ⏰ {timeLeft}s
              </Badge>
            )}
            <Badge className="bg-blue-100 text-blue-700">
              Question {currentQuestion + 1}/{currentGameQuestions.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-3" />
        </div>

        <Card className="p-8 border-2 border-purple-100">
          {!showExplanation ? (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                How does this message feel?
              </h2>
              
              <Card className="p-6 mb-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                <p className="text-xl text-center font-medium text-gray-800">
                  "{question.text}"
                </p>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleAnswer('positive')}
                  className="h-20 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  size="lg"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Smile className="w-8 h-8" />
                    <span className="text-lg font-semibold">Positive</span>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleAnswer('negative')}
                  className="h-20 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  size="lg"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Frown className="w-8 h-8" />
                    <span className="text-lg font-semibold">Negative</span>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleAnswer('neutral')}
                  className="h-20 bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  size="lg"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Meh className="w-8 h-8" />
                    <span className="text-lg font-semibold">Neutral</span>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                {answers[answers.length - 1] ? (
                  <>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                      <h2 className="text-3xl font-bold text-green-600">Correct!</h2>
                    </div>
                    <EncouragementMessage type="success" className="mb-4" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <XCircle className="w-12 h-12 text-red-600" />
                      <h2 className="text-3xl font-bold text-red-600">Not quite!</h2>
                    </div>
                    <EncouragementMessage type="effort" className="mb-4" />
                  </>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-lg mb-4">The correct answer is:</p>
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl ${getSentimentColor(question.correctAnswer)}`}>
                  {(() => {
                    const Icon = getSentimentIcon(question.correctAnswer);
                    return <Icon className="w-6 h-6" />;
                  })()}
                  <span className="text-xl font-bold capitalize">{question.correctAnswer}</span>
                </div>
              </div>
              
              <Card className="p-4 border-2 border-yellow-200 bg-yellow-50 mb-6">
                <p className="text-gray-700">{question.explanation}</p>
              </Card>
              
              <Button 
                onClick={nextQuestion}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl"
              >
                {currentQuestion < currentGameQuestions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            </div>
          )}
        </Card>

        {/* Score */}
        <div className="text-center mt-6">
          <Badge className="bg-purple-100 text-purple-700 text-lg px-4 py-2">
            <Trophy className="w-4 h-4 mr-2" />
            Score: {score}/{answers.length}
          </Badge>
        </div>
      </div>
    </div>
  );
}
