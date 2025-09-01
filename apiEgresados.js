const express = require("express");
const { Router } = require("express");
const { db, bucket } = require("./dbFirestore.js");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); 
const router = Router();

const upload = multer({ storage: multer.memoryStorage() });


// Endpoint para obtener los datos de Egresados
router.get("/egresados", async (req, res) => {
    try {
        const egresadosRef = db.collection("egresados");
        const snapshot = await egresadosRef.get();
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en Egresados" });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener Egresados:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});


// Endpoint para actualizar imagen y guardarlas en Firestore
router.put('/egresados/:id', upload.single('imgEgresados'), async (req, res) => {
    const docId = req.params.id;
    const fileName = req.file.originalname;
    const filePath = `egresados/${fileName}`;
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

        await db.collection('egresados').doc(docId).update({
            image: imageUrl
        });

        res.status(200).send(`Imagen actualizada correctamente. Nueva URL: ${imageUrl}`);
    } catch (error) {
        console.error("Error al actualizar imagen:", error);
        res.status(500).send('Error al actualizar la imagen del egresado.');
    }
});

module.exports = router;
