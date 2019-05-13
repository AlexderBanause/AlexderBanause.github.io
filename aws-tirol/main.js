let karte = L.map("map");

const kartenLayer = {
    osm: L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }),
    geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: `Datenquelle: <a href="www.basemap.at">basemap.at</a>`
    }),
    bmapoverlay: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: `Datenquelle: <a href="www.basemap.at">basemap.at</a>`
    }),
    bmapgrau: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: `Datenquelle: <a href="www.basemap.at">basemap.at</a>`
    }),
    bmaphidpi: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: `Datenquelle: <a href="www.basemap.at">basemap.at</a>`
    }),
    bmaporthofoto30cm: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: `Datenquelle: <a href="www.basemap.at">basemap.at</a>`
    }),
    bmapgelaende: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgelaende/grau/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: `Datenquelle: <a href="www.basemap.at">basemap.at</a>`
    }),
    bmapoberflaeche: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgelaende/grau/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: `Datenquelle: <a href="www.basemap.at">basemap.at</a>`
    }),
    stamen_toner: L.tileLayer("http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png", {
        subdomains: ['a', 'b', 'c'],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    stamen_terrain: L.tileLayer("http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg", {
        subdomains: ['a', 'b', 'c'],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    stamen_watercolor: L.tileLayer("http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg", {
        subdomains: ['a', 'b', 'c'],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
    }),
}

kartenLayer.osm.addTo(karte);

//Auswahlmenü hinzufügen
const layerControl = L.control.layers({
    "OpenStreetMap": kartenLayer.osm,
    "Geoland Basemap": kartenLayer.geolandbasemap,
    "Geoland Basemap Grau": kartenLayer.bmapgrau,
    "Geoland Basemap Overlay": kartenLayer.bmapoverlay,
    "Orthophoto": kartenLayer.bmaporthofoto30cm,
    "Geoland Basemap hiDPI": kartenLayer.bmaphidpi,
    "Geoland Basemap Oberfläche": kartenLayer.bmapoberflaeche,
    "Geoland Basemap Gelände": kartenLayer.bmapgelaende,
    "Stamen Toner": kartenLayer.stamen_toner,
    "Stamen Terrain": kartenLayer.stamen_terrain,
    "Stamen Watercolor": kartenLayer.stamen_watercolor
}).addTo(karte);

karte.setView(
    [47.267222, 11.392778], 10
);

//console.log(AWS);

//wenn Internetverbindung abbricht wird zB Script weitergealden (wird asynchron abgerufen)
async function loadStations() {
    const response = await fetch("https://aws.openweb.cc/stations"); //darauf warten, dass der nächste aufruf abgeschlossen ist
    const stations = await response.json();
    const awsTirol = L.featureGroup();
    L.geoJson(stations)
        .bindPopup(function (layer) {
            //console.log("Layer: ", layer);
            const date = new Date(layer.feature.properties.date);
            console.log("Datum: ", date);
            return `<h4> ${layer.feature.properties.name} </h4>
        Höhe: ${layer.feature.geometry.coordinates[2]} m<br>
        Temperatur: ${layer.feature.properties.LT} °C <br>
        Datum: ${date.toLocaleDateString("de-AT")} <br> 
        Zeit: ${date.toLocaleTimeString("de-AT")} <br>
        Windgeschwindigkeit: ${layer.feature.properties.WG ? layer.feature.properties.WG + ' km/h': 'keine Daten'}
        <hr>
        <footer>Land Tirol - <a href=https://data.tiro.gv.at>data.tirol.at</a></footer>`;
        })
        .addTo(awsTirol);
    karte.fitBounds(awsTirol.getBounds());
    layerControl.addOverlay(awsTirol, "Wetterstationen Tirol");


    const windLayer = L.featureGroup();
    L.geoJson(stations, {
        pointToLayer: function (feature, latlng) {
            if (feature.properties.WR) {
                let color = `color`;
                if (feature.properties.WG > 20) {
                    color = `red`
                }
                return L.marker(latlng, {
                    icon: L.divIcon({
                        html: `<i style="color: ${color}; transform: rotate(${feature.properties.WR-45}deg)" class="fas fa-location-arrow fa-2x"></i>`
                    })

                });

            }
        }
    }).addTo(windLayer);
    layerControl.addOverlay(windLayer, "Windrichtung");
    //windLayer.addTo(karte);

    const temperatureLayer = L.featureGroup();
    const farbpalette = [
        [-12, "#0500ff"],
        [-11.5, "#0400ff"],
        [-11, "#0300ff"],
        [-10.5, "#0200ff"],
        [-10, "#0100ff"],
        [-9.5, "#0000ff"],
        [-9, "#0002ff"],
        [-8.5, "#0012ff"],
        [-8, "#0022ff"],
        [-7.5, "#0032ff"],
        [-7, "#0044ff"],
        [-6.5, "#0054ff"],
        [-6, "#0064ff"],
        [-5.5, "#0074ff"],
        [-5, "#0084ff"],
        [-4.5, "#0094ff"],
        [-4, "#00a4ff"],
        [-3.5, "#00b4ff"],
        [-3, "#00c4ff"],
        [-2.5, "#00d4ff"],
        [-2, "#00e4ff"],
        [-1.5, "#00fff4"],
        [-1, "#00ffd0"],
        [-0.5, "#00ffa8"],
        [0, "#00ff83"],
        [0.5, "#00ff5c"],
        [1, "#00ff36"],
        [1.5, "#00ff10"],
        [2, "#17ff00"],
        [2.5, "#3eff00"],
        [3, "#65ff00"],
        [3.5, "#8aff00"],
        [4, "#b0ff00"],
        [4.5, "#d7ff00"],
        [5, "#fdff00"],
        [5.5, "#FFfa00"],
        [6, "#FFf000"],
        [6.5, "#FFe600"],
        [7, "#FFdc00"],
        [7.5, "#FFd200"],
        [8, "#FFc800"],
        [8.5, "#FFbe00"],
        [9, "#FFb400"],
        [9.5, "#FFaa00"],
        [10, "#FFa000"],
        [10.5, "#FF9600"],
        [11, "#FF8c00"],
        [11.5, "#FF8200"],
        [12, "#FF7800"],
        [12.5, "#FF6e00"],
        [13, "#FF6400"],
        [13.5, "#FF5a00"],
        [14, "#FF5000"],
        [14.5, "#FF4600"],
        [15, "#FF3c00"],
        [15.5, "#FF3200"],
        [16, "#FF2800"],
        [16.5, "#FF1e00"],
        [17, "#FF1400"],
        [17.5, "#FF0a00"],
        [18, "#FF0000"],
        [18.5, "#FF0010"],
        [19, "#FF0020"],
        [19.5, "#FF0030"],
        [20, "#FF0040"],
        [20.5, "#FF0050"],
        [21, "#FF0060"],
        [21.5, "#FF0070"],
        [22, "#FF0080"],
        [22.5, "#FF0090"],
        [23, "#FF00A0"],
        [23.5, "#FF00B0"],
        [24, "#FF00C0"],
        [24.5, "#FF00D0"],
        [25, "#FF00E0"],
        [25.5, "#FF00F0"],
        [26, "#FF01F0"],
        [26.5, "#FF02F0"],
        [27, "#FF03F0"],
        [27.5, "#FF04F0"],
        [28, "#FF05F0"],
        [28.5, "#FF06F0"],
        [29, "#FF07F0"],
        [29.5, "#FF08F0"],
        [30, "#FF09F0"],
        [30.5, "#FF0AF0"],
        [31, "#FF0BF0"],
        [31.5, "#FF0CF0"],
        [32, "#FF0DF0"],
        [32.5, "#FF0EF0"]
    ];

    L.geoJson(stations, {
        pointToLayer: function (feature, latlng) {
            let color;
            if (feature.properties.LT) {
                for (let i = 0; i < farbpalette.length; i++) {
                    console.log(farbpalette[i], feature.properties.LT);
                    if (feature.properties.LT < farbpalette[i][0]) {
                        color = farbpalette[i][1];
                        break;
                    }
                }


                // if (feature.properties.LT > 0) {
                //    color = `red`;
                //}
                return L.marker(latlng, {
                    icon: L.divIcon({
                        html: `<div class="temperatureLabel" style="background-color:${color}"> ${feature.properties.LT} </div>`
                    })

                });

            }
        }
    }).addTo(temperatureLayer);
    layerControl.addOverlay(temperatureLayer, "Temperatur");
    temperatureLayer.addTo(karte);
}

loadStations();