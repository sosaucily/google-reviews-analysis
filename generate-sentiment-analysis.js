import * as fs from "fs";

// Load the reviews
const data = JSON.parse(fs.readFileSync("all-reviews.json", "utf-8"));

const positiveReviews = data.reviews.filter(r => r.rating >= 4);
const negativeReviews = data.reviews.filter(r => r.rating <= 2);

console.log(`Analyzing ${positiveReviews.length} positive reviews...`);
console.log(`Analyzing ${negativeReviews.length} negative reviews...`);

// Define topic categories with keywords
const positiveTopics = {
  "Great Staff & Service": {
    keywords: ["staff", "service", "friendly", "helpful", "bartender", "professional", "nice", "kind", "welcoming"],
    count: 0,
    examples: []
  },
  "Fun Atmosphere": {
    keywords: ["fun", "atmosphere", "great", "amazing", "wonderful", "perfect", "enjoyed", "love", "fantastic"],
    count: 0,
    examples: []
  },
  "Good Song Selection": {
    keywords: ["song", "songs", "music", "selection", "singing", "available", "options", "choice"],
    count: 0,
    examples: []
  },
  "Great for Groups & Parties": {
    keywords: ["party", "bachelor", "birthday", "group", "friends", "celebration", "event", "night out"],
    count: 0,
    examples: []
  },
  "Clean & Well-Maintained": {
    keywords: ["clean", "nice room", "well", "styled", "decorated", "maintained", "modern"],
    count: 0,
    examples: []
  }
};

const negativeTopics = {
  "Poor Service Quality": {
    keywords: ["service", "rude", "unprofessional", "staff", "waiter", "bartender", "poor", "bad service"],
    count: 0,
    examples: []
  },
  "Technical/Equipment Issues": {
    keywords: ["microphone", "sound", "system", "didn't work", "broken", "equipment", "technical", "disconnected"],
    count: 0,
    examples: []
  },
  "Cleanliness Concerns": {
    keywords: ["smell", "mold", "dirty", "clean", "toilet", "basement", "airflow"],
    count: 0,
    examples: []
  },
  "Room Size & Space": {
    keywords: ["small", "crowded", "cramped", "tiny", "space", "packed"],
    count: 0,
    examples: []
  },
  "Time/Booking Issues": {
    keywords: ["time", "late", "booking", "double book", "wait", "minute", "early", "hour"],
    count: 0,
    examples: []
  }
};

// Analyze positive reviews
positiveReviews.forEach(review => {
  if (!review.snippet) return;

  const text = review.snippet.toLowerCase();

  Object.entries(positiveTopics).forEach(([topic, data]) => {
    const matches = data.keywords.some(keyword => text.includes(keyword));
    if (matches) {
      data.count++;
      if (data.examples.length < 3) {
        data.examples.push({
          text: review.snippet,
          rating: review.rating,
          date: review.date,
          user: review.user?.name || 'Anonymous'
        });
      }
    }
  });
});

// Analyze negative reviews
negativeReviews.forEach(review => {
  if (!review.snippet) return;

  const text = review.snippet.toLowerCase();

  Object.entries(negativeTopics).forEach(([topic, data]) => {
    const matches = data.keywords.some(keyword => text.includes(keyword));
    if (matches) {
      data.count++;
      if (data.examples.length < 3) {
        data.examples.push({
          text: review.snippet,
          rating: review.rating,
          date: review.date,
          user: review.user?.name || 'Anonymous'
        });
      }
    }
  });
});

// Sort and get top 5
const topPositive = Object.entries(positiveTopics)
  .map(([topic, data]) => ({
    topic,
    count: data.count,
    percentage: ((data.count / positiveReviews.length) * 100).toFixed(1),
    examples: data.examples
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);

const topNegative = Object.entries(negativeTopics)
  .map(([topic, data]) => ({
    topic,
    count: data.count,
    percentage: ((data.count / negativeReviews.length) * 100).toFixed(1),
    examples: data.examples
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);

const sentimentAnalysis = {
  generated_at: new Date().toISOString(),
  positive_reviews_analyzed: positiveReviews.length,
  negative_reviews_analyzed: negativeReviews.length,
  top_positive_topics: topPositive,
  top_negative_topics: topNegative
};

// Save to file
fs.writeFileSync(
  "sentiment-analysis.json",
  JSON.stringify(sentimentAnalysis, null, 2)
);

console.log("\n✅ Sentiment analysis complete!");
console.log("\nTop Positive Topics:");
topPositive.forEach((item, i) => {
  console.log(`${i + 1}. ${item.topic}: ${item.count} mentions (${item.percentage}%)`);
});

console.log("\nTop Negative Topics:");
topNegative.forEach((item, i) => {
  console.log(`${i + 1}. ${item.topic}: ${item.count} mentions (${item.percentage}%)`);
});

console.log("\n💾 Saved to sentiment-analysis.json");
