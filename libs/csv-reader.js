const fs = require("fs");
const csv = require("fast-csv");

module.exports = {
  readCSVFile: (filepath) =>
    new Promise((resolve, reject) => {
      let datalist = [];
      // console.log(filepath);
      fs.createReadStream(filepath)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => reject(error))
        .on("data", (row) => datalist.push(row))
        .on("end", (rowCount) => {
          resolve(datalist);
        });
    }),
};
