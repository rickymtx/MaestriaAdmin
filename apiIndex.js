require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { Router } = require("express");
const { db, bucket } = require("./dbFirestore.js");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const router = Router()
const upload = multer({ storage: multer.memoryStorage() });
const firestore = admin.firestore();


// Endpoint para obtener los datos de portada
router.get("/portada", async (req, res) => {
    try {
        const portada = db.collection("portada");
        const snapshot = await portada.get();
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en portada" });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener portada:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para actualizar documento en Portada
router.put('/portada/:id', upload.single('imagenPortada'), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo } = req.body;

    const docRef = firestore.collection('portada').doc(id);
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

      const filePath = `portada/${req.file.originalname}`;
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


// Endpoint para obtener los datos de Carrusel
router.get("/carrusel", async (req, res) => {
    try {
        const carrusel = db.collection("carrusel");
        const snapshot = await carrusel.get();
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en carrusel" });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener carrusel:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para actualizar los datos de Carrusel
router.put('/carrusel/:id', upload.single('imagen'), async (req, res) => {
  const docId = req.params.id;

  if (!req.file) {
    return res.status(400).send('No se proporcionó ninguna imagen.');
  }

  const fileName = req.file.originalname;
  const filePath = `carrusel/${fileName}`;
  const file = bucket.file(filePath);
  const token = uuidv4();

  try {
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: token
        }
      }
    });

    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media&token=${token}`;

    await db.collection('carrusel').doc(docId).update({
      imagen: imageUrl 
    });

    res.status(200).json({ mensaje: 'Imagen actualizada correctamente.', url: imageUrl });

  } catch (error) {
    console.error('Error al actualizar imagen del carrusel:', error);
    res.status(500).send('Error al actualizar la imagen del carrusel.');
  }
});


// Endpoint para obtener los documentos de Galeria
router.get("/galeria", async (req, res) => {
    try {
        const galeria = db.collection("galeria");
        const snapshot = await galeria.get();
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en galeria" });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener galeria:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para añadir un nuevo documento a galeria
router.post('/galeria', upload.single('imagenGaleria'), async (req, res) => {
  try {
    const { titulo, web } = req.body;

    if (!req.file) {
      return res.status(400).send("No se ha enviado ninguna imagen.");
    }

    const filePath = `galeria/${req.file.originalname}`;
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
      web,
      imagen: imageURL,
      timestamp: new Date()
    };

    await firestore.collection('galeria').add(docData);

    res.status(200).send('Imagen y datos subidos correctamente.');
  } catch (error) {
    console.error('Error al subir datos:', error);
    res.status(500).send('Error al subir imagen y datos');
  }
});

// Endpoint para actualizar documento en galeria
router.put('/galeria/:id', upload.single('imagenGaleria'), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, web } = req.body;

    const docRef = firestore.collection('galeria').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: 'Documento no encontrado.' });
    }

    const updateData = {
      titulo,
      web,
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

      const filePath = `galeria/${req.file.originalname}`;
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


// Endpoint para eliminar un documento de galeria
router.delete('/galeria/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = firestore.collection('galeria').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: 'Documento no encontrado.' });
    }

    const docData = docSnap.data();

    if (docData.imagen) {
      const imagePath = docData.imagen.split('/o/')[1]?.split('?')[0];
      if (imagePath) {
        const decodedPath = decodeURIComponent(imagePath);
        const file = bucket.file(decodedPath);
        await file.delete().catch(() => {
          console.warn('No se pudo eliminar la imagen del bucket.');
        });
      }
    }

    await docRef.delete();

    return res.status(200).json({ message: 'Documento eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    return res.status(500).json({ message: 'Error al eliminar el documento' });
  }
});

// Endpoint para obtener los datos de los Eventos
router.get("/eventos", async (req, res) => {
    try {
        const indexRef = db.collection("eventos");
        const snapshot = await indexRef.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en Eventos" });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener Eventos:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para crear un nuevo Evento
router.post("/eventos", async (req, res) => {
    const { fecha, titulo, lugar, descripcion } = req.body;

    if (!fecha || !titulo || !lugar || !descripcion) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const nuevoEvento = { fecha, titulo, lugar, descripcion };

    try {
        const docRef = await db.collection("eventos").add(nuevoEvento);
        res.status(201).json({ message: "Evento creado exitosamente", id: docRef.id });
    } catch (error) {
        console.error("Error al crear el Evento:", error);
        res.status(500).json({ error: "Error al crear el Evento" });
    }
});

// Endpoint para actualizar un Evento por ID
router.put("/eventos/:id", async (req, res) => {
    const { id } = req.params;
    const nuevosDatos = req.body;

    try {
        const eventoRef = db.collection("eventos").doc(id);
        const doc = await eventoRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        await eventoRef.update(nuevosDatos);
        res.json({ message: "Evento actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar el Evento:", error);
        res.status(500).json({ error: "Error al actualizar el Evento" });
    }
});

// Endpoint para eliminar un Evento por ID
router.delete("/eventos/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const eventoRef = db.collection("eventos").doc(id);
        const doc = await eventoRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        await eventoRef.delete();
        res.json({ message: "Evento eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el Evento:", error);
        res.status(500).json({ error: "Error al eliminar el Evento" });
    }
});

// Endpoint para obtener los datos de los podcast
router.get("/podcast", async (req, res) => {
    try {
        const indexRef = db.collection("podcast");
        const snapshot = await indexRef.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en Podcast" });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener Podcast:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para crear un nuevo Podcast
router.post("/podcast", async (req, res) => {
    const { titulo, descripcion, url } = req.body;

    if (!titulo || !descripcion || !url) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const nuevoPodcast = { titulo, descripcion, url };

    try {
        const docRef = await db.collection("podcast").add(nuevoPodcast);
        res.status(201).json({ message: "Podcast creado exitosamente", id: docRef.id });
    } catch (error) {
        console.error("Error al crear el Podcast:", error);
        res.status(500).json({ error: "Error al crear el Podcast" });
    }
});

// Endpoint para actualizar un Podcast por ID
router.put("/podcast/:id", async (req, res) => {
    const { id } = req.params;
    const nuevosDatos = req.body;

    try {
        const podcastRef = db.collection("podcast").doc(id);
        const doc = await podcastRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Podcast no encontrado" });
        }

        await podcastRef.update(nuevosDatos);
        res.json({ message: "Podcast actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar el Podcast:", error);
        res.status(500).json({ error: "Error al actualizar el Podcast" });
    }
});

// Endpoint para eliminar un Podcast por ID
router.delete("/podcast/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const podcastRef = db.collection("podcast").doc(id);
        const doc = await podcastRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Podcast no encontrado" });
        }

        await podcastRef.delete();
        res.json({ message: "Podcast eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el Podcast:", error);
        res.status(500).json({ error: "Error al eliminar el Podcast" });
    }
});

module.exports = router;
