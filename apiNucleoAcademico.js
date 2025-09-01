require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { Router } = require("express");
const { db, bucket } = require("./dbFirestore.js");
const multer = require('multer');

const router = Router()
const upload = multer({ storage: multer.memoryStorage() });
const firestore = admin.firestore();


// Endpoint para obtener los datos del Núcleo Académico Básico
router.get("/nucleoBasico", async (req, res) => {
    try {
        const nucleoBasicoRef = db.collection("nucleoBasico"); 
        const snapshot = await nucleoBasicoRef.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en Núcleo Académico Básico" });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener Núcleo Académico Básico:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});


// Endpoint para añadir un nuevo documento a Núcleo Académico Básico
router.post('/nucleoBasico', upload.single('imagenPerfil'), async (req, res) => {
  try {
    const {
      nombre,
      nivelSNII,
      cargo,
      cedulaProfesional,
      correo,
      cvu,
      especialidad,
      gradoMaximo,
      lineasInv,
      semblanza,
      unidadAdscripcion
    } = req.body;

    if (!req.file) {
      return res.status(400).send("No se ha enviado ninguna imagen.");
    }

    const dir = "nucleoBasico/" + req.file.originalname;
    const file = bucket.file(dir);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype
      }
    });

    await file.makePublic();
    const imageURL = file.publicUrl();

    let cvuArray = [];
    if (Array.isArray(cvu)) {
      cvuArray = cvu;
    } else if (typeof cvu === 'string' && cvu.trim() !== '') {
      cvuArray = cvu.includes(',')
        ? cvu.split(',').map(link => link.trim())
        : [cvu.trim()];
    }

    const docData = {
      nombre,
      nivelSNII,
      cargo,
      cedulaProfesional,
      correo,
      cvu: cvuArray, 
      especialidad,
      gradoMaximo,
      imageURL,
      lineasInv,
      semblanza,
      unidadAdscripcion,
      timestamp: new Date()
    };

    await firestore.collection('nucleoBasico').add(docData);

    res.send('Imagen y datos subidos correctamente.');
  } catch (error) {
    console.error('Error al subir datos:', error);
    res.status(500).send('Error al subir imagen y datos');
  }
});


// Endpoint para actualizar un documento de Núcleo Académico Básico
router.put('/nucleoBasico/:id', upload.single('imagenPerfil'), async (req, res) => {
    const docId = req.params.id;

    try {
        const docRef = firestore.collection('nucleoBasico').doc(docId);
        const docSnapshot = await docRef.get();

        if (!docSnapshot.exists) {
            return res.status(404).send('Documento no encontrado');
        }

        const existingData = docSnapshot.data();

        const {
            nombre,
            nivelSNII,
            cargo,
            cedulaProfesional,
            correo,
            cvu,
            especialidad,
            gradoMaximo,
            lineasInv,
            semblanza,
            unidadAdscripcion
        } = req.body;

        let cvuArray;
        if (cvu !== undefined) {
            if (Array.isArray(cvu)) {
                cvuArray = cvu;
            } else if (typeof cvu === 'string' && cvu.trim() !== '') {
                cvuArray = cvu.includes(',')
                    ? cvu.split(',').map(link => link.trim())
                    : [cvu.trim()];
            } else {
                cvuArray = [];
            }
        }

        const updatedData = {
            ...(nombre && { nombre }),
            ...(nivelSNII && { nivelSNII }),
            ...(cargo && { cargo }),
            ...(cedulaProfesional && { cedulaProfesional }),
            ...(correo && { correo }),
            ...(cvuArray !== undefined && { cvu: cvuArray }), 
            ...(especialidad && { especialidad }),
            ...(gradoMaximo && { gradoMaximo }),
            ...(lineasInv && { lineasInv }),
            ...(semblanza && { semblanza }),
            ...(unidadAdscripcion && { unidadAdscripcion }),
            timestamp: new Date()
        };

        if (req.file) {
            if (existingData.imageURL) {
                const oldImageName = existingData.imageURL.split("/").pop();
                const oldFile = bucket.file("nucleoBasico/" + decodeURIComponent(oldImageName));

                try {
                    await oldFile.delete();
                    console.log(`Imagen anterior eliminada: ${oldImageName}`);
                } catch (err) {
                    console.warn("No se pudo eliminar la imagen anterior (puede que no exista):", err.message);
                }
            }

            const newFileName = req.file.originalname;
            const newFilePath = "nucleoBasico/" + newFileName;
            const file = bucket.file(newFilePath);

            await file.save(req.file.buffer, {
                metadata: {
                    contentType: req.file.mimetype
                }
            });

            await file.makePublic();
            const imageURL = file.publicUrl();
            updatedData.imageURL = imageURL;
        }

        await docRef.update(updatedData);

        res.send('Documento actualizado correctamente.');
    } catch (error) {
        console.error('Error al actualizar documento:', error);
        res.status(500).send('Error al actualizar documento');
    }
});


// Endpoint para eliminar un documento de Núcleo Académico Básico
router.delete('/nucleoBasico/:id', async (req, res) => {
    const docId = req.params.id;

    try {
        const docRef = firestore.collection('nucleoBasico').doc(docId);
        const docSnapshot = await docRef.get();

        if (!docSnapshot.exists) {
            return res.status(404).send('Documento no encontrado');
        }

        const docData = docSnapshot.data();

        if (docData.imageURL) {
            const imageName = docData.imageURL.split("/").pop();
            const file = bucket.file("nucleoBasico/" + decodeURIComponent(imageName));

            try {
                await file.delete();
                console.log(`Imagen eliminada: ${imageName}`);
            } catch (err) {
                console.warn("No se pudo eliminar la imagen (puede que no exista):", err.message);
            }
        }

        await docRef.delete();

        res.send('Documento e imagen eliminados correctamente.');
    } catch (error) {
        console.error('Error al eliminar documento:', error);
        res.status(500).send('Error al eliminar documento');
    }
});

module.exports = router;
