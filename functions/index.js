
// functions/index.js
const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Inicializa Firebase Admin (solo una vez)
admin.initializeApp();

const app = express();
app.use(cors({origin: true})); // CORS opcional si usas rewrites
app.use(express.json());

// Importa tu router (ajusta la ruta si está en otra carpeta)
const apiRouter = require("../apiIndex");

// Monta todas las rutas de apiIndex bajo /api
app.use("/api", apiRouter);

// Exporta la función HTTPS
exports.api = onRequest(
    {region: "us-central1"}, // Puedes cambiar región si quieres
    app,
);
