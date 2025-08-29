// Simple keyword-based sentiment analysis
const keywordAnalysis = (text) => {
  const lowerText = text.toLowerCase();
  
  const positiveWords = [
    'love', 'amazing', 'awesome', 'great', 'happy', 'excited', 'wonderful', 
    'fantastic', 'best', 'fun', 'good', 'excellent', 'perfect', 'beautiful', 
    'brilliant', 'incredible', 'outstanding', 'superb', 'delightful', 'joy',
    'smile', 'laugh', 'celebrate', 'win', 'success', 'proud', 'thankful'
  ];
  
  const negativeWords = [
    'hate', 'terrible', 'awful', 'bad', 'sad', 'angry', 'boring', 'worst', 
    'horrible', 'disgusting', 'ugly', 'stupid', 'died', 'crying', 'upset',
    'disappointed', 'frustrated', 'annoyed', 'worried', 'scared', 'hurt',
    'broken', 'fail', 'lost', 'wrong', 'difficult', 'problem'
  ];
  
  const neutralWords = [
    'okay', 'regular', 'normal', 'fine', 'alright', 'average', 'typical',
    'usual', 'ordinary', 'standard', 'common', 'general', 'basic'
  ];
  
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  const foundKeywords = [];
  
  // Count positive words
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      positiveCount += matches.length;
      foundKeywords.push(word);
    }
  });
  
  // Count negative words
  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      negativeCount += matches.length;
      foundKeywords.push(word);
    }
  });
  
  // Count neutral words
  neutralWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      neutralCount += matches.length;
      foundKeywords.push(word);
    }
  });
  
  // Check for punctuation indicators
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  const capsCount = (text.match(/[A-Z]{2,}/g) || []).length;
  
  // Boost positive score for excitement indicators
  if (exclamationCount > 0) {
    positiveCount += exclamationCount * 0.5;
    foundKeywords.push(`${exclamationCount} exclamation mark${exclamationCount > 1 ? 's' : ''}`);
  }
  
  if (capsCount > 0) {
    positiveCount += capsCount * 0.3;
    foundKeywords.push(`${capsCount} words in CAPS`);
  }
  
  return {
    positiveCount,
    negativeCount,
    neutralCount,
    foundKeywords: [...new Set(foundKeywords)], // Remove duplicates
    exclamationCount,
    questionCount,
    capsCount
  };
};

// Advanced pattern-based analysis (simulating ML approach)
const advancedAnalysis = (text, keywordData) => {
  const { positiveCount, negativeCount, neutralCount } = keywordData;
  
  // Simulate more complex analysis
  let sentimentScore = positiveCount - negativeCount;
  let confidence = 50;
  
  // Adjust based on text length
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 10) {
    confidence += 10; // More confident with longer text
  }
  
  // Check for negation words that might flip sentiment
  const negationWords = ['not', 'no', 'never', 'don\'t', 'doesn\'t', 'can\'t', 'won\'t'];
  const hasNegation = negationWords.some(word => text.toLowerCase().includes(word));
  
  if (hasNegation) {
    sentimentScore *= -0.5; // Reduce or flip sentiment
    confidence -= 15;
  }
  
  // Check for intensifiers
  const intensifiers = ['very', 'really', 'extremely', 'absolutely', 'totally', 'completely'];
  const hasIntensifier = intensifiers.some(word => text.toLowerCase().includes(word));
  
  if (hasIntensifier) {
    sentimentScore *= 1.3;
    confidence += 10;
  }
  
  // Determine final sentiment
  let sentiment;
  
  if (sentimentScore > 0.5) {
    sentiment = 'positive';
    confidence = Math.min(95, confidence + (sentimentScore * 10));
  } else if (sentimentScore < -0.5) {
    sentiment = 'negative';
    confidence = Math.min(95, confidence + (Math.abs(sentimentScore) * 10));
  } else {
    sentiment = 'neutral';
    confidence = neutralCount > 0 ? Math.min(85, confidence + 20) : Math.max(40, confidence);
  }
  
  return { sentiment, confidence: Math.round(confidence) };
};

