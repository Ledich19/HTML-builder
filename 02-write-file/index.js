const readline = require("readline");
const path = require("path");

const pathText = path.join(__dirname, "text.txt");
const { stdin: input, stdout: output } = require("process");
const fs = require("fs");
const rl = readline.createInterface({ input, output });

rl.question("\u001B[34m Write new task \n\u001B[0m", (answer) => {
  if (answer === "exit") {
    rl.close();
  }

  fs.writeFile(pathText, answer, (error) => {
    if (error) return console.error(error.message);
  });

  rl.on("line", (input) => {
    if (input === "exit") {
      rl.close();
    }
  });

  rl.on("history", (history) => {
    const data = [...history].reverse().join("\n");
    fs.writeFile(pathText, data, (error) => {
      if (error) return console.error(error.message);
    });
  });
});

rl.on("close", (code) => {
  console.log(`\u001B[34m \nBye:)\n \u001B[0m`);
});
process.on("SIGINT", () => {
  rl.close();
});
