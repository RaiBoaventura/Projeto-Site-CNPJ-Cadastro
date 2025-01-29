const express = require("express");
const router = express.Router();
const { salvarTudo } = require("../controllers/salvarTudoController");

// Adicionando log para depuração
console.log("Arquivo salvarTudoRoutes.js carregado.");

// Definição da rota POST para salvar todos os dados
router.post("/", (req, res) => {
    console.log("Rota /api/salvarTudo foi acessada.");
    salvarTudo(req, res);
});

module.exports = router;
