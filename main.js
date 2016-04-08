require('leaflet-ajax');
var rbush = require('rbush');

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
      bboxes.push(layer.getBounds().toBBoxString().split(',').map(function(x){return +x}));
  },
  style: style
});

regions.once('data:loaded', function() {
  map.addLayer(regions);
  // console.log(bboxes);

  // //snapping
  // var tree = rbush(9);
  // tree.load(bboxes);
  // // console.log(tree);
  // var result = tree.search([50, 55, 60, 65]);
  // // console.log(result);





// onclick
var tempMarker, marker;

function createMarker(evt){
  btn.style.backgroundColor = randomColor;
  if (marker) map.removeLayer(marker);
  marker = L.marker(evt.latlng).addTo(map);
}

function update(evt){
 if (!tempMarker) {
   tempMarker = L.marker(evt.latlng).addTo(map);
   tempMarker.snapediting = new L.Handler.MarkerSnap(map, tempMarker, {snapDistance: 15, snapVertices: true});
   tempMarker.snapediting.addGuideLayer(regions);
   tempMarker.snapediting.enable();
  } else {
    tempMarker.setLatLng(evt.latlng);
  }
  map.on('click', createMarker);
}

btn.addEventListener('click', activateCursor);
function activateCursor() {
  map.on('mousemove', update);
}
}, regions);
