const rootURL = "http://localhost:3000/";
const OSMLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});
const OpenTopoMapLayer = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 17,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }
);

main();
async function main() {
  map = await setMap();
  AddLayersControl(map);
  routesObject = await getRoutesObject();
  window.tracks = await addTracks(routesObject, map);
  console.log(tracks);
  let control = new MyControl();
  control.addTo(map);
}

let MyControl = L.Control.extend({
  options: {
    position: "topright",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "filters-control");
    let text = document.createElement("p");
    text.innerHTML = "Категория сложности";
    text.id = "TitleControl";
    container.appendChild(text);

    const checkbox0 = createCheckboxInput("некатегорийный", "0category");
    const checkbox1 = createCheckboxInput("1", "1category");
    const checkbox2 = createCheckboxInput("2", "2category");
    const checkbox3 = createCheckboxInput("3", "3category");
    const checkbox4 = createCheckboxInput("4", "4category");
    const checkbox5 = createCheckboxInput("5", "5category");
    const checkbox6 = createCheckboxInput("6", "6category");

    container.appendChild(checkbox0);
    container.appendChild(checkbox1);
    container.appendChild(checkbox2);
    container.appendChild(checkbox3);
    container.appendChild(checkbox4);
    container.appendChild(checkbox5);
    container.appendChild(checkbox6);

    return container;
  },
});

async function ShowRoutes(category) {
  let tracksFileNames = await fetch(rootURL + String(category) + "category", {
    method: "GET",
  }).then((response) => response.json());
  for (let trackFileName of tracksFileNames) {
    // TODO: rewrite using map
    ShowTrack(trackFileName);
  }
}

async function UnShowRoutes(category) {
  let tracksFileNames = await fetch(rootURL + String(category) + "category", {
    method: "GET",
  }).then((response) => response.json());
  for (let trackFileName of tracksFileNames) {
    // TODO: rewrite using map
    UnShowTrack(trackFileName);
  }
}

function ShowTrack(trackFileName) {
  console.log("adding" + `${trackFileName}`);
  window.tracks[trackFileName].addTo(map);
}
function UnShowTrack(trackFileName) {
  console.log("hiding" + `${trackFileName}`);
  tracks[trackFileName].removeFrom(map);
}

function createCheckboxInput(labelText, value) {
  const label = document.createElement("label");
  const checkbox = document.createElement("input");

  checkbox.id = "checkbox";
  checkbox.type = "checkbox";
  checkbox.name = "filter";
  checkbox.value = value;
  let category = Number(value[0]);
  checkbox.onclick = function (elem) {
    if (this.checked) {
      ShowRoutes(category);
    } else {
      UnShowRoutes(category);
    }
  };

  label.classList.add("radio-label");
  label.textContent = labelText;
  label.appendChild(checkbox);

  return label;
}

//добавление переключателя слоев
function AddLayersControl(map) {
  let baseLayers = {
    OpenStreetMap: OSMLayer,
    OpenTopoMap: OpenTopoMapLayer,
  };
  L.control.layers(baseLayers).addTo(map);
}

async function setMap() {
  const map = L.map("map").setView([56.840449, 60.657217], 9);
  OSMLayer.addTo(map);
  return map;
}

//получение названий треков и отчетов в виде объекта вида {"tr.gpx":"tr.pdf"}
async function getRoutesObject() {
  return fetch(rootURL + "getAllRoutes", {
    method: "GET",
  }).then((response) => response.json()); // no error catching function in "then"
}

async function addTracks(routesArray, map) {
  let tracks = {};
  for (let routeObj of routesArray) {
    let gpx = Object.keys(routeObj)[0]; // TODO: replace routeObj destruction to for..of
    report = Object.values(routeObj)[0];
    let track = new L.GPX(rootURL + gpx, {
      async: true,
      marker_options: {
        iconSize: [15, 20],
        shadowSize: [22, 22],
        iconAnchor: [8, 20],
        shadowAnchor: [8, 20],
        startIconUrl: "img/pin-icon-start.png",
        endIconUrl: "img/pin-icon-end.png",
        shadowUrl: "img/pin-shadow.png",
        wptIconUrls: {
          "": "img/pin-icon-wpt.png",
        },
      },
      gpx_options: {
        parseElements: ["track", "route"],
      },
      polyline_options: {
        opacity: 1,
        weight: 3,
      },
    }); // TODO: delete shadows
    let trackName = gpx.slice(0, -4); //TODO: fix incorrect naming
    let reportPath = rootURL + report;
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
    tracks[gpx] = track;
  }
  return tracks;
}
