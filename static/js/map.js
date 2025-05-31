const map = L.map('map',{
    scrollWheelZoom: true,       // rotellina
    touchZoom: true,             // touchpad
    doubleClickZoom: true,       // doppio click
    dragging: true               // fix: non si poteva più navigare con il mouse
                                 // nella mappa, non so perchè, ma ora funziona
}).setView([44.8121, 10.3365], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© Broshka Alesio'
}).addTo(map);

L.marker([44.8121, 10.3365]).addTo(map)
    .bindPopup('Via Toscana 10, Parma')
    .openPopup();
