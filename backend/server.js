const express = require("express");
const app = express();
const port = 3000;
const Datastore = require("nedb");

var staticResponseOptions = {
  setHeaders: function (res, path, stat) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  },
};

app.use(express.static(".\\database", staticResponseOptions)); // для отдачи статического контента

let db = new Datastore({ filename: "routes" });
db.loadDatabase();

function Parse(str) {
  trackReportPairs = str.split(",");
  let routes = {};
  for (var TRPair of trackReportPairs) {
    let [track, report] = TRPair.split(" ");
    routes[track] = report;
  }
  return JSON.stringify(routes); // fix: походы с одинаковыми треками перекрывают друг друга. Остается только последний отчет
}

app.get("/getAllRoutes", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  db.find({}, function (err, docs) {
    let routesJSON = docs.map(function (route) {
      let trackFN = route.trackFileName;
      let reportFN = route.reportFileName;
      let routeJSON = {};
      routeJSON[trackFN] = reportFN;
      return routeJSON;
    });
    res.send(routesJSON);
  });
});

app.get("/\\dcategory", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  let category = req.originalUrl[1];
  db.find({ difficulty: Number(category) }, function (err, routes) {
    let tracksNames = routes.map((route) => route.trackFileName);
    res.send(tracksNames);
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
