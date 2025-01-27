const pool = require('../models/db'); // Conexão com o banco de dados

// Salvar ou atualizar referências bancárias
const saveBankReferences = async (req, res) => {
    const { id_empresa, referencias_bancarias } = req.body;

    if (!id_empresa || !Array.isArray(referencias_bancarias) || referencias_bancarias.length === 0) {
        return res.status(400).json({
            message: 'ID da empresa e as referências bancárias são obrigatórios.',
        });
    }

    try {
        for (const ref of referencias_bancarias) {
            const query = `
                INSERT INTO referenciasbancarias (
                    id_empresa, banco, agencia, conta, gerente, telefone, data_abertura
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id_empresa, banco, agencia) DO UPDATE SET
                    conta = EXCLUDED.conta,
                    gerente = EXCLUDED.gerente,
                    telefone = EXCLUDED.telefone,
                    data_abertura = EXCLUDED.data_abertura;
            `;
            const values = [
                id_empresa,
                ref.banco,
                ref.agencia,
                ref.conta,
                ref.gerente,
                ref.telefone,
                ref.data_abertura,
            ];
            await pool.query(query, values);
        }

        res.status(200).json({ message: 'Referências bancárias salvas com sucesso.' });
    } catch (error) {
        console.error('Erro ao salvar referências bancárias:', error);
        res.status(500).json({
            message: 'Erro ao salvar referências bancárias.',
            error: error.message,
        });
    }
};

// Salvar ou atualizar referências comerciais
const saveCommercialReferences = async (req, res) => {
    const { id_empresa, referencias_comerciais } = req.body;

    if (!id_empresa || !Array.isArray(referencias_comerciais) || referencias_comerciais.length === 0) {
        return res.status(400).json({
            message: 'ID da empresa e as referências comerciais são obrigatórios.',
        });
    }

    try {
        for (const ref of referencias_comerciais) {
            const query = `
                INSERT INTO referenciascomerciais (
                    id_empresa, fornecedor, telefone, ramo_atividade, contato
                ) VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (id_empresa, fornecedor) DO UPDATE SET
                    telefone = EXCLUDED.telefone,
                    ramo_atividade = EXCLUDED.ramo_atividade,
                    contato = EXCLUDED.contato;
            `;
            const values = [
                id_empresa,
                ref.fornecedor,
                ref.telefone,
                ref.ramo_atividade,
                ref.contato,
            ];
            await pool.query(query, values);
        }

        res.status(200).json({ message: 'Referências comerciais salvas com sucesso.' });
    } catch (error) {
        console.error('Erro ao salvar referências comerciais:', error);
        res.status(500).json({
            message: 'Erro ao salvar referências comerciais.',
            error: error.message,
        });
    }
};

// Listar todas as referências bancárias e comerciais de uma empresa
const listReferencesByEmpresa = async (req, res) => {
    const { id_empresa } = req.params;

    if (!id_empresa) {
        return res.status(400).json({ message: 'ID da empresa é obrigatório.' });
    }

    try {
        const bankQuery = 'SELECT * FROM referenciasbancarias WHERE id_empresa = $1 ORDER BY banco ASC';
        const commercialQuery = 'SELECT * FROM referenciascomerciais WHERE id_empresa = $1 ORDER BY fornecedor ASC';

        const [bankResult, commercialResult] = await Promise.all([
            pool.query(bankQuery, [id_empresa]),
            pool.query(commercialQuery, [id_empresa]),
        ]);

        res.json({
            referencias_bancarias: bankResult.rows,
            referencias_comerciais: commercialResult.rows,
        });
    } catch (error) {
        console.error('Erro ao listar referências:', error);
        res.status(500).json({ message: 'Erro ao listar referências.' });
    }
};

module.exports = {
    saveBankReferences,
    saveCommercialReferences,
    listReferencesByEmpresa,
};
