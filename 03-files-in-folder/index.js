const fs = require("fs");
const { readdir } = require("fs/promises");
const path = require("path");
const pathDir = path.join(__dirname, "secret-folder");

async function logFiles(params) {
  try {
    const files = await readdir(pathDir, { withFileTypes: true });
    for (const file of files) {
      fs.stat(path.join(pathDir, file.name), (err, stats) => {
        if (!file.isDirectory()) {
          const { name, ext } = path.parse(file.name);
          console.log(
            `\u001B[33m${name} - ${ext.slice(1)} - \u001B[34m${
              stats.size * 0.000977
            } \u001B[32mkb\u001B[0m`
          );
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}
logFiles();
