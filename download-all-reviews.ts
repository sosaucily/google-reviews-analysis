import { getJson } from "serpapi";
import * as fs from "fs";

interface Review {
  rating: number;
  date: string;
  iso_date: string;
  user: {
    name: string;
    [key: string]: any;
  };
  snippet: string;
  [key: string]: any;
}

interface SerpApiResponse {
  reviews?: Review[];
  serpapi_pagination?: {
    next?: string;
    next_page_token?: string;
  };
  place_info?: any;
  topics?: any[];
  [key: string]: any;
}

const API_KEY = "93128d1e92faa169afafba8ecd94fae27aa4022f2729d41a7533ed6f03117ec8";
const DATA_ID = "0x4741ddb851697753:0xbe278ecf3fa52437";

let allReviews: Review[] = [];
let placeInfo: any = null;
let topics: any[] = [];
let pageCount = 0;
let nextPageToken: string | undefined = undefined;

async function fetchPage(pageToken?: string): Promise<SerpApiResponse> {
  return new Promise((resolve, reject) => {
    const params: any = {
      api_key: API_KEY,
      engine: "google_maps_reviews",
      hl: "en",
      data_id: DATA_ID
    };

    if (pageToken) {
      params.next_page_token = pageToken;
    }

    getJson(params, (json) => {
      if (json.error) {
        reject(new Error(json.error));
      } else {
        resolve(json as SerpApiResponse);
      }
    });
  });
}

async function downloadAllReviews() {
  console.log("Starting to download all reviews...\n");

  try {
    // Fetch first page
    let response = await fetchPage();
    pageCount++;

    // Store place info and topics from first page
    placeInfo = response.place_info;
    topics = response.topics || [];

    if (response.reviews) {
      allReviews.push(...response.reviews);
      console.log(`Page ${pageCount}: Fetched ${response.reviews.length} reviews (Total: ${allReviews.length})`);
    }

    // Continue fetching while there are more pages
    while (response.serpapi_pagination?.next_page_token) {
      nextPageToken = response.serpapi_pagination.next_page_token;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

      response = await fetchPage(nextPageToken);
      pageCount++;

      if (response.reviews) {
        allReviews.push(...response.reviews);
        console.log(`Page ${pageCount}: Fetched ${response.reviews.length} reviews (Total: ${allReviews.length})`);
      }
    }

    console.log(`\n✓ Download complete!`);
    console.log(`Total pages: ${pageCount}`);
    console.log(`Total reviews: ${allReviews.length}`);

    // Save to JSON file
    const output = {
      place_info: placeInfo,
      topics: topics,
      total_reviews: allReviews.length,
      reviews: allReviews,
      downloaded_at: new Date().toISOString()
    };

    fs.writeFileSync("all-reviews.json", JSON.stringify(output, null, 2));
    console.log("\n✓ Saved all reviews to all-reviews.json");

  } catch (error) {
    console.error("Error downloading reviews:", error);

    // Save what we have so far
    if (allReviews.length > 0) {
      const output = {
        place_info: placeInfo,
        topics: topics,
        total_reviews: allReviews.length,
        reviews: allReviews,
        downloaded_at: new Date().toISOString(),
        error: "Download interrupted",
        last_page_token: nextPageToken
      };
      fs.writeFileSync("all-reviews-partial.json", JSON.stringify(output, null, 2));
      console.log(`\nSaved ${allReviews.length} reviews to all-reviews-partial.json`);
    }
  }
}

downloadAllReviews();
