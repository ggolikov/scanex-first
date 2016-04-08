require('leaflet-ajax');

// btn
var btn = document.getElementById('button');

// basemap
var map = L.map('map', {dragging: false}).setView([55, 40],5);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// styling
var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
var style = {
  weight: 2,
  color: "grey",
  fillColor: randomColor,
  opacity: 1,
  fillOpacity: 0.2,
  clickable: false
}

// loading GeoJSON data
var regions = L.geoJson.ajax("http://kosmosnimki.ru/downloads/tasks_2016/regions_rf.geojson", {
  style: style
});

  regions.once('data:loaded', function() {
    map.addLayer(regions);
    var tempMarker, marker;

    function createMarker(evt){
      if (marker) map.removeLayer(marker);
        marker = L.marker(evt.latlng).addTo(map);
    }

    // enable snapping
    function update(evt){
      if (!tempMarker) {
        tempMarker = L.marker(evt.latlng).addTo(map);
        tempMarker.snapediting = new L.Handler.MarkerSnap(map, tempMarker, {snapDistance: 20, snapVertices: true});
        tempMarker.snapediting.addGuideLayer(regions);
        tempMarker.snapediting.enable();
      } else {
        tempMarker.setLatLng(evt.latlng);
      }
      map.on('click', createMarker);
    }

    function activateCursor() {
      map.on('mousemove', update);
    }

    btn.addEventListener('click', activateCursor);
}, regions);
