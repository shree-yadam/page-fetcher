const request = require("request");
const process = require("process");
const fs = require("fs");
const readline = require('readline');

const fetcher = function() {
  const url = process.argv[2];
  const localFilePath = process.argv[3];
  request(url, (error, response, body) => {
    if (error) {
      if (error.code === "ENOTFOUND") {
        console.log("URL is invalid");
        process.exit;
      }
    } else {
      fs.writeFile(localFilePath, body, { flag: 'wx+' }, err => {
        if (err) {
          if (err.code === 'EEXIST') {
            const rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout
            });
            rl.question("File Already Exists. Type Y and press enter to overwrite the file or N to skip and exit the app: ", (answer) => {
              if (answer.toLowerCase() === "y") {
                fs.writeFile(localFilePath, body, err => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(`Downloaded and saved ${body.length} bytes to ${localFilePath}.`);
                  }
                });
                rl.close();
              } else {
                rl.close();
                console.log("closing");
                process.exit;
              }
            });
          } if (err.code === 'ENOENT') {
            console.log("File Path Invalid");
          }
          process.exit;
        } else {
          console.log(`Downloaded and saved ${body.length} bytes to ${localFilePath}.`);
        }
      });
    }
  });
};

fetcher();