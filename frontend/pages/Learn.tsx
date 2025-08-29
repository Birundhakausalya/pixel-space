import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  Brain, 
  BookOpen, 
  CheckCircle, 
  Circle,
  Lightbulb,
  Heart,
  Search,
  Calculator,
  Target,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

interface Module {
  id: number;
  title: string;
  description: string;
  icon: any;
  content: {
    sections: {
      title: string;
      content: string;
      visual?: string;
      interactive?: boolean;
    }[];
  };
}

const modules: Module[] = [
  {
    id: 1,
    title: "What Are Emotions?",
    description: "Understanding feelings and how we express them",
    icon: Heart,
    content: {
      sections: [
        {
          title: "Emotions Are Everywhere!",
          content: "Every day, you feel different emotions. When you see your best friend, you might feel happy 😊. When you have to do homework, you might feel neutral 😐. When someone is mean to you, you might feel sad 😢. These feelings are called emotions!",
          visual: "😊😐😢"
        },
        {
          title: "How Do We Show Emotions?",
          content: "We show our emotions in many ways: through our facial expressions, our voice, and especially through the words we choose to use. When you're excited, you might say 'This is AMAZING!' with lots of exclamation marks!",
          visual: "💬"
        },
        {
          title: "Words Have Feelings Too!",
          content: "Different words carry different emotions. 'Love' feels positive, 'hate' feels negative, and 'okay' feels neutral. Our choice of words tells others how we're feeling, even when they can't see our face!",
          visual: "💝"
        }
      ]
    }
  },
  {
    id: 2,
    title: "Teaching Computers About Feelings",
    description: "How can machines understand human emotions?",
    icon: Brain,
    content: {
      sections: [
        {
          title: "The Challenge",
          content: "Computers are really good at math and following instructions, but they don't naturally understand emotions like humans do. Imagine trying to explain to an alien what 'happy' means - that's what teaching computers about emotions is like!",
          visual: "🤖❓"
        },
        {
          title: "The Solution: Pattern Recognition",
          content: "Scientists discovered that computers could learn by looking at patterns. Just like how you can tell your friend is excited by the way they text with lots of '!!!' marks, computers can learn these patterns too!",
          visual: "🔍"
        },
        {
          title: "Training the Computer",
          content: "We show computers thousands of examples: 'I love ice cream!' = positive, 'I hate vegetables!' = negative, 'School is okay' = neutral. After seeing many examples, the computer starts to recognize the patterns!",
          visual: "📚"
        }
      ]
    }
  },
  {
    id: 3,
    title: "Finding Emotion Clues",
    description: "How computers detect emotional words and patterns",
    icon: Search,
    content: {
      sections: [
        {
          title: "Emotion Words Are Like Clues",
          content: "The computer looks for special 'clue words' that usually mean certain emotions. Words like 'awesome', 'fantastic', and 'love' are positive clues. Words like 'terrible', 'awful', and 'hate' are negative clues.",
          visual: "🕵️"
        },
        {
          title: "Punctuation Gives Hints Too!",
          content: "The computer also pays attention to punctuation! Lots of exclamation marks (!!!) usually mean excitement. ALL CAPITAL LETTERS might mean strong emotions. Even emojis are clues! 😊😢😡",
          visual: "!!!"
        },
        {
          title: "Context Matters",
          content: "Sometimes the same word can mean different things. 'That test was sick!' could be positive (meaning awesome) or negative (meaning awful). The computer looks at other words around it to understand the real meaning.",
          visual: "🧩"
        }
      ]
    }
  },
  {
    id: 4,
    title: "The Math Behind the Magic",
    description: "How computers calculate emotion scores",
    icon: Calculator,
    content: {
      sections: [
        {
          title: "Counting Emotion Words",
          content: "The computer counts how many positive words, negative words, and neutral words it finds in a message. It's like keeping score in a game: Positive team vs. Negative team vs. Neutral team!",
          visual: "🔢"
        },
        {
          title: "Giving Each Word a Score",
          content: "Each emotion word gets a score. 'Love' might be +3 points for positive, 'hate' might be -3 points for negative, and 'okay' might be 0 points for neutral. The computer adds up all the points!",
          visual: "⚖️"
        },
        {
          title: "Making the Final Decision",
          content: "After adding up all the scores, the computer looks at which team has the most points. If positive words have the highest score, the message is positive! It also tells us how confident it is in its answer.",
          visual: "🏆"
        }
      ]
    }
  },
  {
    id: 5,
    title: "Real-World Applications",
    description: "Where sentiment analysis is used in everyday life",
    icon: Target,
    content: {
      sections: [
        {
          title: "Social Media Monitoring",
          content: "Companies use sentiment analysis to see what people think about their products on social media. If lots of people post negative comments about a new toy, the company knows they need to make improvements!",
          visual: "📱"
        },
        {
          title: "Customer Service",
          content: "When you email customer support, sentiment analysis can help prioritize urgent messages. If someone writes an angry email, it gets handled faster than a neutral question about store hours.",
          visual: "💬"
        },
        {
          title: "Movie and Product Reviews",
          content: "Websites use sentiment analysis to automatically sort reviews. They can quickly show you if most people loved a movie or hated it, without you having to read every single review!",
          visual: "⭐"
        }
      ]
    }
  }
];

