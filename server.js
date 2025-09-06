require('dotenv').config();

const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const morgan = require('morgan');
const {db} = require("./dbFirestore.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({
    credentials: true,
    origin: ['https://maestria-b40dd.web.app', 'http://localhost:5000','http://localhost:5001', 'http://localhost:5500', 'http://192.168.1.70:5000', 'https://maestriaadmin-production.up.railway.app', 'http://172.16.175.48:5000'],
    exposedHeaders: ['set-cookie'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(require("./apiCohorteGen.js"));
app.use(require("./apiContacto.js"));
app.use(require("./apiEgresados.js"));
app.use(require("./apiIndex.js"));
app.use(require("./apiLGyAC.js"));
app.use(require("./apiNucleoAcademico"));
app.use(require("./apiProductividad2.js"));
app.use(require("./apiProductividadTablas.js"));
app.use(require("./apiSintesis.js"));
app.use(require("./apiRequisitosI.js"));
app.use(require("./apiRequisitosP.js"));
app.use(require("./apiRequisitosG.js"));
app.use(require("./apiLogin.js"));


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
