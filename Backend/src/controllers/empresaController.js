const pool = require('../models/db'); 


const listEmpresas = async (req, res) => {
    try {
        const query = 'SELECT * FROM empresa ORDER BY id ASC';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar empresas:', error);
        res.status(500).json({ message: 'Erro ao listar empresas.' });
    }
};


const createEmpresa = async (req, res) => {
    const { cnpj, razao_social, telefone } = req.body;

    if (!cnpj || !razao_social) {
        return res.status(400).json({ message: 'CNPJ e Razão Social são obrigatórios.' });
    }

    try {
        const query = `
            INSERT INTO empresa (cnpj, razao_social, telefone)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;
        const values = [cnpj, razao_social, telefone];
        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Empresa criada com sucesso.', id: result.rows[0].id });
    } catch (error) {
        console.error('Erro ao criar empresa:', error);
        res.status(500).json({ message: 'Erro ao criar empresa.' });
    }
};


const updateEmpresa = async (req, res) => {
    const { id } = req.params;
    const { cnpj, razao_social, telefone } = req.body;

    if (!id || !cnpj || !razao_social) {
        return res.status(400).json({ message: 'ID, CNPJ e Razão Social são obrigatórios.' });
    }

    try {
        const query = `
            UPDATE empresa
            SET cnpj = $1, razao_social = $2, telefone = $3
            WHERE id = $4
        `;
        const values = [cnpj, razao_social, telefone, id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        res.json({ message: 'Empresa atualizada com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar empresa:', error);
        res.status(500).json({ message: 'Erro ao atualizar empresa.' });
    }
};

const getEmpresaDetalhada = async (req, res) => {
    try {
        console.log("📌 Buscando dados da view vw_empresa_detalhada...");

        const result = await pool.query("SELECT * FROM vw_empresa_detalhada");

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Nenhuma empresa encontrada." });
        }

        console.log("✅ Dados obtidos com sucesso:", result.rows);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("❌ Erro ao buscar empresa detalhada:", error);
        res.status(500).json({ message: "Erro ao buscar empresa detalhada." });
    }
};
// Deletar uma empresa pelo ID
const deleteEmpresa = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID é obrigatório.' });
    }

    try {
        const query = 'DELETE FROM empresa WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        res.json({ message: 'Empresa deletada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar empresa:', error);
        res.status(500).json({ message: 'Erro ao deletar empresa.' });
    }
};

module.exports = {
    listEmpresas,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    getEmpresaDetalhada 
};
