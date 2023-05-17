const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

// TODO: app.static(); // для отдачи статического контента

let JSONData;
let r = new Promise(function (resolve, reject) {
  fs.readFile(".\\backend\\table.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    }
    JSONData = Parse(data);
  });
  resolve(JSONData);
});
r.then(
  (result) => {
    JSONData = result;
  },
  (error) => {
    console.log(error);
  }
);

function Parse(str) {
  trackReportPairs = str.split(",");
  let route = {};
  for (var TRPair of trackReportPairs) {
    let [trek, report] = TRPair.split(" ");
    route[trek] = report;
  }
  return JSON.stringify(route);
}

app.get("/getAllRoutes", (req, res) => {
  res.send(JSONData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
