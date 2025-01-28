// src/routes/salvarTudoRoutes.js
const express = require("express");
const router = express.Router();
const { salvarTudo } = require("../controllers/salvarTudoController");

// Define a rota POST /salvar-tudo
router.post("/salvar-tudo", salvarTudo);

module.exports = router;
