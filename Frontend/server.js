const express = require('express');
const path = require('path');
const os = require('os');
const app = express();

app.use(express.static(path.join(__dirname))); // Sirve todos los archivos estáticos

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
        console.log(`http://${address}:${PORT}/html/index.html`);
    });
    console.log(`También disponible en http://localhost:${PORT}/html/index.html`);
});