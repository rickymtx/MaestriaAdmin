require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const {Router} = require("express");
const {db} = require("./dbFirestore.js");

const router = Router()

// Endpoint para obtener los datos de la colección "LGyAC"
router.get("/lgyac", async (req, res) => {
    try {
        const lgyacRef = db.collection("LGyAC"); // Referencia a la colección
        const snapshot = await lgyacRef.get(); // Obtener los documentos

        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en LGyAC" });
        }

        // Convertir los documentos a un array de objetos
        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(datos); // Enviar respuesta con los datos
    } catch (error) {
        console.error("Error al obtener los datos de LGyAC:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Añadir un nuevo documento a LGyAC
router.post("/lgyac", async (req, res) => {
    try {
        const nuevoDato = req.body;

        const docRef = await db.collection("LGyAC").add(nuevoDato);
        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir documento:", error);
        res.status(500).json({ error: "Error al añadir documento" });
    }
});

// Editar un documento existente por ID en LGyAC
router.put("/lgyac/:id", async (req, res) => {
    const { id } = req.params;
    const nuevosDatos = req.body;

    try {
        const docRef = db.collection("LGyAC").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevosDatos);
        res.json({ message: "Documento actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento:", error);
        res.status(500).json({ error: "Error al actualizar documento" });
    }
});

// Eliminar un documento existente por ID en LGyAC
router.delete("/lgyac/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const docRef = db.collection("LGyAC").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.delete();
        res.json({ message: "Documento eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar documento:", error);
        res.status(500).json({ error: "Error al eliminar documento" });
    }
});

module.exports = router;
