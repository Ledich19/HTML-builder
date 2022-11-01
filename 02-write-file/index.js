// const process = require("process");
// const { stdin, stdout } = process;
// const EventEmitter = require("events");
// const fs = require("fs");
// const readline = require("readline");
// const path = require("path");

// const exitEmitter = new EventEmitter();
// const pathText = path.join(__dirname, "text.txt");

// stdout.write("Введите название города\n");
// stdin.on("data", (data) => {
//   const name = data.toString();
//   if (name === "exit") {
//     console.log("exit");
//   }

//   fs.writeFile(pathText, "[]", (error) => {
//     if (error) return console.error(error.message);
//   });

//   fs.readFile('pathText', (error, data) => {
//     const notes = data.toString();
//     console.log('notes', notes);
//   })

//   fs.writeFile(pathText, name, (error) => {
//     if (error) return console.error(error.message);
//     console.log("Текст добавлен");
//   });

//   // fs.readFile('notes.json', (error, data) => {
//   //   if (error) return console.error(error.message);
//   //   const notes = JSON.parse(data);
//   //   notes.push({ title, content });
//   //   const json = JSON.stringify(notes);

//   //   fs.writeFile('text.txt', txt, (error) => {
//   //     if (error) return console.error(error.message);
//   //     console.log('Заметка создана');
//   //   });
//   // });

//   stdout.write(`\nНазвание ${name} добавлено\n`);
// });

// process.on("exit", (code) => {
//   stdout.write(`\nBye:)\n`);
// });
// process.on("SIGINT", () => {
//   process.exit();
// });

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
