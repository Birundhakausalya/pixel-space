import { Card } from "@/components/ui/card";
import { Sparkles, Star, Trophy, Heart } from "lucide-react";

interface EncouragementMessageProps {
  type: 'success' | 'progress' | 'completion' | 'effort';
  message?: string;
  className?: string;
}

const messages = {
  success: [
    "Awesome job! You're getting really good at this! 🌟",
    "Fantastic! You understood that perfectly! ✨",
    "Amazing work! You're becoming a sentiment expert! 🏆",
    "Great thinking! That was spot on! 💫"
  ],
  progress: [
    "You're doing great! Keep going! 🚀",
    "Nice work! You're learning so much! 📚",
    "Excellent progress! Keep it up! ⭐",
    "You're on the right track! 🎯"
  ],
  completion: [
    "Wow! You completed everything! You're a sentiment analysis superstar! 🌟",
    "Incredible! You've mastered sentiment analysis! 🏆",
    "Outstanding! You should be proud of yourself! 🎉",
    "Amazing achievement! You're ready to teach others! 👏"
  ],
  effort: [
    "Great effort! Learning is all about trying! 💪",
    "Nice try! You're getting better with each attempt! 🌱",
    "Good work! Every mistake helps you learn! 🧠",
    "Keep going! You're doing your best and that's what matters! ❤️"
  ]
};

const icons = {
  success: Star,
  progress: Sparkles,
  completion: Trophy,
  effort: Heart
};

const colors = {
  success: "border-green-200 bg-green-50",
  progress: "border-blue-200 bg-blue-50", 
  completion: "border-purple-200 bg-purple-50",
  effort: "border-orange-200 bg-orange-50"
};

export default function EncouragementMessage({ 
  type, 
  message, 
  className = "" 
}: EncouragementMessageProps) {
  const Icon = icons[type];
  const selectedMessage = message || messages[type][Math.floor(Math.random() * messages[type].length)];
  
  return (
    <Card className={`p-4 border-2 ${colors[type]} ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <p className="text-gray-700 font-medium flex-1">
          {selectedMessage}
        </p>
      </div>
    </Card>
  );
}
