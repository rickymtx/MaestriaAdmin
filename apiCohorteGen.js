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


// Endpoint para obtener los datos de Cohorte Generacional
router.get("/cohorteGeneracional", async (req, res) => {
    try {
        const cohorteGenRef = db.collection("cohorteGeneracional");
        const snapshot = await cohorteGenRef.get();
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en Cohorte Generacional" });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener Cohorte Generacional:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});


// Endpoint para añadir un nuevo documento a Cohorte Generacional
router.post('/cohorteGeneracional', upload.single('imagenCohorte'), async (req, res) => {
  try {
    const { titulo } = req.body;

    if (!req.file) {
      return res.status(400).send("No se ha enviado ninguna imagen.");
    }

    const filePath = `cohorteGeneracional/${req.file.originalname}`;
    const file = bucket.file(filePath);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype
      }
    });

    await file.makePublic();
    const imageURL = file.publicUrl();

    const docData = {
      titulo,
      imagen: imageURL,
      timestamp: new Date()
    };

    await firestore.collection('cohorteGeneracional').add(docData);

    res.status(200).send('Imagen y datos subidos correctamente.');
  } catch (error) {
    console.error('Error al subir datos:', error);
    res.status(500).send('Error al subir imagen y datos');
  }
});


// Endpoint para actualizar documento en Cohorte Generacional
router.put('/cohorteGeneracional/:id', upload.single('imagenCohorte'), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo } = req.body;

    const docRef = firestore.collection('cohorteGeneracional').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: 'Documento no encontrado.' });
    }

    const updateData = {
      titulo,
      timestamp: new Date(),
    };

    if (req.file) {
      const oldData = docSnap.data();

      if (oldData.imagen) {
        const oldImagePath = oldData.imagen.split('/o/')[1]?.split('?')[0];
        if (oldImagePath) {
          const decodedPath = decodeURIComponent(oldImagePath);
          const oldFile = bucket.file(decodedPath);
          await oldFile.delete().catch(() => {
            console.warn('No se pudo eliminar la imagen anterior.');
          });
        }
      }

      const filePath = `cohorteGeneracional/${req.file.originalname}`;
      const file = bucket.file(filePath);

      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      await file.makePublic();
      const imageURL = file.publicUrl();
      updateData.imagen = imageURL;
    }

    await docRef.update(updateData);

    return res.status(200).json({ message: 'Documento actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    return res.status(500).json({ message: 'Error al actualizar documento' });
  }
});


// Endpoint para eliminar un documento de Cohorte Generacional
router.delete('/cohorteGeneracional/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = firestore.collection('cohorteGeneracional').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).send('Documento no encontrado.');
    }

    const docData = docSnap.data();
    const imageURL = docData.imagen;

    await docRef.delete();

    if (imageURL) {
      const baseUrl = 'https://storage.googleapis.com/';
      const bucketName = bucket.name;

      if (imageURL.startsWith(`${baseUrl}${bucketName}/`)) {
        const filePath = imageURL.replace(`${baseUrl}${bucketName}/`, '');
        const file = bucket.file(filePath);

        try {
          await file.delete();
          console.log('Imagen eliminada del Storage:', filePath);
        } catch (storageError) {
          console.warn('Documento eliminado, pero hubo un error al eliminar la imagen del Storage:', storageError.message);
        }
      }
    }

    res.status(200).send('Documento eliminado correctamente.');
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).send('Error al eliminar documento e imagen');
  }
});

module.exports = router;
