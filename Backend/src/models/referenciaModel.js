const pool = require('./db');

// Salvar ou atualizar referências bancárias
const saveBankReference = async (id_empresa, referencia) => {
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
        referencia.banco,
        referencia.agencia,
        referencia.conta,
        referencia.gerente,
        referencia.telefone,
        referencia.data_abertura,
    ];
    await pool.query(query, values);
};

// Salvar ou atualizar referências comerciais
const saveCommercialReference = async (id_empresa, referencia) => {
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
        referencia.fornecedor,
        referencia.telefone,
        referencia.ramo_atividade,
        referencia.contato,
    ];
    await pool.query(query, values);
};

// Listar todas as referências por empresa
const getReferencesByEmpresa = async (id_empresa) => {
    const bankQuery = 'SELECT * FROM referenciasbancarias WHERE id_empresa = $1 ORDER BY banco ASC';
    const commercialQuery = 'SELECT * FROM referenciascomerciais WHERE id_empresa = $1 ORDER BY fornecedor ASC';

    const [bankResult, commercialResult] = await Promise.all([
        pool.query(bankQuery, [id_empresa]),
        pool.query(commercialQuery, [id_empresa]),
    ]);

    return {
        referencias_bancarias: bankResult.rows,
        referencias_comerciais: commercialResult.rows,
    };
};

module.exports = {
    saveBankReference,
    saveCommercialReference,
    getReferencesByEmpresa,
};
