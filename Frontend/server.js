const express = require('express');
const path = require('path');
const os = require('os');
const app = express();

// Cambiar la ruta estática al directorio padre
app.use(express.static(path.join(__dirname, '..'))); // Sirve los archivos desde una carpeta arriba

const PORT = 5500;
const HOST = '0.0.0.0'; // Escuchar en todas las interfaces de red

app.listen(PORT, HOST, () => {
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];

    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }

    console.log(`Frontend disponible en las siguientes direcciones:`);
    addresses.forEach(address => {
        console.log(`http://${address}:${PORT}/index.html`); // Nueva ruta
    });
    console.log(`También disponible en http://localhost:${PORT}/index.html`); // Nueva ruta
});
