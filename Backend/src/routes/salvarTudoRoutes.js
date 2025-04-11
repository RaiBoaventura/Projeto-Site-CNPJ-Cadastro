const express = require("express");
const router = express.Router();
const { salvarTudo } = require("../controllers/salvarTudoController");

console.log("Arquivo salvarTudoRoutes.js carregado.");

// POST e PUT para a mesma rota
router.post("/empresa", salvarTudo);
router.put("/empresa", salvarTudo);

module.exports = router;
