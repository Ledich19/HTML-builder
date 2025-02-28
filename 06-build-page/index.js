const { createReadStream, mkdir, copyFile, constants } = require("fs");
const { readdir, readFile, writeFile,unlink } = require("fs/promises");
const path = require("path");
const pathTemplate = path.join(__dirname, "template.html");
const pathDistBundleDir = path.join(__dirname, "project-dist");
const pathDistHTML = path.join(__dirname, "project-dist", "index.html");
const pathComponents = path.join(__dirname, "components");
const pathStileFrom = path.join(__dirname, "styles");


function copyFiles(pathFrom, pathTo) {

  mkdir(pathTo, { recursive: true }, async (err) => {
    if (err) throw err;

    const files = await readdir(pathTo, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(pathTo, file.name);
      try {
        await unlink(filePath);
      } catch (error) {
        console.error("there was an error:", error.message);
      }
    }

    try {
      const files = await readdir(pathFrom, { withFileTypes: true });
      for (const file of files) {
        if (file.isDirectory()) {
          copyFiles(
            path.join(pathFrom, file.name),
            path.join(pathTo, file.name)
          );
        } else {
          copyFile(
            path.join(pathFrom, file.name),
            path.join(pathTo, file.name),
            constants.COPYFILE_FICLONE,
            (err) => {
              if (err) throw err;
            }
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  });
}

async function margeCss(params) {
  try {
    const files = await readdir(pathStileFrom, { withFileTypes: true });
    const arr = [];
    for (const file of files) {
      if (path.extname(file.name) === ".css") {
        const stream = createReadStream(
          path.join(pathStileFrom, file.name),
          "utf-8"
        );
        let data = "";
        stream
          .on("data", (chunk) => (data += chunk))
          .on("end", () => {
            arr.push(data);
            writeFile(
              path.join(pathDistBundleDir, "style.css"),
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

async function margeHtml(html) {
  let fileHtml = html;
  //const regexp = /{{([\s\S]+?)}}/g;
  try {
    const files = await readdir(pathComponents, { withFileTypes: true });
    for (const file of files) {
      if (path.extname(file.name) === ".html") {
        try {
          const contents = await readFile(
            path.join(pathComponents, file.name),
            { encoding: "utf8" }
          );
          const tag = file.name.replace(path.extname(file.name), "");
          fileHtml = fileHtml.replace(`{{${tag}}}`, contents);
          try {
            const promise = writeFile(pathDistHTML, fileHtml);
            await promise;
          } catch (err) {
            console.error(err);
          }
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function builtHTML() {
  let indexHTML = "";
  const stream = createReadStream(pathTemplate, "utf-8");
  stream
    .on("data", (chunk) => (indexHTML += chunk))
    .on("end", () => {
      margeHtml(indexHTML);
    })
    .on("error", (error) => console.log("Error", error.message));
}

builtHTML();
copyFiles(
  path.join(__dirname, "assets"),
  path.join(pathDistBundleDir, "assets")
);
margeCss();
