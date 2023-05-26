const rootURL = "http://localhost:3000/";
//map.on("zoomend", () => alert("resized"));
//получение названий треков и отчетов в виде объекта вида {"tr.gpx":"tr.pdf"}
main();
async function main() {
  map = await setMap();
  getRoutesObject().then((routesObject) => addTracks(routesObject, map));
}

async function setMap() {
  const map = L.map("map").setView([56.840449, 60.657217], 9);
  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  return map;
}

async function getRoutesObject() {
  return fetch(rootURL + "getAllRoutes", {
    method: "GET",
  }).then((response) => response.json()); // no error catching function in "then"
}

async function addTracks(routesObject, map) {
  console.log(routesObject);
  for (let gpx in routesObject) {
    console.log(rootURL + gpx);
    let track = new L.GPX(rootURL + gpx, { async: true, marker_options: {} });
    track.addTo(map);
    let trackName = gpx.slice(0, -4); //TODO: fix incorrect naming
    let reportPath = rootURL + routesObject[gpx];
    let popUp = L.popup().setContent(
      `<p>${trackName}</p>
  <p> <a href = ${reportPath}>Скачать отчёт</a> </p>`
    );
    track.bindPopup(popUp);
  }
}
