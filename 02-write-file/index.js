const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { stdin: input, stdout: output } = require("process");

const pathText = path.join(__dirname, "text.txt");
const rl = readline.createInterface({ input, output });

function writeFileFoo(path, answer) {
  fs.writeFile(path, answer, (error) => {
    if (error) return console.error(error.message);
  });
}

writeFileFoo(pathText, "");
rl.question("\u001B[33m Write new task \n\u001B[0m", (answer) => {
  if (answer === "exit") {
    rl.close();
  }
  writeFileFoo(pathText, answer);
  rl.on("line", (input) => {
    if (input === "exit") {
      rl.close();
    }
  });
  rl.on("history", (history) => {
    const data = [...history].reverse().join("\n");
    writeFileFoo(pathText, data);
  });
});

rl.on("close", (code) => {
  console.log(`\u001B[33m \nBye:) have a good day\n \u001B[0m`);
});
process.on("SIGINT", () => {
  rl.close();
});
