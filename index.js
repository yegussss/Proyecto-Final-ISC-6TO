const express = require('express');
const mongoose = require('mongoose');
const alumnos = require('./routes/alumnos');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/alumnos')
    .then(() => {
        console.log('Conexión establecida con MongoDB');
    })
    .catch((err) => {
        console.log('Error al conectarse con MongoDB');
    });

// Ruteo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/alumnos', alumnos);

// Configuración para servir archivos estáticos desde la carpeta 'views'
app.use(express.static(path.join(__dirname, 'views')));
// Configuración para servir archivos estáticos desde la carpeta 'node_modules'
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));


app.listen(port, () => {
    console.log(`Servidor conectado en puerto ${port}`);
});
