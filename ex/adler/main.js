const div = document.getElementById("map")
const breite1 = div.getAttribute("data-lat1");
const laenge1 = div.getAttribute("data-lng1");
const titel1 = div.getAttribute("data-title1");
const breite2 = div.getAttribute("data-lat2");
const laenge2 = div.getAttribute("data-lng2");
const titel2 = div.getAttribute("data-title2");


//console.log(breite,laenge,titel)

// Karte initialisieren


let karte = L.map("map");

//console.log(karte);

//aus Ausschnitt zoomen

/*karte.setView(
    [47.2, 11.2],
    8
);  --> Überflüssig geworden*/ 

//openstreetmap hinzufügen
L.tileLayer("http://{s}.tile.osm.org./{z}/{x}/{y}.png").addTo(karte);

// 1. Positionsmarker hinzufügen
let pin1 = L.marker(
    [breite1, laenge1]
).addTo(karte);

//Popup zum Pin hängen
pin1.bindPopup(titel1).openPopup();

// 2. Positionsmarker hinzufügen
let pin2 = L.marker(
    [breite2, laenge2]
).addTo(karte);

//Popup zum Pin hängen
pin2.bindPopup(titel2).openPopup();

let blickeGruppe = L.featureGroup().addTo(karte);

for (let blick of ADLERBLICKE) {
    console.log(blick);
    let blickpin = L.marker(
        [blick.lat, blick.lng]
    ).addTo(blickeGruppe);
    blickpin.bindPopup(
        `<h1>Standort ${blick.standort}</h>
        <p>Höhe: ${blick.seehoehe}m</p>
        <em>Kunde:${blick.kunde}</em>`
    );
}
console.log(blickeGruppe.getBounds());
// auf Adlerblicke zoomen
karte.fitBounds(blickeGruppe.getBounds());