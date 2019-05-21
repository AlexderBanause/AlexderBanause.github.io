/* Wien OGD Beispiele */

let karte = L.map("map");

const kartenLayer = {
    osm: L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>'
    }),
    bmapoverlay: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>'
    }),
    bmapgrau: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>'
    }),
    bmaphidpi: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>'
    }),
    bmaporthofoto30cm: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>'
    }),
    bmapgelaende: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgelaende/grau/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>'
    }),
    bmapoberflaeche: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapoberflaeche/grau/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>'
    }),
    stamen_toner: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    stamen_terrain: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    stamen_watercolor: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
    })
};

const layerControl = L.control.layers({
    "Geoland Basemap": kartenLayer.geolandbasemap,
    "Geoland Basemap Grau": kartenLayer.bmapgrau,
    "Geoland Basemap Overlay": kartenLayer.bmapoverlay,
    "Geoland Basemap High DPI": kartenLayer.bmaphidpi,
    "Geoland Basemap Orthofoto": kartenLayer.bmaporthofoto30cm,
    "Geoland Basemap Gelände": kartenLayer.bmapgelaende,
    "Geoland Basemap Oberfläche": kartenLayer.bmapoberflaeche,
    "OpenStreetMap": kartenLayer.osm,
    "Stamen Toner": kartenLayer.stamen_toner,
    "Stamen Terrain": kartenLayer.stamen_terrain,
    "Stamen Watercolor": kartenLayer.stamen_watercolor
}).addTo(karte);

kartenLayer.bmapgrau.addTo(karte);

karte.addControl(new L.Control.Fullscreen());

karte.setView([48.208333, 16.373056], 12);




// die Implementierung der Karte startet hier
const url = 'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SPAZIERPUNKTOGD &srsName=EPSG:4326&outputFormat=json'

function makeMarker(feature, latlng) {
    const fotoIcon = L.icon({
            iconUrl: 'http://www.data.wien.gv.at/icons/sehenswuerdigogd.png',
            iconSize: [23, 23]
        });
        const sightMarker = L.marker(latlng, {
            // L. --> Leaflat bibliothek
            icon: fotoIcon
    });
    sightMarker.bindPopup(`
        <h3>${feature.properties.NAME}</h3>
        <p>${feature.properties.BEMERKUNG}</p>
        <hr>
        <footer><a target= "blank" href="${feature.properties.WEITERE_INF}">Weblink</a></footer>
`);
return sightMarker;
}


async function loadSights(url) {
    const clusterGruppe = L.markerClusterGroup();
    const antwort = await fetch(url);
    const sightsData = await antwort.json();
    const geoJson = L.geoJson(sightsData, {
        pointToLayer: makeMarker
    });
    clusterGruppe.addLayer(geoJson);
    karte.addLayer(clusterGruppe);
    layerControl.addOverlay(clusterGruppe, "Sehenswürdigkeiten");

    const suchFeld = new L.Control.Search({
        layer: clusterGruppe,
        propertyName: "NAME",
        zoom: 17,
        initial: false
    });
    karte.addControl(suchFeld);


    const massstab = L.control.scale({
        imperial: true,  // keine Variable, kommt von der Dokumentation
        metric: false
    });
    karte.addControl(massstab);
}

const wege = 'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SPAZIERLINIEOGD &srsName=EPSG:4326&outputFormat=json'

function linienPopup(feature, layer) {
    console.log(feature);
    const popup = `
    <h3>${feature.properties.NAME}</h3>
    <p><a href="${feature.properties.WEITERE_INF}">Weblink</a></p>
    `;
    layer.bindPopup(popup);
}

async function loadWege(wegeUrl) {
    const antwort = await fetch(wegeUrl);
    const wegeData = await antwort.json();
    console.log(wegeData);
    const wegeJson = L.geoJson (wegeData, {
        style: function() {
            return {
                color: "green"
            };
        },
        onEachFeature: linienPopup
    });
    karte.addLayer(wegeJson);
    layerControl.addOverlay(wegeJson, "WLAN Standorte");
    
}

const wlan = 'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WLANWIENATOGD&srsName=EPSG:4326&outputFormat=json'

function makewlanMarker(feature, latlng) { 
    const fotosymbol = L.icon({ 
        iconUrl: 'http://www.data.wien.gv.at/icons/wlanwienatogd.png',
        iconSize: [34, 34]
    });

    const wlanmarker = L.marker(latlng, { 
        icon: fotosymbol 
    });


    wlanmarker.bindPopup(`
 <h3>${feature.properties.NAME}</h3> 
<h4>${feature.properties.ADRESSE}</h4>
<footer><a href="${feature.properties.WEITERE_INFORMATIONEN}" target="_blan">Weitere Informationen</a></footer>
 `)

    return wlanmarker;
}

async function loadWlan(urlsight) { 
    const wlanclusterGruppe = L.markerClusterGroup(); 
    const response = await fetch(urlsight); 
    const wlanData = await response.json(); 
    const geoJson = L.geoJson(wlanData, { 
        pointToLayer: makewlanMarker 
    });
    wlanclusterGruppe.addLayer(geoJson);
    karte.addLayer(wlanclusterGruppe);
    layerControl.addOverlay(wlanclusterGruppe, "Wlan-Punkte")

    const suchFeld = new L.Control.Search({
        layer: wlanclusterGruppe,
        propertyName: "NAME",
        zoom: 17,
        initial: false,
    });
    karte.addControl(suchFeld);
}

loadWlan(wlan);

/*function linienPopup(feature, layer) {
    console.log(feature);
    const popup = `
    <h3>${feature.properties.NAME}</h3>
    <p><a href="${feature.properties.WEITERE_INF}">Weblink</a></p>
    `;
    layer.bindPopup(popup);
}

async function loadWege(wegeUrl) {
    const antwort = await fetch(wegeUrl);
    const wegeData = await antwort.json();
    console.log(wegeData);
    const wegeJson = L.geoJson (wegeData, {
        style: function() {
            return {
                color: "green"
            };
        },
        onEachFeature: linienPopup
    });
    karte.addLayer(wegeJson);
    layerControl.addOverlay(wegeJson, "Spazierwege");
}*/
loadWege(wege);

