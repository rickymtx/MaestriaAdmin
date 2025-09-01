require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const {Router} = require("express");
const {db} = require("./dbFirestore.js");

const router = Router()

//Endpoint para obtener datos de tabla Cuerpos Academicos
router.get("/cuerposAcademicos", async (req, res) => {
    try {
        const productividadRef = db.collection("cuerposAcademicos"); 
        const snapshot = await productividadRef.get(); 

        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en cuerposAcademicos" });
        }

        // Convertir los documentos a un array de objetos
        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener cuerposAcademicos:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para añadir un nuevo documento a cuerposAcademicos
router.post("/cuerposAcademicos", async (req, res) => {
    try {
        const nuevoDato = req.body; 

        if (!nuevoDato || Object.keys(nuevoDato).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("cuerposAcademicos").add(nuevoDato);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a cuerposAcademicos:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar datos de un documento en cuerposAcademicos
router.put("/cuerposAcademicos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const docRef = db.collection("cuerposAcademicos").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevosDatos);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en cuerposAcademicos:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un documento de cuerposAcademicos por ID
router.delete("/cuerposAcademicos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("cuerposAcademicos").doc(id);
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

//Endpoint para obtener datos de tabla Sistema Nacional de Investigadoras e Investigadores
router.get("/sistemaNacional", async (req, res) => {
    try {
        const productividadRef = db.collection("sistemaNacional"); 
        const snapshot = await productividadRef.get(); 

        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en sistemaNacional" });
        }

        // Convertir los documentos a un array de objetos
        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos);
    } catch (error) {
        console.error("Error al obtener sistemaNacional:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para actualizar datos de un documento en sistemaNacional
router.put("/sistemaNacional/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const docRef = db.collection("sistemaNacional").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevosDatos);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en sistemaNacional:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

//Endpoint para obtener datos de tabla Perfil Deseable
router.get("/perfilDeseable", async (req, res) => {
    try {
        const productividadRef = db.collection("perfilDeseable"); 
        const snapshot = await productividadRef.get(); 

        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en perfilDeseable" });
        }

        // Convertir los documentos a un array de objetos
        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener perfilDeseable:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para actualizar datos de un documento en perfilDeseable
router.put("/perfilDeseable/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const docRef = db.collection("perfilDeseable").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevosDatos);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en perfilDeseable:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

//Endpoint para obtener datos de tabla Otros Reconocimientos
router.get("/otrosReconocimientos", async (req, res) => {
    try {
        const productividadRef = db.collection("otrosReconocimientos"); 
        const snapshot = await productividadRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en otrosReconocimientos" });
        }

        // Convertir los documentos a un array de objetos
        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener otrosReconocimientos:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para añadir un nuevo documento a otrosReconocimientos
router.post("/otrosReconocimientos", async (req, res) => {
    try {
        const nuevoDato = req.body; 
        
        if (!nuevoDato || Object.keys(nuevoDato).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("otrosReconocimientos").add(nuevoDato);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a otrosReconocimientos:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar datos de un documento en otrosReconocimientos
router.put("/otrosReconocimientos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const docRef = db.collection("otrosReconocimientos").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevosDatos);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en otrosReconocimientos:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un documento de otrosReconocimientos por ID
router.delete("/otrosReconocimientos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("otrosReconocimientos").doc(id);
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

//Endpoint para obtener datos de tabla Convenios Firmados
router.get("/conveniosFirmados", async (req, res) => {
    try {
        const productividadRef = db.collection("conveniosFirmados"); 
        const snapshot = await productividadRef.get(); 

        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en conveniosFirmados" });
        }

        // Convertir los documentos a un array de objetos
        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener conveniosFirmados:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para actualizar datos de un documento en conveniosFirmados
router.put("/conveniosFirmados/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const docRef = db.collection("conveniosFirmados").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevosDatos);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en conveniosFirmados:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

//Endpoint para obtener datos de tabla Participación en redes de investigación científica y tecnológica
router.get("/participacionRedes", async (req, res) => {
    try {
        const productividadRef = db.collection("participacionRedes"); 
        const snapshot = await productividadRef.get(); 
        
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en participacionRedes" });
        }

        // Convertir los documentos a un array de objetos
        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener participacionRedes:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

// Endpoint para añadir un nuevo documento a participacionRedes
router.post("/participacionRedes", async (req, res) => {
    try {
        const nuevoDato = req.body; 
        
        if (!nuevoDato || Object.keys(nuevoDato).length === 0) {
            return res.status(400).json({ message: "Datos inválidos o vacíos" });
        }

        const docRef = await db.collection("participacionRedes").add(nuevoDato);

        res.status(201).json({ message: "Documento añadido correctamente", id: docRef.id });
    } catch (error) {
        console.error("Error al añadir a participacionRedes:", error);
        res.status(500).json({ error: "Error al añadir el documento" });
    }
});

// Endpoint para actualizar datos de un documento en participacionRedes
router.put("/participacionRedes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const docRef = db.collection("participacionRedes").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        await docRef.update(nuevosDatos);

        res.json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento en participacionRedes:", error);
        res.status(500).json({ error: "Error al actualizar los datos" });
    }
});

// Endpoint para eliminar un documento de participacionRedes por ID
router.delete("/participacionRedes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("participacionRedes").doc(id);
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
