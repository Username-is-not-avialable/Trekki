const map = L.map("map").setView([51.5, 0], 12);
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
let gpx = "Mitryasov_Kamchatka_3pesh_2022.gpx";
new L.GPX(gpx, { async: true })
  .on("loaded", function (e) {
    map.fitBounds(e.target.getBounds());
  })
  .on("click", (e) => alert("Clicked on route"))
  .addTo(map);
