const map = L.map("map").setView([51.5, 0], 12);
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
let gpxPath = "Mitryasov_Kamchatka_3pesh_2022.gpx";
let gpx = new L.GPX(gpxPath, { async: true })
  .on("loaded", function (e) {
    map.fitBounds(e.target.getBounds());
  })
  .addTo(map);
let gpxName = gpxPath.slice(0, -4);
let popUp = L.popup().setContent(`<p>${gpxName}</p><p>Link to report</p>`);
gpx.bindPopup(popUp);
