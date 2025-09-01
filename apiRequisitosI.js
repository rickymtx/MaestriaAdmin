require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const {Router} = require("express");
const {db} = require("./dbFirestore.js");

const router = Router()

// Endpoint para obtener los datos de requisitosIngreso
router.get("/requisitosIngreso", async (req, res) => {
    try {
        const requisitosIngreso = db.collection("requisitosIngreso");
        const snapshot = await requisitosIngreso.get();
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en requisitosIngreso" });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener requisitosIngreso:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para actualizar o crear los datos de requisitosIngreso
router.post("/requisitosIngreso", async (req, res) => {
    try {
        const { antecedentes, requisitos, seleccion } = req.body;

        if (
            !Array.isArray(antecedentes) ||
            !Array.isArray(requisitos) ||
            !Array.isArray(seleccion)
        ) {
            return res.status(400).json({ message: "Todos los campos deben ser arreglos" });
        }

        const requisitosIngresoRef = db.collection("requisitosIngreso");
        const snapshot = await requisitosIngresoRef.get();

        if (snapshot.empty) {
            const nuevoDoc = await requisitosIngresoRef.add({
                antecedentes,
                requisitos,
                seleccion
            });

            return res.status(201).json({
                message: "Documento creado exitosamente",
                id: nuevoDoc.id
            });
        } else {
            const doc = snapshot.docs[0];
            await requisitosIngresoRef.doc(doc.id).set({
                antecedentes,
                requisitos,
                seleccion
            });

            return res.status(200).json({
                message: "Documento actualizado exitosamente",
                id: doc.id
            });
        }
    } catch (error) {
        console.error("Error al crear/actualizar requisitosIngreso:", error);
        res.status(500).json({ error: "Error al crear o actualizar los datos" });
    }
});

// Endpoint para actualizar los datos de requisitosIngreso
router.put("/requisitosIngreso", async (req, res) => {
    try {
        const { antecedentes, requisitos, seleccion } = req.body;

        if (
            !Array.isArray(antecedentes) ||
            !Array.isArray(requisitos) ||
            !Array.isArray(seleccion)
        ) {
            return res.status(400).json({ message: "Todos los campos deben ser arreglos" });
        }

        const requisitosIngresoRef = db.collection("requisitosIngreso");
        const snapshot = await requisitosIngresoRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "No existe ningún documento que actualizar" });
        }

        const doc = snapshot.docs[0];

        await requisitosIngresoRef.doc(doc.id).update({
            antecedentes,
            requisitos,
            seleccion
        });

        return res.status(200).json({
            message: "Documento actualizado exitosamente",
            id: doc.id
        });
    } catch (error) {
        console.error("Error al actualizar requisitosIngreso:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar el documento de requisitosIngreso
router.delete("/requisitosIngreso", async (req, res) => {
    try {
        const requisitosIngresoRef = db.collection("requisitosIngreso");
        const snapshot = await requisitosIngresoRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay documento que eliminar en requisitosIngreso" });
        }

        const doc = snapshot.docs[0];
        await requisitosIngresoRef.doc(doc.id).delete();

        return res.status(200).json({
            message: "Documento eliminado exitosamente",
            id: doc.id
        });
    } catch (error) {
        console.error("Error al eliminar requisitosIngreso:", error);
        res.status(500).json({ error: "Error al eliminar el documento" });
    }
});

module.exports = router;