export const handleSentimentAnalysis = (req, res) => {
  try {
    const { text, approach = 'keyword' } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        error: 'Text is required and must be a string' 
      });
    }
    
    if (text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Text cannot be empty' 
      });
    }
    
    // Perform keyword analysis first
    const keywordData = keywordAnalysis(text);
    
    let result;
    
    if (approach === 'advanced') {
      // Use advanced analysis
      const advanced = advancedAnalysis(text, keywordData);
      
      result = {
        sentiment: advanced.sentiment,
        confidence: advanced.confidence,
        approach: 'advanced',
        keywords: keywordData.foundKeywords,
        explanation: `Advanced AI analysis detected ${advanced.sentiment} sentiment with ${advanced.confidence}% confidence. The algorithm considered word patterns, context, and linguistic features.`,
        details: {
          positiveWords: keywordData.positiveCount,
          negativeWords: keywordData.negativeCount,
          neutralWords: keywordData.neutralCount,
          totalWords: text.split(/\s+/).length,
          features: {
            exclamationMarks: keywordData.exclamationCount,
            questionMarks: keywordData.questionCount,
            capsWords: keywordData.capsCount
          }
        }
      };
    } else {
      // Use simple keyword analysis
      let sentiment;
      let confidence;
      let explanation;
      
      if (keywordData.positiveCount > keywordData.negativeCount && keywordData.positiveCount > 0) {
        sentiment = 'positive';
        confidence = Math.min(90, 60 + (keywordData.positiveCount * 10));
        explanation = `Found ${keywordData.positiveCount} positive keyword${keywordData.positiveCount !== 1 ? 's' : ''} indicating happy or excited feelings!`;
      } else if (keywordData.negativeCount > keywordData.positiveCount && keywordData.negativeCount > 0) {
        sentiment = 'negative';
        confidence = Math.min(90, 60 + (keywordData.negativeCount * 10));
        explanation = `Detected ${keywordData.negativeCount} negative keyword${keywordData.negativeCount !== 1 ? 's' : ''} showing sad or upset feelings.`;
      } else {
        sentiment = 'neutral';
        confidence = keywordData.neutralCount > 0 ? 75 : 50;
        explanation = keywordData.neutralCount > 0 
          ? `Found neutral language suggesting calm, balanced feelings.`
          : `No strong emotional keywords detected, appears to be neutral.`;
      }
      
      result = {
        sentiment,
        confidence,
        approach: 'keyword',
        keywords: keywordData.foundKeywords,
        explanation,
        details: {
          positiveWords: keywordData.positiveCount,
          negativeWords: keywordData.negativeCount,
          neutralWords: keywordData.neutralCount,
          totalWords: text.split(/\s+/).length,
          features: {
            exclamationMarks: keywordData.exclamationCount,
            questionMarks: keywordData.questionCount,
            capsWords: keywordData.capsCount
          }
        }
      };
    }
    
    res.json(result);
    
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ 
      error: 'Internal server error during sentiment analysis' 
    });
  }
};

// Endpoint to get example texts for testing
export const handleGetExamples = (req, res) => {
  const examples = [
    {
      text: "I absolutely love this new video game! It's amazing!",
      expectedSentiment: "positive",
      explanation: "Contains strong positive words like 'love' and 'amazing' with excitement punctuation."
    },
    {
      text: "This homework is so boring and I hate it.",
      expectedSentiment: "negative", 
      explanation: "Uses negative words 'boring' and 'hate' to express dislike."
    },
    {
      text: "Today is Tuesday and we have math class.",
      expectedSentiment: "neutral",
      explanation: "States facts without emotional language or opinions."
    },
    {
      text: "I can't wait for summer vacation! Beach time!!!",
      expectedSentiment: "positive",
      explanation: "Shows excitement with 'can't wait' and multiple exclamation marks."
    },
    {
      text: "I'm feeling sad because my friend moved away.",
      expectedSentiment: "negative",
      explanation: "Directly states sadness and explains the emotional cause."
    },
    {
      text: "The weather is okay today, nothing special.",
      expectedSentiment: "neutral",
      explanation: "Uses neutral descriptor 'okay' and neutral phrase 'nothing special'."
    }
  ];
  
  res.json({ examples });
};
