import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Heart, Brain, Smile, Frown, Meh, ArrowRight, Sparkles, Zap, BookOpen, Gamepad2, User, BarChart3, Award, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import EncouragementMessage from "../components/EncouragementMessage";

export default function Index() {
  const { user, createUser, loading } = useUser();
  const [currentEmotion, setCurrentEmotion] = useState(0);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '' });
  const [creatingUser, setCreatingUser] = useState(false);

  const emotions = [
    { icon: Smile, text: "Happy", color: "sentiment-positive", message: "I love ice cream!" },
    { icon: Frown, text: "Sad", color: "sentiment-negative", message: "I lost my favorite toy..." },
    { icon: Meh, text: "Neutral", color: "sentiment-neutral", message: "It's a regular Tuesday." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEmotion((prev) => (prev + 1) % emotions.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setCreatingUser(true);
      await createUser(userForm.name.trim(), userForm.email.trim());
      setShowUserDialog(false);
      setUserForm({ name: '', email: '' });
    } catch (error) {
      alert('Failed to create user. Please try again.');
    } finally {
      setCreatingUser(false);
    }
  };

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
            <Link to="/demo" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Try Demo</Link>
            <Link to="/learn" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Learn</Link>
            <Link to="/games" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Games</Link>
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    <User className="w-4 h-4 mr-2" />
                    Start Learning
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Join SentiLearn!
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        className="border-2 border-purple-200 focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        className="border-2 border-purple-200 focus:border-purple-400"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={creatingUser}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {creatingUser ? 'Creating Account...' : 'Start My Journey!'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </nav>
        </div>
      </header>

      {/* Welcome Back Section for Existing Users */}
      {user && (
        <section className="py-8 px-6 bg-gradient-to-r from-purple-100 to-blue-100">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}! 👋</h2>
                <p className="text-gray-600">Ready to continue your sentiment analysis journey?</p>
              </div>
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Progress
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

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
            {user ? (
              <>
                <Link to="/demo">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl">
                    <Zap className="w-5 h-5 mr-2" />
                    Try It Now!
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="border-2 border-purple-200 hover:bg-purple-50 px-8 py-4 rounded-xl">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Progress
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  onClick={() => setShowUserDialog(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Learning!
                </Button>
                <Link to="/demo">
                  <Button size="lg" variant="outline" className="border-2 border-purple-200 hover:bg-purple-50 px-8 py-4 rounded-xl">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Try Demo First
                  </Button>
                </Link>
              </>
            )}
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
            <Card className="p-8 border-2 border-blue-100 hover:border-blue-200 transition-all hover:shadow-lg group">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-800">Once Upon a Time...</h3>
              <p className="text-gray-600 leading-relaxed">
                Humans could easily tell if someone was happy, sad, or angry just by listening to them. 
                But computers? They only understood 1s and 0s!
              </p>
            </Card>

            <Card className="p-8 border-2 border-green-100 hover:border-green-200 transition-all hover:shadow-lg group">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-green-800">Scientists Had an Idea</h3>
              <p className="text-gray-600 leading-relaxed">
                What if we could teach computers to understand emotions by looking at the words people use? 
                Just like how you know your friend is excited when they use lots of exclamation marks!!!
              </p>
            </Card>

            <Card className="p-8 border-2 border-purple-100 hover:border-purple-200 transition-all hover:shadow-lg group">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
          
          <Card className="p-8 border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg transition-shadow">
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
            
            <p className="text-gray-600 mb-6">
              The computer looks for special clue words and patterns to understand emotions!
            </p>
            
            <Link to="/demo">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl">
                Discover the Clues
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
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
              <Card className="p-6 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg group-hover:scale-105 h-full">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-800">Interactive Demo</h3>
                <p className="text-gray-600">Type your own messages and watch the computer analyze them instantly!</p>
              </Card>
            </Link>

            <Link to="/learn" className="group">
              <Card className="p-6 border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg group-hover:scale-105 h-full">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-800">Learning Modules</h3>
                <p className="text-gray-600">Step-by-step lessons that teach you how sentiment analysis really works!</p>
              </Card>
            </Link>

            <Link to="/games" className="group">
              <Card className="p-6 border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-lg group-hover:scale-105 h-full">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Gamepad2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Fun Games</h3>
                <p className="text-gray-600">Play games where you guess emotions and compete with the computer!</p>
              </Card>
            </Link>

            {user ? (
              <Link to="/dashboard" className="group">
                <Card className="p-6 border-2 border-yellow-100 hover:border-yellow-300 transition-all hover:shadow-lg group-hover:scale-105 h-full">
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-yellow-800">Your Progress</h3>
                  <p className="text-gray-600">Track your learning journey and earn certificates!</p>
                </Card>
              </Link>
            ) : (
              <div className="group cursor-pointer" onClick={() => setShowUserDialog(true)}>
                <Card className="p-6 border-2 border-yellow-100 hover:border-yellow-300 transition-all hover:shadow-lg group-hover:scale-105 h-full">
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-yellow-800">Earn Certificates</h3>
                  <p className="text-gray-600">Track your progress and earn certificates for your achievements!</p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Encouragement Section */}
      {user && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <EncouragementMessage type="progress" className="text-center" />
          </div>
        </section>
      )}

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
          <div className="mt-6 flex justify-center gap-6 text-sm">
            <Link to="/demo" className="hover:text-purple-400 transition-colors">Demo</Link>
            <Link to="/learn" className="hover:text-purple-400 transition-colors">Learn</Link>
            <Link to="/games" className="hover:text-purple-400 transition-colors">Games</Link>
            {user && <Link to="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link>}
          </div>
        </div>
      </footer>
    </div>
  );
}
