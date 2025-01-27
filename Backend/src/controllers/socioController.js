const pool = require('../models/db'); // Conexão com o banco de dados

// Criar ou atualizar sócios
const saveSocios = async (req, res) => {
    const { id_empresa, socios } = req.body;

    if (!id_empresa || !Array.isArray(socios) || socios.length === 0) {
        return res.status(400).json({
            message: 'ID da empresa e a lista de sócios são obrigatórios.',
        });
    }

    try {
        for (const socio of socios) {
            const query = `
                INSERT INTO socios (
                    id_empresa, nome, endereco, bairro, cidade, uf, telefone, email
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (id_empresa, nome) DO UPDATE SET
                    endereco = EXCLUDED.endereco,
                    bairro = EXCLUDED.bairro,
                    cidade = EXCLUDED.cidade,
                    uf = EXCLUDED.uf,
                    telefone = EXCLUDED.telefone,
                    email = EXCLUDED.email;
            `;
            const values = [
                id_empresa,
                socio.nome,
                socio.endereco,
                socio.bairro,
                socio.cidade,
                socio.uf,
                socio.telefone,
                socio.email,
            ];
            await pool.query(query, values);
        }

        res.status(200).json({ message: 'Sócios salvos com sucesso.' });
    } catch (error) {
        console.error('Erro ao salvar sócios:', error);
        res.status(500).json({
            message: 'Erro ao salvar sócios.',
            error: error.message,
        });
    }
};

// Listar sócios por empresa
const listSociosByEmpresa = async (req, res) => {
    const { id_empresa } = req.params;

    if (!id_empresa) {
        return res.status(400).json({ message: 'ID da empresa é obrigatório.' });
    }

    try {
        const query = 'SELECT * FROM socios WHERE id_empresa = $1 ORDER BY nome ASC';
        const result = await pool.query(query, [id_empresa]);

        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar sócios:', error);
        res.status(500).json({ message: 'Erro ao listar sócios.' });
    }
};

// Remover sócio por nome e ID da empresa
const deleteSocio = async (req, res) => {
    const { id_empresa, nome } = req.body;

    if (!id_empresa || !nome) {
        return res.status(400).json({
            message: 'ID da empresa e o nome do sócio são obrigatórios.',
        });
    }

    try {
        const query = 'DELETE FROM socios WHERE id_empresa = $1 AND nome = $2';
        const result = await pool.query(query, [id_empresa, nome]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Sócio não encontrado.' });
        }

        res.json({ message: 'Sócio removido com sucesso.' });
    } catch (error) {
        console.error('Erro ao remover sócio:', error);
        res.status(500).json({ message: 'Erro ao remover sócio.' });
    }
};

module.exports = {
    saveSocios,
    listSociosByEmpresa,
    deleteSocio,
};
