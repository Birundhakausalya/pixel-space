import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="p-6 backdrop-blur-sm bg-white/80 border-b border-purple-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-fun flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">SentiLearn</h1>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <Card className="p-12 border-2 border-purple-100 text-center">
          <div className="text-8xl mb-6">🤖❓</div>
          
          <h1 className="text-4xl font-bold mb-4 text-gradient">
            Oops! This Page Got Lost!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Looks like this page wandered off somewhere! Don't worry though - 
            let's get you back to learning about sentiment analysis! 🚀
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <Link to="/">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full border-2 border-purple-200 hover:bg-purple-50 py-3 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
            <Link to="/demo">
              <Button variant="ghost" className="w-full hover:bg-blue-50 text-blue-600">
                Try Demo
              </Button>
            </Link>
            <Link to="/learn">
              <Button variant="ghost" className="w-full hover:bg-green-50 text-green-600">
                Learn More
              </Button>
            </Link>
            <Link to="/games">
              <Button variant="ghost" className="w-full hover:bg-purple-50 text-purple-600">
                Play Games
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