export default function Learn() {
  const [currentModule, setCurrentModule] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  const progress = ((currentModule * 3 + currentSection + 1) / (modules.length * 3)) * 100;

  const nextSection = () => {
    const module = modules[currentModule];
    if (currentSection < module.content.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else if (currentModule < modules.length - 1) {
      if (!completedModules.includes(currentModule)) {
        setCompletedModules([...completedModules, currentModule]);
      }
      setCurrentModule(currentModule + 1);
      setCurrentSection(0);
    } else {
      // Last section of last module
      if (!completedModules.includes(currentModule)) {
        setCompletedModules([...completedModules, currentModule]);
      }
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
      setCurrentSection(modules[currentModule - 1].content.sections.length - 1);
    }
  };

  const goToModule = (moduleIndex: number) => {
    setCurrentModule(moduleIndex);
    setCurrentSection(0);
  };

  const currentModuleData = modules[currentModule];
  const currentSectionData = currentModuleData.content.sections[currentSection];
  const isLastSection = currentModule === modules.length - 1 && currentSection === currentModuleData.content.sections.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="p-6 backdrop-blur-sm bg-white/80 border-b border-green-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="hover:bg-green-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-fun flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">Learning Modules</h1>
            </div>
          </div>
          <div className="hidden md:block">
            <Badge className="bg-green-100 text-green-700">
              Module {currentModule + 1} of {modules.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Learning Progress</span>
            <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Module Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-2 border-blue-100 sticky top-6">
              <h2 className="text-lg font-semibold mb-4 text-blue-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Modules
              </h2>
              <div className="space-y-3">
                {modules.map((module, index) => {
                  const Icon = module.icon;
                  const isCompleted = completedModules.includes(index);
                  const isCurrent = index === currentModule;
                  
                  return (
                    <Button
                      key={module.id}
                      variant={isCurrent ? "default" : "ghost"}
                      onClick={() => goToModule(index)}
                      className={`w-full justify-start p-3 h-auto ${
                        isCurrent 
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                          : isCompleted 
                            ? "bg-green-50 text-green-700 hover:bg-green-100" 
                            : "hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{module.title}</div>
                        </div>
                        {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-8 border-2 border-green-100">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                    <currentModuleData.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{currentModuleData.title}</h1>
                    <p className="text-gray-600">{currentModuleData.description}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mb-4">
                  {currentModuleData.content.sections.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentSection ? "bg-blue-500" : index < currentSection ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-green-800">
                  {currentSectionData.title}
                </h2>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">
                    {currentSectionData.content}
                  </p>
                  
                  {currentSectionData.visual && (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">{currentSectionData.visual}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={prevSection}
                  disabled={currentModule === 0 && currentSection === 0}
                  className="border-2 border-gray-200 hover:border-gray-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Section {currentSection + 1} of {currentModuleData.content.sections.length}
                  </p>
                </div>

                {!isLastSection ? (
                  <Button
                    onClick={nextSection}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <div className="text-center">
                    <Button
                      onClick={() => setCompletedModules([...completedModules, currentModule])}
                      className="bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 text-white mb-2"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Learning!
                    </Button>
                    <div className="space-y-2">
                      <Link to="/demo">
                        <Button variant="outline" className="w-full border-2 border-blue-200 hover:bg-blue-50">
                          Try the Demo
                        </Button>
                      </Link>
                      <Link to="/games">
                        <Button variant="outline" className="w-full border-2 border-purple-200 hover:bg-purple-50">
                          Play Games
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="p-4 text-center border-2 border-green-100">
                <div className="text-2xl font-bold text-green-600">{completedModules.length}</div>
                <div className="text-sm text-gray-600">Modules Completed</div>
              </Card>
              <Card className="p-4 text-center border-2 border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
                <div className="text-sm text-gray-600">Progress</div>
              </Card>
              <Card className="p-4 text-center border-2 border-purple-100">
                <div className="text-2xl font-bold text-purple-600">{modules.length}</div>
                <div className="text-sm text-gray-600">Total Modules</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
