require('leaflet-ajax');
// var rbush = require('rbush');

var bboxes = [];

// btn
var btn = document.getElementById('button');

// basemap
var map = L.map('map', {dragging: false}).setView([60, 90],3);
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
  fillOpacity: 0.2
}

// layer
var regions = new L.geoJson.ajax("http://kosmosnimki.ru/downloads/tasks_2016/regions_rf.geojson", {
  onEachFeature: function(feature, layer) {
    // for (var i = 0; i < feature.geometry.coordinates[0].length-1; i++) {
    //   var latlng1 = L.latLng(feature.geometry.coordinates[0][i][1], feature.geometry.coordinates[0][i][0]);
    //   var latlng2 = L.latLng(feature.geometry.coordinates[0][i+1][1], feature.geometry.coordinates[0][+1][0]);
    //   bboxes.push(L.LatLngBounds([latlng1, latlng2]).toBBoxString());
    // }
  },
  style: style
});

regions.once('data:loaded', function() {
  map.addLayer(regions);
  map.fitBounds(regions.getBounds());
  // console.log(bboxes);
}, regions);

  // onclick
var tempMarker, marker;
// tempMarker = L.circleMarker();
// tempMarker.snapediting = new L.Handler.MarkerSnap(map, tempMarker, {snapDistance: 3, snapVertices: true});
// tempMarker.snapediting.addGuideLayer(regions);
// tempMarker.snapediting.enable();

function createMarker(evt){
  if (marker) map.removeLayer(marker);
  marker = L.circleMarker(evt.latlng).addTo(map);
}

function update(evt){
 if (!tempMarker) {
   tempMarker = L.circleMarker(evt.latlng).addTo(map);
  } else {
    tempMarker.setLatLng(evt.latlng);
  }
  map.on('click', createMarker);
}

btn.addEventListener('click', activateCursor);
function activateCursor() {
  map.on('mousemove', update);
}

//snapping
// var tree = rbush(9);
// rbush.insert()
