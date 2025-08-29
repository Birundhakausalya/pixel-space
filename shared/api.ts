/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Sentiment Analysis API Types
 */
export interface SentimentAnalysisRequest {
  text: string;
  approach?: 'keyword' | 'advanced';
}

export interface SentimentAnalysisResponse {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  approach: 'keyword' | 'advanced';
  keywords: string[];
  explanation: string;
  details: {
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

export interface ExampleText {
  text: string;
  expectedSentiment: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

export interface ExamplesResponse {
  examples: ExampleText[];
}
