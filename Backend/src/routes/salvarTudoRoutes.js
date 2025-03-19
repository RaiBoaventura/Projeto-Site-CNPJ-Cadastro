const express = require("express");
const router = express.Router();
const { salvarTudo } = require("../controllers/salvarTudoController");

console.log("Arquivo salvarTudoRoutes.js carregado.");

router.post("/", (req, res) => {
    console.log("Rota /api/salvarTudo foi acessada.");
    salvarTudo(req, res);
});

module.exports = router;
