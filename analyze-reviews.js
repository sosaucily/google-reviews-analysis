import * as fs from "fs";

// Load the reviews
let data;
try {
  data = JSON.parse(fs.readFileSync("all-reviews.json", "utf-8"));
} catch (error) {
  console.error("Error loading reviews:", error);
  process.exit(1);
}

console.log("=".repeat(80));
console.log(`REVIEW ANALYSIS FOR: ${data.place_info.title}`);
console.log("=".repeat(80));
console.log(`\nAddress: ${data.place_info.address}`);
console.log(`Type: ${data.place_info.type}`);
console.log(`Overall Rating: ${data.place_info.rating}/5`);
console.log(`Total Reviews Analyzed: ${data.total_reviews}`);
console.log(`Downloaded: ${new Date(data.downloaded_at).toLocaleString()}`);

// Rating Distribution
console.log("\n" + "=".repeat(80));
console.log("RATING DISTRIBUTION");
console.log("=".repeat(80));

const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

data.reviews.forEach(review => {
  ratingCounts[review.rating]++;
});

for (let i = 5; i >= 1; i--) {
  const count = ratingCounts[i];
  const percentage = ((count / data.total_reviews) * 100).toFixed(1);
  const bar = "█".repeat(Math.round((count / data.total_reviews) * 50));
  console.log(`${i} star: ${count.toString().padStart(4)} (${percentage.padStart(5)}%) ${bar}`);
}

// Average ratings by category
console.log("\n" + "=".repeat(80));
console.log("AVERAGE RATINGS BY CATEGORY");
console.log("=".repeat(80));

const categories = ["service", "atmosphere", "food"];
const categoryStats = {};

data.reviews.forEach(review => {
  if (review.details) {
    categories.forEach(cat => {
      if (review.details[cat]) {
        if (!categoryStats[cat]) {
          categoryStats[cat] = { sum: 0, count: 0 };
        }
        categoryStats[cat].sum += review.details[cat];
        categoryStats[cat].count++;
      }
    });
  }
});

categories.forEach(cat => {
  if (categoryStats[cat]) {
    const avg = (categoryStats[cat].sum / categoryStats[cat].count).toFixed(2);
    const reviewCount = categoryStats[cat].count;
    console.log(`${cat.padEnd(12)}: ${avg}/5  (${reviewCount} reviews)`);
  }
});

// Top Topics
console.log("\n" + "=".repeat(80));
console.log("TOP MENTIONED TOPICS");
console.log("=".repeat(80));

data.topics.slice(0, 15).forEach((topic, index) => {
  const bar = "█".repeat(Math.round((topic.mentions / data.topics[0].mentions) * 40));
  console.log(`${(index + 1).toString().padStart(2)}. ${topic.keyword.padEnd(15)} (${topic.mentions.toString().padStart(3)} mentions) ${bar}`);
});

// Recent Reviews (last 10)
console.log("\n" + "=".repeat(80));
console.log("RECENT REVIEWS (Last 10)");
console.log("=".repeat(80));

data.reviews.slice(0, 10).forEach((review, index) => {
  const stars = "⭐".repeat(review.rating);
  console.log(`\n${index + 1}. ${stars} - ${review.user.name} (${review.date})`);
  console.log(`   ${review.snippet.substring(0, 150)}${review.snippet.length > 150 ? "..." : ""}`);
});

// Low Ratings (1-2 stars)
console.log("\n" + "=".repeat(80));
console.log("LOW RATING REVIEWS (1-2 Stars)");
console.log("=".repeat(80));

const lowRatings = data.reviews.filter(r => r.rating <= 2);
console.log(`Total low ratings: ${lowRatings.length} (${((lowRatings.length / data.total_reviews) * 100).toFixed(1)}%)\n`);

lowRatings.slice(0, 10).forEach((review, index) => {
  const stars = "⭐".repeat(review.rating);
  console.log(`${index + 1}. ${stars} - ${review.user.name} (${review.date})`);
  console.log(`   ${review.snippet.substring(0, 150)}${review.snippet.length > 150 ? "..." : ""}`);
  console.log();
});

// Reviews over time (by month)
console.log("\n" + "=".repeat(80));
console.log("REVIEWS BY TIME PERIOD");
console.log("=".repeat(80));

const timePeriods = {};

data.reviews.forEach(review => {
  if (review.iso_date) {
    const date = new Date(review.iso_date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    timePeriods[monthYear] = (timePeriods[monthYear] || 0) + 1;
  }
});

const sortedPeriods = Object.entries(timePeriods)
  .sort((a, b) => b[0].localeCompare(a[0]))
  .slice(0, 12);

const maxCount = Math.max(...sortedPeriods.map(p => p[1]));
sortedPeriods.forEach(([period, count]) => {
  const bar = "█".repeat(Math.round((count / maxCount) * 40));
  console.log(`${period}: ${count.toString().padStart(3)} reviews ${bar}`);
});

console.log("\n" + "=".repeat(80));
console.log("Analysis complete!");
console.log("=".repeat(80));
