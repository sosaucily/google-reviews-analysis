import * as fs from "fs";

try {
  console.log("Loading file...");
  const content = fs.readFileSync("all-reviews.json", "utf-8");
  console.log("File loaded, parsing JSON...");
  const data = JSON.parse(content);
  console.log("Success!");
  console.log("Place:", data.place_info?.title);
  console.log("Reviews:", data.reviews?.length);
} catch (error: any) {
  console.error("Error:", error.message);
  console.error("Stack:", error.stack);
}
