const fs = require("fs");
const path = require("path");

const pathText = path.join(__dirname, "text.txt");
const stream = fs.createReadStream(pathText, "utf-8");
let data = "";

stream
  .on("data", (chunk) => (data += chunk))
  .on("end", () => console.log(data))
  .on("error", (error) => console.log("Error", error.message));
