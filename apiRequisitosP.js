require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const {Router} = require("express");
const {db} = require("./dbFirestore.js");

const router = Router()

// Endpoint para obtener los datos de requisitosPermanencia
router.get("/requisitosPermanencia", async (req, res) => {
    try {
        const requisitosPermanencia = db.collection("requisitosPermanencia");
        const snapshot = await requisitosPermanencia.get();
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en requisitosPermanencia" });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener requisitosPermanencia:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Agrega un nuevo requisito al array "requisitos" de un documento existente
router.post("/requisitosPermanencia/:id", async (req, res) => {
    try {
        const docId = req.params.id;
        const nuevoRequisito = req.body.requisito; 

        if (!nuevoRequisito) {
            return res.status(400).json({ message: "El campo 'requisito' es obligatorio" });
        }

        const docRef = db.collection("requisitosPermanencia").doc(docId);

        await docRef.update({
            requisitos: admin.firestore.FieldValue.arrayUnion(nuevoRequisito)
        });

        res.status(200).json({ message: "Requisito añadido correctamente al documento" });
    } catch (error) {
        console.error("Error al actualizar el documento:", error);
        res.status(500).json({ error: "Error al añadir el requisito" });
    }
});

// Endpoint para editar un requisito específico en el array "requisitos" de un documento existente
router.put("/requisitosPermanencia/:id", async (req, res) => {
    try {
        const docId = req.params.id;
        const { index, nuevoRequisito } = req.body; 

        if (typeof index !== 'number' || !nuevoRequisito) {
            return res.status(400).json({ message: "Se requiere 'index' (número) y 'nuevoRequisito' (texto)" });
        }

        const docRef = db.collection("requisitosPermanencia").doc(docId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        let requisitos = docSnap.data().requisitos || [];

        if (index < 0 || index >= requisitos.length) {
            return res.status(400).json({ message: "Índice fuera de rango" });
        }

        requisitos[index] = nuevoRequisito;

        await docRef.update({ requisitos });

        res.status(200).json({ message: "Requisito actualizado correctamente", requisitos });
    } catch (error) {
        console.error("Error al actualizar el requisito:", error);
        res.status(500).json({ error: "Error al actualizar el requisito" });
    }
});

// Endpoint para eliminar un requisito específico del array "requisitos" de un documento
router.delete("/requisitosPermanencia/:id", async (req, res) => {
    try {
        const docId = req.params.id;
        const { index } = req.body;

        if (typeof index !== 'number') {
            return res.status(400).json({ message: "Se requiere 'index' (número) en el cuerpo" });
        }

        const docRef = db.collection("requisitosPermanencia").doc(docId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        let requisitos = docSnap.data().requisitos || [];

        if (index < 0 || index >= requisitos.length) {
            return res.status(400).json({ message: "Índice fuera de rango" });
        }

        requisitos.splice(index, 1);

        await docRef.update({ requisitos });

        res.status(200).json({ message: "Requisito eliminado correctamente", requisitos });
    } catch (error) {
        console.error("Error al eliminar el requisito:", error);
        res.status(500).json({ error: "Error al eliminar el requisito" });
    }
});

module.exports = router;
