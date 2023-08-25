url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then( data => {

createFeatures(data.features)

});

function createFeatures ( earthquakeData){
    //this function creates for each feature a pop and also by default will create simple blue markers, below we changing the markers to circle. 
    function onEachFeature( feature, layer) { 
        if( feature.properties && feature.properties.mag && feature.properties.place  && feature.properties.time)
            layer.bindPopup(`<h3> ${feature.properties.place}</h3><hr><p> ${new Date(feature.properties.time)}</p><hr><p> ${feature.properties.mag}</p>`);

    }//function oneachfeature

     function pointToLayer(feature, latlng){
        let geojsonMarkerOptions = {
         radius:feature.properties.mag*5,
         fillColor: chooseColor(feature.geometry.coordinates[2]),
         color: chooseColor(feature.geometry.coordinates[2]),
         weight: 1,
         opacity: 0.8,
         fillOpacity: 0.35
        } 
        return L.circleMarker(latlng,geojsonMarkerOptions);
    }
    //creating a geojson layer which will contain onEachFeature = the markers with pop and pointToLayer which converts the markers to a cricular marker
let earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer : pointToLayer
    }

); //let earquakes

//calling createMap function by passing the GEOLAYER data created in it
createMap(earthquakes)


} //function createFeatures bracket
function chooseColor(mag){
    switch(true){
        case(-10 <= mag && mag <= 10):
            return "#E2FFAE";
        case (10 > mag && mag <=30 ):
            return "#BC0000";
        case (30 > mag && mag <=50):
            return "#BCBC00";
        case (50 >  mag && mag <= 70):
            return "#BC3500";
        case (70 > mag && mag <=90.0):
            return "#35bc00";
        default:
            return "#0071BC";
    }
}


let legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [-10,10,30,50,70,90];
    var labels = [];
    var legendInfo = "<h4>Magnitude</h4>";

    div.innerHTML = legendInfo

    // go through each magnitude item to label and color the legend
    // push to labels array as list item
    for (var i = 0; i < grades.length; i++) {
          labels.push('<ul style="background-color:' + chooseColor(grades[i] + 1) + '"> <span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '' : '+') + '</span></ul>');
        }

      // add each label list item to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    
    return div;
  };


function createMap(earthquakess) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakess // this is the geo layer data passed here. 
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakess]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    legend.addTo(myMap);
}