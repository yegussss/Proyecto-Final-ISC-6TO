// Se importa el módulo express
const express = require('express');
// Se crea un objeto de ruta utilizando express.Router()
const ruta = express.Router();
// Se importa el modelo de Alumno
const Alumno = require('../models/alumno_model')

// Rutas HTTP

// GET: Obtener todos los alumnos
ruta.get('/', (req, res) => {
    // Se llama a la función idxAlumnos() para obtener todos los alumnos
    let alumnoslist = idxAlumnos();
    // Se maneja la promesa retornada por idxAlumnos()
    alumnoslist.then(alumnos => {
            res.json(alumnos); // Se envían los alumnos como respuesta
        })
        .catch(err => {
            res.json({
                error: err // Se envía un mensaje de error en caso de fallo
            })
        })
});

// GET: Buscar alumno por matrícula
ruta.get('/buscar/:matr', (req, res) => {
    // Se llama a la función searchAlumno() pasando la matrícula como parámetro
    let alumnolist = searchAlumno(req.params.matr);
    // Se maneja la promesa retornada por searchAlumno()
    alumnolist.then(registros => {
            res.json(registros); // Se envían los registros encontrados como respuesta
        })
        .catch(err => {
            res.status(500).json({
                error: err // Se envía un mensaje de error en caso de fallo
            });
        });
});

// POST: Crear un nuevo alumno
ruta.post('/', (req, res) => {
    // Se llama a la función crearAlumno() pasando los datos del cuerpo de la solicitud como parámetro
    let alta = crearAlumno(req.body);
    // Se maneja la promesa retornada por crearAlumno()
    alta.then(() => {
            // Después de crear el alumno, se obtiene la lista actualizada de todos los alumnos
            return idxAlumnos();
        })
        .then(() => {
            // Se redirige a la página index.html después de crear el alumno
            res.redirect('./index.html');
        })
        .catch(err => {
            res.status(500).json({
                error: err // Se envía un mensaje de error en caso de fallo
            });
        });
});

// PUT: Actualizar información de un alumno
ruta.put('/', async (req, res) => {
    try {
        // Se obtienen los datos del cuerpo de la solicitud
        const { matr, nom, apat, amat, carrera } = req.body;
        // Se llama a la función updateAlumno() pasando la matrícula y los nuevos datos como parámetros
        const alumnoActualizado = await updateAlumno(matr, { nom, apat, amat, carrera });
        // Se envía el alumno actualizado como respuesta
        if (alumnoActualizado) {
            res.json(alumnoActualizado);
        } else {
            res.status(404).json({ error: 'Alumno no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err }); // Se envía un mensaje de error en caso de fallo
    }
});

// DELETE: Desactivar asistencia de un alumno
ruta.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id; // Se obtiene el ID del alumno de los parámetros de la solicitud
        // Se llama a la función desactivarAsistencia() pasando el ID como parámetro
        const alumnoActualizado = await desactivarAsistencia(id);
        // Se envía el alumno actualizado como respuesta
        if (alumnoActualizado) {
            res.json(alumnoActualizado);
        } else {
            res.status(404).json({ error: 'Alumno no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message }); // Se envía un mensaje de error en caso de fallo
    }
});

// Métodos de acceso a la base de datos

// Método para obtener todos los alumnos "get"
async function idxAlumnos() {
    return await Alumno.find({});
}

// Método para buscar un alumno por matrícula "gets"
async function searchAlumno(matricula) {
    return await Alumno.find({ matr: matricula });
}

// Método para crear un nuevo alumno post
async function crearAlumno(body) {
    let newAlumno = new Alumno({
        matr: body.matr,
        nom: body.nom,
        apat: body.apat,
        amat: body.amat,
        carrera: body.carr
    });
    return await newAlumno.save();
}

// Método para actualizar información de un alumno "put"
async function updateAlumno(matricula, newData) {
    try {
        // Se verifica si existe al menos un documento con la matrícula especificada
        const alumnoExistente = await Alumno.findOne({ matr: matricula });
        // Si existe, se actualizan todos los documentos que coincidan con la matrícula especificada
        if (alumnoExistente) {
            const updatedAlumnos = await Alumno.updateMany({ matr: matricula }, newData, { new: true });
            return updatedAlumnos;
        } else {
            return null; // Se retorna null si no se encuentra ningún alumno con la matrícula especificada
        }
    } catch (err) {
        throw err;
    }
}

// Método para cambiar el valor de la propiedad 'asist' a false  "delete"
async function desactivarAsistencia(id) {
    try {
        // Se busca y actualiza el alumno con el ID especificado, cambiando el valor de 'asist' a false
        const alumnoActualizado = await Alumno.findByIdAndUpdate(id, { asist: false }, { new: true });
        if (alumnoActualizado) {
            return alumnoActualizado;
        } else {
            return null; // Se retorna null si no se encuentra ningún alumno con el ID especificado
        }
    } catch (err) {
        throw err;
    }
}

// Se exporta la ruta para su uso en otros módulos
module.exports = ruta;
