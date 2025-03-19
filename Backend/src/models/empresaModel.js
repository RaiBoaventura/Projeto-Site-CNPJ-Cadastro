const pool = require('./db');

const getAllEmpresas = async () => {
    const query = 'SELECT * FROM empresa ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
};

const createEmpresa = async (cnpj, razao_social, telefone) => {
    const query = `
        INSERT INTO empresa (cnpj, razao_social, telefone)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const values = [cnpj, razao_social, telefone];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateEmpresa = async (id, cnpj, razao_social, telefone) => {
    const query = `
        UPDATE empresa
        SET cnpj = $1, razao_social = $2, telefone = $3
        WHERE id = $4
    `;
    const values = [cnpj, razao_social, telefone, id];
    const result = await pool.query(query, values);
    return result.rowCount;
};

const deleteEmpresa = async (id) => {
    const query = 'DELETE FROM empresa WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount;
};

module.exports = {
    getAllEmpresas,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
};
