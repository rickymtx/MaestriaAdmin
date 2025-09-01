require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const {Router} = require("express");
const {db} = require("./dbFirestore.js");

const router = Router()

// Endpoint para obtener los datos de Maestría con Orientación Profesional
router.get("/maestriaOrientacion", async (req, res) => {
    try {
        const sintesisPlanRef = db.collection("maestriaOrientacion"); 
        const snapshot = await sintesisPlanRef.get(); 

        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en maestriaOrientacion" });
        }

        // Convertir los documentos a un array de objetos
        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener los datos de maestriaOrientacion:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para añadir un nuevo documento a maestriaOrientacion
router.post("/maestriaOrientacion", async (req, res) => {
    try {
        const nuevoDato = req.body; 

        if (!nuevoDato || Object.keys(nuevoDato).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("maestriaOrientacion").add(nuevoDato);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a maestriaOrientacion:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar datos de un documento en maestriaOrientacion
router.put("/maestriaOrientacion/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const docRef = db.collection("maestriaOrientacion").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevosDatos);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en maestriaOrientacion:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un documento de maestriaOrientacion por ID
router.delete("/maestriaOrientacion/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("maestriaOrientacion").doc(id);
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

// Endpoint para obtener los datos de Distribución de Asignaturas
router.get("/distribucionAsignaturas", async (req, res) => {
    try {
        const sintesisPlanRef = db.collection("distribucionAsignaturas"); 
        const snapshot = await sintesisPlanRef.get(); 

        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en distribucionAsignaturas" });
        }

        // Convertir los documentos a un array de objetos
        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener los datos de distribucionAsignaturas:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para añadir un nuevo documento a distribucionAsignaturas
router.post("/distribucionAsignaturas", async (req, res) => {
    try {
        const nuevoDato = req.body; 

        if (!nuevoDato || Object.keys(nuevoDato).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("distribucionAsignaturas").add(nuevoDato);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a distribucionAsignaturas:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar datos de un documento en distribucionAsignaturas
router.put("/distribucionAsignaturas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const docRef = db.collection("distribucionAsignaturas").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevosDatos);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en distribucionAsignaturas:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un documento de distribucionAsignaturas por ID
router.delete("/distribucionAsignaturas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("distribucionAsignaturas").doc(id);
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

// Endpoint para obtener los datos de Asignaturas Básicas
router.get("/asignaturasBasicas", async (req, res) => {
    try {
        const sintesisPlanRef = db.collection("asignaturasBasicas");
        const snapshot = await sintesisPlanRef.get(); 

        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en asignaturasBasicas" });
        }

        // Convertir los documentos a un array de objetos
        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener los datos de asignaturasBasicas:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para añadir un nuevo documento a asignaturasBasicas
router.post("/asignaturasBasicas", async (req, res) => {
    try {
        const nuevoDato = req.body; 

        if (!nuevoDato || Object.keys(nuevoDato).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("asignaturasBasicas").add(nuevoDato);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a asignaturasBasicas:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar datos de un documento en asignaturasBasicas
router.put("/asignaturasBasicas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const docRef = db.collection("asignaturasBasicas").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevosDatos);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en asignaturasBasicas:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un documento de asignaturasBasicas por ID
router.delete("/asignaturasBasicas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("asignaturasBasicas").doc(id);
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

// Endpoint para obtener los datos de Asignaturas Optativas
router.get("/asignaturasOptativas", async (req, res) => {
    try {
        const sintesisPlanRef = db.collection("asignaturasOptativas");
        const snapshot = await sintesisPlanRef.get(); 

        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en asignaturasOptativas" });
        }

        // Convertir los documentos a un array de objetos
        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener los datos de asignaturasOptativas:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para añadir un nuevo documento a asignaturasOptativas
router.post("/asignaturasOptativas", async (req, res) => {
    try {
        const nuevoDato = req.body; 

        if (!nuevoDato || Object.keys(nuevoDato).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("asignaturasOptativas").add(nuevoDato);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a asignaturasOptativas:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar datos de un documento en asignaturasOptativas
router.put("/asignaturasOptativas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const docRef = db.collection("asignaturasOptativas").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevosDatos);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en asignaturasOptativas:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un documento de asignaturasOptativas por ID
router.delete("/asignaturasOptativas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("asignaturasOptativas").doc(id);
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
