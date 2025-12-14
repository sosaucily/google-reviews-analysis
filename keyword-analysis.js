import * as fs from "fs";

// Load the reviews
const data = JSON.parse(fs.readFileSync("all-reviews.json", "utf-8"));

console.log("=".repeat(80));
console.log(`KEYWORD ANALYSIS FOR: ${data.place_info.title}`);
console.log("=".repeat(80));

// Find common words in reviews
function countKeywords(reviews, minLength = 4) {
  const wordCount = {};
  const stopWords = new Set([
    'that', 'with', 'this', 'from', 'were', 'have', 'been', 'they', 'very',
    'there', 'their', 'about', 'would', 'which', 'also', 'when', 'room',
    'rooms', 'karaoke', 'vibe', 'budapest', 'place', 'here'
  ]);

  reviews.forEach(review => {
    const words = review.snippet
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= minLength && !stopWords.has(word));

    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
  });

  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);
}

// Analyze positive reviews (5 stars)
console.log("\n" + "=".repeat(80));
console.log("COMMON WORDS IN 5-STAR REVIEWS");
console.log("=".repeat(80));

const fiveStarReviews = data.reviews.filter(r => r.rating === 5);
const fiveStarKeywords = countKeywords(fiveStarReviews);

fiveStarKeywords.slice(0, 20).forEach(([word, count], index) => {
  const bar = "█".repeat(Math.round((count / fiveStarKeywords[0][1]) * 40));
  console.log(`${(index + 1).toString().padStart(2)}. ${word.padEnd(15)} (${count.toString().padStart(3)}) ${bar}`);
});

// Analyze negative reviews (1-2 stars)
console.log("\n" + "=".repeat(80));
console.log("COMMON WORDS IN 1-2 STAR REVIEWS");
console.log("=".repeat(80));

const lowStarReviews = data.reviews.filter(r => r.rating <= 2);
const lowStarKeywords = countKeywords(lowStarReviews);

lowStarKeywords.slice(0, 20).forEach(([word, count], index) => {
  const bar = "█".repeat(Math.round((count / Math.max(lowStarKeywords[0][1], 1)) * 40));
  console.log(`${(index + 1).toString().padStart(2)}. ${word.padEnd(15)} (${count.toString().padStart(3)}) ${bar}`);
});

// Find mentions of specific topics
console.log("\n" + "=".repeat(80));
console.log("SPECIFIC TOPIC ANALYSIS");
console.log("=".repeat(80));

const topics = {
  "Staff/Service": ["staff", "service", "bartender", "waiter", "friendly", "helpful", "professional"],
  "Music/Songs": ["song", "songs", "music", "selection", "singing", "sing"],
  "Equipment": ["microphone", "sound", "system", "tablet", "equipment", "screen"],
  "Atmosphere": ["atmosphere", "fun", "great", "amazing", "wonderful", "perfect"],
  "Cleanliness": ["clean", "dirty", "smell", "mold", "toilet"],
  "Price": ["price", "expensive", "cheap", "worth", "value"],
  "Space": ["small", "crowded", "spacious", "room", "space"]
};

Object.entries(topics).forEach(([topic, keywords]) => {
  const mentions = data.reviews.filter(review => {
    const text = review.snippet.toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  });

  const avgRating = mentions.length > 0
    ? (mentions.reduce((sum, r) => sum + r.rating, 0) / mentions.length).toFixed(2)
    : 0;

  const positive = mentions.filter(r => r.rating >= 4).length;
  const negative = mentions.filter(r => r.rating <= 2).length;

  console.log(`\n${topic}:`);
  console.log(`  Total mentions: ${mentions.length}`);
  console.log(`  Average rating: ${avgRating}/5`);
  console.log(`  Positive: ${positive} | Negative: ${negative}`);
});

// Find reviews mentioning specific issues
console.log("\n" + "=".repeat(80));
console.log("ISSUE TRACKER");
console.log("=".repeat(80));

const issues = {
  "Sound/Microphone Issues": ["microphone", "sound", "didn't work", "broken", "bad sound"],
  "Timing/Booking Issues": ["late", "time", "booking", "double book", "wait"],
  "Cleanliness Issues": ["dirty", "smell", "mold", "clean"],
  "Service Issues": ["rude", "unprofessional", "poor service", "bad service"],
  "Space Issues": ["small", "crowded", "cramped"],
  "Price Issues": ["expensive", "overpriced", "scam"]
};

Object.entries(issues).forEach(([issue, keywords]) => {
  const mentions = data.reviews.filter(review => {
    const text = review.snippet.toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  });

  if (mentions.length > 0) {
    console.log(`\n${issue}: ${mentions.length} mentions`);
    mentions.slice(0, 3).forEach(review => {
      console.log(`  ⭐${review.rating} - ${review.snippet.substring(0, 120)}...`);
    });
  }
});

// Best reviews (highest rated with most detail)
console.log("\n" + "=".repeat(80));
console.log("MOST HELPFUL POSITIVE REVIEWS");
console.log("=".repeat(80));

const detailedPositiveReviews = fiveStarReviews
  .filter(r => r.snippet.length > 100)
  .sort((a, b) => b.snippet.length - a.snippet.length)
  .slice(0, 5);

detailedPositiveReviews.forEach((review, index) => {
  console.log(`\n${index + 1}. ${review.user.name} (${review.date})`);
  console.log(`   ${review.snippet}`);
});

console.log("\n" + "=".repeat(80));
console.log("Analysis complete!");
console.log("=".repeat(80));
