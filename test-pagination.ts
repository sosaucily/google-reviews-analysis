import { getJson } from "serpapi";
import * as fs from "fs";

// Test pagination - get page 2
const nextPageToken = "CAESY0NBRVFDQnBFUTJwRlNVRlNTWEJEWjI5QlVEZGZURVZQVWpGZlgxOWZSV2hETm1kNWQzZEZWMHgwVm5wMmFteGpNRUZCUVVGQlIyZHVPVEkwVFVOaExVUnJjVk00V1VGRFNVRQ==";

getJson({
  api_key: "93128d1e92faa169afafba8ecd94fae27aa4022f2729d41a7533ed6f03117ec8",
  engine: "google_maps_reviews",
  hl: "en",
  data_id: "0x4741ddb851697753:0xbe278ecf3fa52437",
  next_page_token: nextPageToken
}, (json) => {
  console.log("Reviews fetched on page 2:", json.reviews?.length || 0);
  console.log("\nHas next page:", !!json.serpapi_pagination?.next);

  // Save to JSON file
  fs.writeFileSync("reviews-page2.json", JSON.stringify(json, null, 2));
  console.log("\nSaved to reviews-page2.json");
});
