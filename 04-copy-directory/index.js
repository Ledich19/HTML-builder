const { copyFile, mkdir } = require("fs");
const { readdir, unlink } = require("node:fs/promises");
const path = require("path");

const pathDir = path.join(__dirname, "files");
const pathCopy = path.join(__dirname, "files-copy");

async function copyFiles() {
  mkdir(pathCopy, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const files = await readdir(pathCopy, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(pathCopy, file.name);
    try {
      await unlink(filePath);
      console.log("del");
    } catch (error) {
      console.error("there was an error:", error.message);
    }
  }

  try {
    const files = await readdir(pathDir, { withFileTypes: true });
    for (const file of files) {
      copyFile(
        path.join(pathDir, file.name),
        path.join(pathCopy, file.name),
        (err) => {
          console.log(`${file.name} was copied to files-copy folder`);
          if (err) throw err;
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
}
copyFiles();
