require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error("La variable de entorno GOOGLE_APPLICATION_CREDENTIALS no está definida.");
}

const serviceAccount = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); 

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Bienvenido a la API de Usuarios de la Maestría en Ingeniería");
});

app.get("/usuarios", async (req, res) => {
    try {
        const usuariosRef = db.collection("usuarios");
        const snapshot = await usuariosRef.get();
        if (snapshot.empty) {
            return res.status(404).json({ message: "No hay datos en Usuarios" });
        }

        const datos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
        }));

        res.json(datos); 
    } catch (error) {
        console.error("Error al obtener Usuarios::", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
