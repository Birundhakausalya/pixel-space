import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('sentilearn_user_id');
    if (savedUserId) {
      loadUserProgress(savedUserId);
    } else {
      setLoading(false);
    }
  }, []);

  const createUser = async (name, email) => {
    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('sentilearn_user_id', data.userId);
      
      // Load initial progress
      await loadUserProgress(data.userId);
      
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const loadUserProgress = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/progress/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load user progress');
      }

      const data = await response.json();
      setUser(data.user);
      setProgress(data.progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
      // Don't throw here, just set loading to false
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (type, data) => {
    if (!user) return;

    try {
      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          type,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      const result = await response.json();
      setProgress(result.progress);
      return result;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  const generateCertificate = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate certificate');
      }

      const result = await response.json();
      
      // Refresh progress to get updated certificates
      await loadUserProgress(user.id);
      
      return result;
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setProgress(null);
    localStorage.removeItem('sentilearn_user_id');
  };

  const isModuleCompleted = (moduleId) => {
    return progress?.modulesCompleted?.includes(moduleId) || false;
  };

  const getCompletionPercentage = () => {
    if (!progress) return 0;
    return Math.round((progress.modulesCompleted.length / 5) * 100);
  };

  const getTotalScore = () => {
    return progress?.totalScore || 0;
  };

  const getAverageGameScore = () => {
    if (!progress?.gamesPlayed?.length) return 0;
    const total = progress.gamesPlayed.reduce((sum, game) => sum + game.percentage, 0);
    return Math.round(total / progress.gamesPlayed.length);
  };

  const isEligibleForCertificate = () => {
    if (!progress) return false;
    
    const modulesCompleted = progress.modulesCompleted.length >= 5;
    const averageScore = getAverageGameScore() >= 80;
    const gamesPlayed = progress.gamesPlayed.length >= 2;
    
    return modulesCompleted && averageScore && gamesPlayed;
  };

  const value = {
    user,
    progress,
    loading,
    createUser,
    loadUserProgress,
    updateProgress,
    generateCertificate,
    logout,
    isModuleCompleted,
    getCompletionPercentage,
    getTotalScore,
    getAverageGameScore,
    isEligibleForCertificate,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
