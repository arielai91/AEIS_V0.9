const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname))); // Sirve todos los archivos estáticos

app.listen(5500, () => {
    console.log('Frontend disponible en http://localhost:5500/html/index.html');
});
