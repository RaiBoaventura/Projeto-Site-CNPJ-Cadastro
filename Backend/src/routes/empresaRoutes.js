const express = require('express');
const {
    listEmpresas,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    getEmpresaDetalhada
} = require('../controllers/empresaController');

const router = express.Router();

// Rota para listar todas as empresas
router.get('/', listEmpresas);

// Rota para criar uma nova empresa
router.post('/', createEmpresa);

// Rota para atualizar uma empresa
router.put('/:id', updateEmpresa);

// Rota para deletar uma empresa
router.delete('/:id', deleteEmpresa);

router.get("/vw_empresa_detalhada", getEmpresaDetalhada); // 🔥 Adicionando a rota correta

module.exports = router;
