// API Response Types and Constants for SentiLearn

// Demo API
export const createDemoResponse = (message) => ({
  message
});

// Sentiment Analysis API
export const createSentimentAnalysisRequest = (text, approach = 'keyword') => ({
  text,
  approach
});

export const createSentimentAnalysisResponse = (sentiment, confidence, approach, keywords, explanation, details) => ({
  sentiment,
  confidence,
  approach,
  keywords,
  explanation,
  details
});

// User Management API
export const createUserRequest = (name, email) => ({
  name,
  email
});

export const createUserResponse = (userId, user, message) => ({
  userId,
  user,
  message
});

// Progress Tracking API
export const createProgressUpdateRequest = (userId, type, data) => ({
  userId,
  type,
  data
});

export const createProgressResponse = (success, progress, message) => ({
  success,
  progress,
  message
});

// Certificate API
export const createCertificateRequest = (userId) => ({
  userId
});

export const createCertificateResponse = (success, certificate, message) => ({
  success,
  certificate,
  message
});

// Dashboard API
export const createDashboardResponse = (user, stats, recentActivity, certificates, progress) => ({
  user,
  stats,
  recentActivity,
  certificates,
  progress
});

// Constants
export const SENTIMENT_TYPES = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral'
};

export const ANALYSIS_APPROACHES = {
  KEYWORD: 'keyword',
  ADVANCED: 'advanced'
};

export const PROGRESS_TYPES = {
  MODULE_COMPLETED: 'module_completed',
  GAME_COMPLETED: 'game_completed',
  QUIZ_COMPLETED: 'quiz_completed'
};

export const GAME_TYPES = {
  QUIZ: 'quiz',
  SPEED: 'speed'
};

// Validation helpers
export const validateText = (text) => {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Text is required and must be a string' };
  }
  if (text.trim().length === 0) {
    return { valid: false, error: 'Text cannot be empty' };
  }
  return { valid: true };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { valid: false, error: 'Valid email is required' };
  }
  return { valid: true };
};

export const validateUserId = (userId) => {
  if (!userId || typeof userId !== 'string') {
    return { valid: false, error: 'Valid user ID is required' };
  }
  return { valid: true };
};

// Example data
export const EXAMPLE_TEXTS = [
  {
    text: "I absolutely love this new video game! It's amazing!",
    expectedSentiment: SENTIMENT_TYPES.POSITIVE,
    explanation: "Contains strong positive words like 'love' and 'amazing' with excitement punctuation."
  },
  {
    text: "This homework is so boring and I hate it.",
    expectedSentiment: SENTIMENT_TYPES.NEGATIVE,
    explanation: "Uses negative words 'boring' and 'hate' to express dislike."
  },
  {
    text: "Today is Tuesday and we have math class.",
    expectedSentiment: SENTIMENT_TYPES.NEUTRAL,
    explanation: "States facts without emotional language or opinions."
  },
  {
    text: "I can't wait for summer vacation! Beach time!!!",
    expectedSentiment: SENTIMENT_TYPES.POSITIVE,
    explanation: "Shows excitement with 'can't wait' and multiple exclamation marks."
  },
  {
    text: "I'm feeling sad because my friend moved away.",
    expectedSentiment: SENTIMENT_TYPES.NEGATIVE,
    explanation: "Directly states sadness and explains the emotional cause."
  },
  {
    text: "The weather is okay today, nothing special.",
    expectedSentiment: SENTIMENT_TYPES.NEUTRAL,
    explanation: "Uses neutral descriptor 'okay' and neutral phrase 'nothing special'."
  }
];

// Certificate requirements
export const CERTIFICATE_REQUIREMENTS = {
  MIN_MODULES: 5,
  MIN_AVERAGE_SCORE: 80,
  MIN_GAMES_PLAYED: 2
};

// Point system
export const POINTS = {
  MODULE_COMPLETION: 20,
  GAME_PERCENTAGE_MULTIPLIER: 0.1, // 10% score = 1 point
  QUIZ_PERCENTAGE_MULTIPLIER: 0.2  // 10% score = 2 points
};
