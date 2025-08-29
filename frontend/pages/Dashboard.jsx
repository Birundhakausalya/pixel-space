import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  ArrowLeft, 
  BarChart3, 
  Trophy,
  BookOpen,
  Gamepad2,
  Award,
  Star,
  TrendingUp,
  Calendar,
  Download,
  User,
  Brain,
  Target,
  Sparkles,
  CheckCircle,
  Clock,
  Zap,
  Gift
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EncouragementMessage from '../components/EncouragementMessage';

export default function Dashboard() {
  const { user, progress, loading, generateCertificate, isEligibleForCertificate } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoadingDashboard(true);
      const response = await fetch(`/api/dashboard/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to load dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      setGeneratingCertificate(true);
      const result = await generateCertificate();
      
      // Open certificate in new window
      window.open(result.certificate.certificateUrl, '_blank');
      
      // Reload dashboard data to show new certificate
      await loadDashboardData();
    } catch (error) {
      alert(error.message);
    } finally {
      setGeneratingCertificate(false);
    }
  };

  if (loading || loadingDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <LoadingSpinner message="Loading your dashboard..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-8 text-center border-2 border-purple-100">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to SentiLearn!</h2>
          <p className="text-gray-600 mb-6">Please start your learning journey to access your dashboard.</p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              Start Learning
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const certificates = dashboardData?.certificates || [];
  const recentActivity = dashboardData?.recentActivity || [];

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
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">Learning Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-purple-100 text-purple-700">
              <User className="w-4 h-4 mr-1" />
              {user.name}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Welcome back, {user.name}! 👋</span>
          </h1>
          <p className="text-xl text-gray-600">
            Keep up the great work on your sentiment analysis journey!
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.completedModules || 0}/{stats.totalModules || 5}
                </div>
                <div className="text-sm text-gray-600">Modules Completed</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalGames || 0}
                </div>
                <div className="text-sm text-gray-600">Games Played</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-violet-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalScore || 0}
                </div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-amber-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.certificatesEarned || 0}
                </div>
                <div className="text-sm text-gray-600">Certificates</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Progress */}
            <Card className="p-6 border-2 border-purple-100">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                Learning Progress
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Overall Completion</span>
                    <span className="font-bold text-purple-600">{stats.completionPercentage || 0}%</span>
                  </div>
                  <Progress value={stats.completionPercentage || 0} className="h-4" />
                </div>

                {stats.averageGameScore > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Average Game Score</span>
                      <span className="font-bold text-blue-600">{stats.averageGameScore}%</span>
                    </div>
                    <Progress value={stats.averageGameScore} className="h-4" />
                  </div>
                )}
              </div>

              {stats.nextMilestone && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Next Milestone</span>
                  </div>
                  <p className="text-blue-700">{stats.nextMilestone}</p>
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 border-2 border-green-100">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-green-600" />
                Recent Activity
              </h2>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'game' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {activity.type === 'game' ? (
                          <Gamepad2 className="w-4 h-4 text-blue-600" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{activity.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No recent activity yet. Start learning to see your progress!</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Certificate Section */}
            <Card className="p-6 border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-orange-50">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                Certificates
              </h2>
              
              {isEligibleForCertificate() ? (
                <div className="space-y-4">
                  <EncouragementMessage type="completion" />
                  <Button
                    onClick={handleGenerateCertificate}
                    disabled={generatingCertificate}
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
                  >
                    {generatingCertificate ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4 mr-2" />
                        Generate Certificate!
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Complete all requirements to earn your certificate:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {stats.completedModules >= 5 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={stats.completedModules >= 5 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        Complete all 5 modules ({stats.completedModules || 0}/5)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {stats.totalGames >= 2 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={stats.totalGames >= 2 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        Play at least 2 games ({stats.totalGames || 0}/2)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {stats.averageGameScore >= 80 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={stats.averageGameScore >= 80 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        Achieve 80% average score ({stats.averageGameScore || 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {certificates.length > 0 && (
                <div className="mt-6 pt-4 border-t border-yellow-200">
                  <h3 className="font-semibold mb-3 text-yellow-800">Your Certificates</h3>
                  {certificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                      <div>
                        <p className="font-medium text-gray-800">{cert.courseName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(cert.certificateUrl, '_blank')}
                        className="border-yellow-300 hover:bg-yellow-50"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 border-2 border-blue-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-600" />
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <Link to="/learn" className="block">
                  <Button variant="outline" className="w-full justify-start border-2 border-green-200 hover:bg-green-50">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                </Link>
                
                <Link to="/games" className="block">
                  <Button variant="outline" className="w-full justify-start border-2 border-blue-200 hover:bg-blue-50">
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Play Games
                  </Button>
                </Link>
                
                <Link to="/demo" className="block">
                  <Button variant="outline" className="w-full justify-start border-2 border-purple-200 hover:bg-purple-50">
                    <Brain className="w-4 h-4 mr-2" />
                    Try Demo
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Fun Stats */}
            {stats.daysActive > 0 && (
              <Card className="p-6 border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  Fun Stats
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Days Active</span>
                    <span className="font-bold text-purple-600">{stats.daysActive}</span>
                  </div>
                  
                  {stats.totalScore > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Points per Day</span>
                      <span className="font-bold text-purple-600">
                        {Math.round(stats.totalScore / stats.daysActive)}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
