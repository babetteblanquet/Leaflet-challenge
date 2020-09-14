// Store our API endpoint inside queryUrl
//var data;
//var magnitude;
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
   // createCircles(data.features);
});

//Create a function 
// function createCircles(earthquakeData) {
// //Create a function to colour the circles of the earthquakes based on their magnitude:
//     function getColor(d) {
//         return d > 5 ? '#800026' :
//             d > 4 ? '#BD0026' :
//             d > 3 ? '#E31A1C' :
//             d > 2 ? '#FC4E2A' :
//             d > 1 ? '#FD8D3C' :
//             d > 0 ? '#FEB24C' :
//             '#FFEDA0';
// }

//     var geojsonMarkerOptions = {
//     // Adjust radius
//     radius: magnitude * 100,
//     fillColor: getColor(magnitude),
//     color: "black",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.75}

//     var earthquakes = L.geoJSON(earthquakeData, {
//         pointToLayer: function (_feature, latlng) {
//             return L.circleMarker(latlng, geojsonMarkerOptions);
//         }
//     })

//     //Sending our earthquakes circles to the createMap function
//     createMap(earthquakes);

// }

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><h3>" + "Magnitude: " + feature.properties.mag +
            "</h3><p>" + new Date(feature.properties.time) +
            "</p>");
    }

    //Create a function to colour the circles of the earthquakes based on their magnitude:
    function getColor(d) {
        return d > 5 ? '#d73027' :
            d > 4 ? '#ff7f00' :
            d > 3 ?'#fc8d59' :
            d > 2 ? '#fee08b' :
            d > 1 ? '#d9ef8b' :
             '#91cf60' ;
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
     var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
          return new L.CircleMarker(latlng, {
            radius: feature.properties.mag * 10,
            color: 'black',
            weight: 0.5,
            fillColor: getColor(feature.properties.mag),
            opacity: 1,
            fillOpacity: 0.75
          });
        },
        onEachFeature: onEachFeature,
     });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
