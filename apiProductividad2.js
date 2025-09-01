require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const {Router} = require("express");
const {db} = require("./dbFirestore.js");

const router = Router()

// Endpoint para obtener los datos de lgacArticulos
router.get("/lgacArticulos", async (req, res) => {
    try {
        const lgacArticulos = db.collection("lgacArticulos"); 
        const snapshot = await lgacArticulos.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en lgacArticulos " });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener lgacArticulos 2:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo lgacArticulos
router.post("/lgacArticulos", async (req, res) => {
    try {
        const nuevoArticulo = req.body; 
        
        if (!nuevoArticulo || Object.keys(nuevoArticulo).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("lgacArticulos").add(nuevoArticulo);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a lgacArticulos:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un lgacArticulos por ID
router.put("/lgacArticulos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevoArticulo = req.body;

        const docRef = db.collection("lgacArticulos").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevoArticulo);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en lgacArticulos:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un lgacArticulos por ID
router.delete("/lgacArticulos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("lgacArticulos").doc(id);
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

// Endpoint para obtener los datos de lgacCapitulos
router.get("/lgacCapitulos", async (req, res) => {
    try {
        const lgacCapitulos = db.collection("lgacCapitulos"); 
        const snapshot = await lgacCapitulos.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en lgacCapitulos " });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener lgacCapitulos 2:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo lgacCapitulos
router.post("/lgacCapitulos", async (req, res) => {
    try {
        const nuevoCapitulo = req.body; 
        
        if (!nuevoCapitulo || Object.keys(nuevoCapitulo).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("lgacCapitulos").add(nuevoCapitulo);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a lgacCapitulos:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un lgacCapitulos por ID
router.put("/lgacCapitulos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevoCapitulo = req.body;

        const docRef = db.collection("lgacCapitulos").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevoCapitulo);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en lgacCapitulos:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un lgacCapitulos por ID
router.delete("/lgacCapitulos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("lgacCapitulos").doc(id);
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

// Endpoint para obtener los datos de lgacProyectos
router.get("/lgacProyectos", async (req, res) => {
    try {
        const lgacProyectos = db.collection("lgacProyectos"); 
        const snapshot = await lgacProyectos.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en lgacProyectos " });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener lgacProyectos 2:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo lgacProyectos
router.post("/lgacProyectos", async (req, res) => {
    try {
        const nuevoProyecto = req.body; 
        
        if (!nuevoProyecto || Object.keys(nuevoProyecto).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("lgacProyectos").add(nuevoProyecto);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a lgacProyectos:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un lgacProyectos por ID
router.put("/lgacProyectos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevoProyecto = req.body;

        const docRef = db.collection("lgacProyectos").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevoProyecto);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en lgacProyectos:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un lgacProyectos por ID
router.delete("/lgacProyectos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("lgacProyectos").doc(id);
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

// Endpoint para obtener los datos de lgacArticulos2
router.get("/lgacArticulos2", async (req, res) => {
    try {
        const lgacArticulos2 = db.collection("lgacArticulos2"); 
        const snapshot = await lgacArticulos2.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en lgacArticulos2 " });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener lgacArticulos2 2:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo lgacArticulos2
router.post("/lgacArticulos2", async (req, res) => {
    try {
        const nuevoArticulo2 = req.body; 
        
        if (!nuevoArticulo2 || Object.keys(nuevoArticulo2).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("lgacArticulos2").add(nuevoArticulo2);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a lgacArticulos2:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un lgacArticulos2 por ID
router.put("/lgacArticulos2/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevoArticulo2 = req.body;

        const docRef = db.collection("lgacArticulos2").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevoArticulo2);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en lgacArticulos2:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un lgacArticulos2 por ID
router.delete("/lgacArticulos2/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("lgacArticulos2").doc(id);
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

// Endpoint para obtener los datos de lgacCapitulos2
router.get("/lgacCapitulos2", async (req, res) => {
    try {
        const lgacCapitulos2 = db.collection("lgacCapitulos2"); 
        const snapshot = await lgacCapitulos2.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en lgacCapitulos2 " });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener lgacCapitulos2 2:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo lgacCapitulos2
router.post("/lgacCapitulos2", async (req, res) => {
    try {
        const nuevoCapitulo2 = req.body; 
        
        if (!nuevoCapitulo2 || Object.keys(nuevoCapitulo2).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("lgacCapitulos2").add(nuevoCapitulo2);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a lgacCapitulos2:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un lgacCapitulos2 por ID
router.put("/lgacCapitulos2/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevoCapitulo2 = req.body;

        const docRef = db.collection("lgacCapitulos2").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevoCapitulo2);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en lgacCapitulos2:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un lgacCapitulos2 por ID
router.delete("/lgacCapitulos2/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("lgacCapitulos2").doc(id);
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

// Endpoint para obtener los datos de lgacProyectos2
router.get("/lgacProyectos2", async (req, res) => {
    try {
        const lgacProyectos2 = db.collection("lgacProyectos2"); 
        const snapshot = await lgacProyectos2.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en lgacProyectos2 " });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener lgacProyectos2 2:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo lgacProyectos2
router.post("/lgacProyectos2", async (req, res) => {
    try {
        const nuevoProyecto2 = req.body; 
        
        if (!nuevoProyecto2 || Object.keys(nuevoProyecto2).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("lgacProyectos2").add(nuevoProyecto2);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a lgacProyectos2:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un lgacProyectos2 por ID
router.put("/lgacProyectos2/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevoProyecto2 = req.body;

        const docRef = db.collection("lgacProyectos2").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevoProyecto2);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en lgacProyectos2:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un lgacProyectos2 por ID
router.delete("/lgacProyectos2/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("lgacProyectos2").doc(id);
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

// Endpoint para obtener los datos de lgacArticulos3
router.get("/lgacArticulos3", async (req, res) => {
    try {
        const lgacArticulos3 = db.collection("lgacArticulos3"); 
        const snapshot = await lgacArticulos3.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en lgacArticulos3 " });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener lgacArticulos3 2:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo lgacArticulos3
router.post("/lgacArticulos3", async (req, res) => {
    try {
        const nuevoArticulo3 = req.body; 
        
        if (!nuevoArticulo3 || Object.keys(nuevoArticulo3).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("lgacArticulos3").add(nuevoArticulo3);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a lgacArticulos3:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un lgacArticulos3 por ID
router.put("/lgacArticulos3/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevoArticulo3 = req.body;

        const docRef = db.collection("lgacArticulos3").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevoArticulo3);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en lgacArticulos3:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un lgacArticulos3 por ID
router.delete("/lgacArticulos3/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("lgacArticulos3").doc(id);
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

// Endpoint para obtener los datos de lgacCapitulos3
router.get("/lgacCapitulos3", async (req, res) => {
    try {
        const lgacCapitulos3 = db.collection("lgacCapitulos3"); 
        const snapshot = await lgacCapitulos3.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en lgacCapitulos3 " });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener lgacCapitulos3 2:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo lgacCapitulos3
router.post("/lgacCapitulos3", async (req, res) => {
    try {
        const nuevoCapitulos3 = req.body; 
        
        if (!nuevoCapitulos3 || Object.keys(nuevoCapitulos3).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("lgacCapitulos3").add(nuevoCapitulos3);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a lgacCapitulos3:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un lgacCapitulos3 por ID
router.put("/lgacCapitulos3/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevoCapitulos3 = req.body;

        const docRef = db.collection("lgacCapitulos3").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevoCapitulos3);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en lgacCapitulos3:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un lgacCapitulos3 por ID
router.delete("/lgacCapitulos3/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("lgacCapitulos3").doc(id);
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

// Endpoint para obtener los datos de lgacProyectos3
router.get("/lgacProyectos3", async (req, res) => {
    try {
        const lgacProyectos3 = db.collection("lgacProyectos3"); 
        const snapshot = await lgacProyectos3.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en lgacProyectos3 " });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener lgacProyectos3 2:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo lgacProyectos3
router.post("/lgacProyectos3", async (req, res) => {
    try {
        const nuevoProyecto3 = req.body; 
        
        if (!nuevoProyecto3 || Object.keys(nuevoProyecto3).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("lgacProyectos3").add(nuevoProyecto3);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a lgacProyectos3:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un lgacProyectos3 por ID
router.put("/lgacProyectos3/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevoProyecto3 = req.body;

        const docRef = db.collection("lgacProyectos3").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevoProyecto3);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en lgacProyectos3:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un lgacProyectos3 por ID
router.delete("/lgacProyectos3/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("lgacProyectos3").doc(id);
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

// Endpoint para obtener los datos de lgacArticulos4
router.get("/lgacArticulos4", async (req, res) => {
    try {
        const lgacArticulos4 = db.collection("lgacArticulos4"); 
        const snapshot = await lgacArticulos4.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en lgacArticulos4 " });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener lgacProyectos3 2:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo lgacArticulos4
router.post("/lgacArticulos4", async (req, res) => {
    try {
        const nuevoArticulo4 = req.body; 
        
        if (!nuevoArticulo4 || Object.keys(nuevoArticulo4).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("lgacArticulos4").add(nuevoArticulo4);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a lgacArticulos4:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un lgacArticulos4 por ID
router.put("/lgacArticulos4/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevoArticulo4 = req.body;

        const docRef = db.collection("lgacArticulos4").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevoArticulo4);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en lgacArticulos4:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un lgacArticulos4 por ID
router.delete("/lgacArticulos4/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("lgacArticulos4").doc(id);
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

// Endpoint para obtener los datos de lgacCapitulos4
router.get("/lgacCapitulos4", async (req, res) => {
    try {
        const lgacCapitulos4 = db.collection("lgacCapitulos4"); 
        const snapshot = await lgacCapitulos4.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en lgacCapitulos4 " });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener lgacProyectos3 2:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo lgacCapitulos4
router.post("/lgacCapitulos4", async (req, res) => {
    try {
        const nuevoCapitulo4 = req.body; 
        
        if (!nuevoCapitulo4 || Object.keys(nuevoCapitulo4).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("lgacCapitulos4").add(nuevoCapitulo4);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a lgacCapitulos4:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un lgacCapitulos4 por ID
router.put("/lgacCapitulos4/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevoCapitulo4 = req.body;

        const docRef = db.collection("lgacCapitulos4").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevoCapitulo4);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en lgacCapitulos4:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un lgacCapitulos4 por ID
router.delete("/lgacCapitulos4/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("lgacCapitulos4").doc(id);
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

// Endpoint para obtener los datos de lgacProyectos4
router.get("/lgacProyectos4", async (req, res) => {
    try {
        const lgacProyectos4 = db.collection("lgacProyectos4"); 
        const snapshot = await lgacProyectos4.get(); 
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en lgacProyectos4 " });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener lgacProyectos3 2:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para agregar un nuevo lgacProyectos4
router.post("/lgacProyectos4", async (req, res) => {
    try {
        const nuevoProyecto4 = req.body; 
        
        if (!nuevoProyecto4 || Object.keys(nuevoProyecto4).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("lgacProyectos4").add(nuevoProyecto4);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a lgacProyectos4:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar un lgacProyectos4 por ID
router.put("/lgacProyectos4/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevoProyecto4 = req.body;

        const docRef = db.collection("lgacProyectos4").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevoProyecto4);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en lgacProyectos4:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un lgacProyectos4 por ID
router.delete("/lgacProyectos4/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("lgacProyectos4").doc(id);
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
