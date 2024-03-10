// map
var myMap = L.map("map", {
    center: [39.0997, -94.5786],
    zoom: 4 // Set the initial zoom level
  });

  // tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// earthquake week summary URL
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// time and date
function convertTimestamp(x) {
  var d = new Date(x),
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2),  
    dd = ('0' + d.getDate()).slice(-2),         
    hh = d.getHours(),
    h = hh,
    min = ('0' + d.getMinutes()).slice(-2),     
    ampm = 'AM',
    time;

  if (hh > 12) {
      h = hh - 12;
      ampm = 'PM';
  } else if (hh === 12) {
      h = 12;
      ampm = 'PM';
  } else if (hh == 0) {
      h = 12;
  }

  time = mm + '-' + dd + '-' + yyyy + ', ' +  h + ':' + min + ' ' + ampm;
  return time;
};

// Function 
function getColor(depth) {
  return depth > 90 ? '#b30000':
  depth > 70 ? '#ffa500':
  depth > 50 ? '#ffd280':
  depth > 30 ? '#ffff00':
  depth > 10 ? '#008000':
  '#00ff00';
};


// GeoJSON 
d3.json(link).then(function(data) {

  featureData = data.features
  console.log(featureData)
 
    // Loop data
    for (var i = 0; i < featureData.length; i++) {
    var location = data.features[i].geometry;
    var magnitude = data.features[i].properties.mag
    var depth = data.features[i].geometry.coordinates[2]
    var circleOptions = {radius: magnitude*5,
      color: 'black',
      weight: 1,
      fillColor: getColor(depth),
      fillOpacity: 0.8
    };

    // time
    var timestamp = data.features[i].properties.time

    dateTime = convertTimestamp(timestamp)

    new L.circleMarker([location.coordinates[1], location.coordinates[0]], circleOptions)
    .bindPopup("<strong>Time: </strong>" + dateTime + "<br /><strong>Magnitude: </strong>" + magnitude +"<br /><strong>Location: </strong>" + data.features[i].properties.place +"<br /><strong>Depth: </strong>" + depth + " km")
    .addTo(myMap);
    }

  });


  // legend content
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
   var div = L.DomUtil.create("div", "info legend");
   var labels = ["-10-10 km", "10-30 km", "30-50 km", "50-70 km", "70-90 km", "90+ km"];
   var colors = ['#00ff00','#008000','#ffff00', '#ffd280', '#ffa500','#b30000'];
   var colorLabels = [];
   // Add legend title
   var legendInfo = "<h1>Earthquake Depth</h1>";
   
   div.innerHTML = legendInfo;

   labels.forEach(function(label, index) {
    colorLabels.push("<i style=\"background:" + colors[index] + "\"></i>" + labels[index] + "<br>");
   });

    div.innerHTML += colorLabels.join("") + "</div>";
    return div;
   };


 // Add the legend
 legend.addTo(myMap);