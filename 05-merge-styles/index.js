const { createReadStream, writeFile } = require("fs");
const { readdir } = require("fs/promises");
const path = require("path");

const pathDir = path.join(__dirname, "styles");

async function logFiles(params) {
  try {
    const files = await readdir(pathDir, { withFileTypes: true });
    const arr = [];
    for (const file of files) {
      if (path.extname(file.name) === ".css") {
        const stream = createReadStream(path.join(pathDir, file.name), "utf-8");
        let data = "";
        stream
          .on("data", (chunk) => (data += chunk))
          .on("end", () => {
            arr.push(data);
            writeFile(
              path.join(__dirname, "project-dist", "bundle.css"),
              arr.join("\n"),
              (error) => {
                if (error) return console.error(error.message);
              }
            );
          })
          .on("error", (error) => console.log("Error", error.message));
      }
    }
  } catch (err) {
    console.error(err);
  }
}
logFiles();
