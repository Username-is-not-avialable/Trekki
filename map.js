const rootURL = "http://localhost:3000/";
//map.on("zoomend", () => alert("resized"));
//получение названий треков и отчетов в виде объекта вида {"tr.gpx":"tr.pdf"}
main();
async function main() {
  map = await setMap();
  routesObject = await getRoutesObject();
  addTracks(routesObject, map);
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
  let routeCounter = 0;
  for (let gpx in routesObject) {
    routeCounter += 1;
    console.log(rootURL + gpx);
    let track = new L.GPX(rootURL + gpx, {
      async: true,
      marker_options: {
        iconSize: [15, 20],
        iconAnchor: [8, 20], // TODO: make shadows smaller
      },
      gpx_options: {
        parseElements: ["track", "route"],
      },
      polyline_options: {
        opacity: 1,
        //color: "red",
      },
    });
    // delete track.marker_options.icon.shadowUrl;
    // delete track.marker_options.icon.shadowRetinaUrl;
    track.addTo(map);
    let trackName = gpx.slice(0, -4); //TODO: fix incorrect naming
    let reportPath = rootURL + routesObject[gpx];
    let popUp = L.popup().setContent(
      `<p>${trackName}</p>
  <p> <a href = ${reportPath}>Скачать отчёт</a> </p>`
    );
    track.bindPopup(popUp);
    track.on("mouseover", (e) => {
      e.layer.setStyle({ color: "red" });
    });
    track.on("mouseout", (e) => {
      e.layer.setStyle({ color: "blue" });
    });
  }
  console.log(`${routeCounter} tracks loaded`);
}
