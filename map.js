const rootURL = "http://localhost:3000/";

const map = L.map("map").setView([56.840449, 60.657217], 9);
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

getRoutesObject().then((routesObject) => addTracks(routesObject));

//получение названий треков и отчетов в виде объекта вида {"tr.gpx":"tr.pdf"}
async function getRoutesObject() {
  return fetch(rootURL + "getAllRoutes", {
    method: "GET",
  }).then((response) => response.json()); // no error catching function in "then"
}

map.on("resize");

async function addTracks(routesObject) {
  console.log(routesObject);
  for (let gpx in routesObject) {
    console.log(rootURL + gpx);
    let track = new L.GPX(rootURL + gpx, { async: true })
      .on("loaded", function (e) {})
      .addTo(map);
    let trackName = gpx.slice(0, -4); //TODO: fix incorrect naming
    let reportPath = rootURL + routesObject[gpx];
    let popUp = L.popup().setContent(
      `<p>${trackName}</p>
  <p> <a href = ${reportPath}>Скачать отчёт</a> </p>`
    );
    track.bindPopup(popUp);
  }
}
