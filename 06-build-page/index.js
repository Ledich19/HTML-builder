const {
  createReadStream,
  writeFile,
  mkdir,
  copyFile,
  constants,
  rmdir,
  unlink
} = require("fs");
const { readdir } = require("fs/promises");
const path = require("path");

const pathTemplate = path.join(__dirname, "template.html");
const pathDistBundleDir = path.join(__dirname, "project-dist");
const pathDistHTML = path.join(__dirname, "project-dist", "index.html");
const pathComponents = path.join(__dirname, "components");
const pathStileFrom = path.join(__dirname, "styles");


function copyFiles(from, to) {

  mkdir(to, { recursive: true }, async (err) => {
    if (err) throw err;
    try {
      const files = await readdir(from, { withFileTypes: true });
      for (const file of files) {
        if (file.isDirectory()) {
          copyFiles(path.join(from, file.name), path.join(to, file.name));
        } else {
          copyFile(
            path.join(from, file.name),
            path.join(to, file.name),
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
        const stream = createReadStream(path.join(pathStileFrom, file.name), "utf-8");
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

async function findTagsAnd(html) {
  let fileHtml = html;
  const regexp = /{{([\s\S]+?)}}/g;
  const tags = html.match(regexp).map((s) => s.slice(2, s.length - 2));
  try {
    const files = await readdir(pathComponents, { withFileTypes: true });
    for (const file of files) {
      tags.forEach((t) => {
        if (file.name === t + ".html") {
          let indexHTML = "";
          const stream = createReadStream(
            path.join(pathComponents, file.name),
            "utf-8"
          );
          stream
            .on("data", (chunk) => (indexHTML += chunk))
            .on("end", () => {
              fileHtml = fileHtml.replace(`{{${t}}}`, indexHTML);
              writeFile(pathDistHTML, fileHtml, (error) => {
                if (error) return console.error(error.message);
              });
            })
            .on("error", (error) => console.log("Error", error.message));
        }
      });
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
    
    
    findTagsAnd(indexHTML);
  })
  .on("error", (error) => console.log("Error", error.message));
}
builtHTML();
copyFiles(
  path.join(__dirname, "assets"),
  path.join(pathDistBundleDir, "assets")
);
margeCss()
