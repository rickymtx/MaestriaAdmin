const express = require("express");
const { Router } = require("express");
const { db } = require("./dbFirestore.js");
const loggerMiddleware = require("./validation.js");

const router = Router();

router.get("/usuarios", loggerMiddleware, async (req, res) => {
  try {
    const usuarios = db.collection("usuarios");
    const snapshot = await usuarios.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No hay datos en usuarios" });
    }

    const datos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(datos);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener los datos" });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("Email recibido:", email);
  console.log("Password recibido:", password);

  try {
    const usuariosRef = db.collection('usuarios');
    const querySnapshot = await usuariosRef
      .where('correo', '==', email)
      .where('contraseña', '==', password)
      .get();

    if (querySnapshot.empty) {
      return res.status(401).json({ err: 'denegado' });
    }

    res.cookie(
      "accessToken",
      { token: "Validado" },
      {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 2,
      }
    ).json({ ok: 'usuario validado' });

  } catch (error) {
    console.error("Error al verificar usuario:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
