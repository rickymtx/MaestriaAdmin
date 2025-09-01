require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const {Router} = require("express");
const {db} = require("./dbFirestore.js");

const router = Router() 

// Endpoint para obtener los datos de Contacto
router.get("/contacto", async (req, res) => {
    try {
        const productividadRef = db.collection("contacto"); 
        const snapshot = await productividadRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en contacto" });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener contacto:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo contacto
router.post("/contacto", async (req, res) => {
    try {
        const nuevoDato = req.body; 
        
        if (!nuevoDato || Object.keys(nuevoDato).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("contacto").add(nuevoDato);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a contacto:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un contacto por ID
router.put("/contacto/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const docRef = db.collection("contacto").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevosDatos);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en contacto:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un contacto por ID
router.delete("/contacto/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("contacto").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.delete();
        res.json({ message: "Documento eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el documento:", error);
        res.status(500).json({ error: "Error al eliminar el documento" });
    }
});

module.exports = router;
