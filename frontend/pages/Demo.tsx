import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Smile, Frown, Meh, Sparkles, ArrowLeft, Send, Brain, Lightbulb, RefreshCw, ToggleLeft, ToggleRight, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { SentimentAnalysisRequest, SentimentAnalysisResponse } from "@shared/api";
import LoadingSpinner from "@/components/LoadingSpinner";

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  keywords: string[];
  explanation: string;
  approach: 'keyword' | 'advanced';
  details?: {
    positiveWords: number;
    negativeWords: number;
    neutralWords: number;
    totalWords: number;
    features: {
      exclamationMarks: number;
      questionMarks: number;
      capsWords: number;
    };
  };
}

export default function Demo() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [showKeywords, setShowKeywords] = useState(false);
  const [approach, setApproach] = useState<'keyword' | 'advanced'>('keyword');
  const [showDetails, setShowDetails] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const exampleTexts = [
    "I love playing with my friends at the park!",
    "This movie is boring and I want to go home.",
    "Today is a regular school day.",
    "I can't wait for my birthday party! It's going to be amazing!!!",
    "I'm feeling sad because my pet hamster died.",
    "The weather is okay today, nothing special."
  ];

  const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
    setIsAnalyzing(true);

    try {
      const requestData: SentimentAnalysisRequest = {
        text,
        approach
      };

      const response = await fetch('/api/sentiment/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }

      const data: SentimentAnalysisResponse = await response.json();

      return {
        sentiment: data.sentiment,
        confidence: data.confidence,
        keywords: data.keywords,
        explanation: data.explanation,
        approach: data.approach,
        details: data.details
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      // Fallback to a basic response
      return {
        sentiment: 'neutral',
        confidence: 50,
        keywords: [],
        explanation: 'Sorry, there was an error analyzing your message. Please try again!',
        approach: 'keyword'
      };
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    const sentimentResult = await analyzeSentiment(inputText);
    setResult(sentimentResult);
    setShowKeywords(false);
    setShowDetails(false);
  };

  const handleExampleClick = (text: string) => {
    setInputText(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">Interactive Demo</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Try Sentiment Analysis</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Type or click on an example below, then watch how the computer analyzes the emotions in your message!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-8 border-2 border-blue-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-blue-800 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Your Message
              </h2>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Analysis Mode:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setApproach(approach === 'keyword' ? 'advanced' : 'keyword')}
                    className="flex items-center gap-2 border-2"
                  >
                    {approach === 'keyword' ? (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        Simple
                      </>
                    ) : (
                      <>
                        <ToggleRight className="w-4 h-4" />
                        Advanced
                      </>
                    )}
                  </Button>
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                      Simple: Counts emotion words | Advanced: AI analysis with context
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Textarea
                ref={textareaRef}
                placeholder="Type how you're feeling or describe your day..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-32 text-lg border-2 border-blue-200 focus:border-blue-400"
              />
              
              <Button 
                onClick={handleAnalyze}
                disabled={!inputText.trim() || isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Analyze My Message!
                  </>
                )}
              </Button>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Try these examples:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exampleTexts.map((text, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleExampleClick(text)}
                    className="text-left h-auto p-3 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  >
                    <span className="text-sm">{text}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Results Section */}
          <Card className="p-8 border-2 border-green-100">
            <h2 className="text-2xl font-semibold mb-6 text-green-800 flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Computer's Analysis
            </h2>

            {isAnalyzing ? (
              <LoadingSpinner message="The computer is analyzing your message..." />
            ) : !result ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  Type a message and click "Analyze" to see the magic happen!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-full ${getSentimentColor(result.sentiment)} flex items-center justify-center mx-auto mb-4`}>
                    {(() => {
                      const Icon = getSentimentIcon(result.sentiment);
                      return <Icon className="w-10 h-10" />;
                    })()}
                  </div>
                  <h3 className="text-3xl font-bold mb-2 capitalize text-gray-800">
                    {result.sentiment}
                  </h3>
                  <p className="text-gray-600">{result.explanation}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Confidence Level</span>
                    <span className="text-sm font-bold text-gray-900">{result.confidence}%</span>
                  </div>
                  <Progress value={result.confidence} className="h-3" />
                </div>

                <div className="space-y-4">
                  {result.keywords.length > 0 && (
                    <div>
                      <Button
                        variant="outline"
                        onClick={() => setShowKeywords(!showKeywords)}
                        className="mb-4 border-2 border-yellow-200 hover:bg-yellow-50"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        {showKeywords ? 'Hide' : 'Show'} Clue Words
                      </Button>

                      {showKeywords && (
                        <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                          <h4 className="font-semibold mb-3 text-yellow-800">
                            The computer found these clues:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.keywords.map((keyword, index) => (
                              <Badge key={index} className="bg-yellow-200 text-yellow-800 hover:bg-yellow-300">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {result.details && (
                    <div>
                      <Button
                        variant="outline"
                        onClick={() => setShowDetails(!showDetails)}
                        className="mb-4 border-2 border-blue-200 hover:bg-blue-50"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        {showDetails ? 'Hide' : 'Show'} Analysis Details
                      </Button>

                      {showDetails && (
                        <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                          <h4 className="font-semibold mb-3 text-blue-800">
                            How the {result.approach} analysis worked:
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-medium text-green-700">Positive words: {result.details.positiveWords}</div>
                              <div className="font-medium text-red-700">Negative words: {result.details.negativeWords}</div>
                              <div className="font-medium text-gray-700">Neutral words: {result.details.neutralWords}</div>
                            </div>
                            <div>
                              <div className="font-medium text-blue-700">Total words: {result.details.totalWords}</div>
                              <div className="font-medium text-orange-700">Exclamation marks: {result.details.features.exclamationMarks}</div>
                              <div className="font-medium text-purple-700">CAPS words: {result.details.features.capsWords}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* How It Works Section */}
        <Card className="mt-12 p-8 border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">
            🧠 How Does the Computer Know?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-800">1. Look for Clues</h3>
              <p className="text-gray-600">
                The computer searches for special words like "love", "hate", or "okay" that tell us about emotions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-800">2. {approach === 'advanced' ? 'Smart Analysis' : 'Count & Compare'}</h3>
              <p className="text-gray-600">
                {approach === 'advanced'
                  ? 'Advanced AI considers context, patterns, and linguistic features for deeper understanding.'
                  : 'It counts how many positive, negative, and neutral words it finds, then compares them.'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-purple-800">3. Make a Decision</h3>
              <p className="text-gray-600">
                {approach === 'advanced'
                  ? 'The AI weighs all factors and provides a confidence score for its final prediction!'
                  : 'Based on what it found, the computer makes its best guess about how you\'re feeling!'}
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Want to learn more about how this amazing technology works?
          </p>
          <Link to="/learn">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl">
              <Lightbulb className="w-5 h-5 mr-2" />
              Explore Learning Modules
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
