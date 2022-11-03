const { copyFile, constants, mkdir, rmdir, stat, unlink } = require("fs");
const { readdir } = require("fs/promises");
const path = require("path");

const pathDir = path.join(__dirname, "files");
const pathCopy = path.join(__dirname, "files-copy");

function clearFolder() {
  stat(pathCopy, async function (err) {
    if (!err) {
      const files = await readdir(pathCopy, { withFileTypes: true });
      for (const file of files) {
        const filePath = path.join(pathCopy, file.name);
        unlink(filePath, (err) => {
          if (err) throw err;
        });
      }
    } else if (err.code === "ENOENT") {
      mkdir(pathCopy, (err) => {
        if (err) throw err;
      });
    } else {
      console.error(err);
    }
  });
}

async function copyFiles() {
  clearFolder();
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
