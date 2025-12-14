import { getJson } from "serpapi";
import * as fs from "fs";

// Test with first 10 reviews
getJson({
  api_key: "93128d1e92faa169afafba8ecd94fae27aa4022f2729d41a7533ed6f03117ec8",
  engine: "google_maps_reviews",
  hl: "en",
  data_id: "0x4741ddb851697753:0xbe278ecf3fa52437"
}, (json) => {
  console.log("Reviews fetched:", json.reviews?.length || 0);
  console.log("\nFull response structure:");
  console.log(JSON.stringify(json, null, 2));

  // Save to JSON file
  fs.writeFileSync("reviews-page1.json", JSON.stringify(json, null, 2));
  console.log("\nSaved to reviews-page1.json");
});
