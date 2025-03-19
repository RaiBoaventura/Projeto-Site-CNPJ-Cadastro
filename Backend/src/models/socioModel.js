const pool = require('./db');

const saveSocio = async (id_empresa, socio) => {
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
};

const getSociosByEmpresa = async (id_empresa) => {
    const query = 'SELECT * FROM socios WHERE id_empresa = $1 ORDER BY nome ASC';
    const result = await pool.query(query, [id_empresa]);
    return result.rows;
};

const deleteSocio = async (id_empresa, nome) => {
    const query = 'DELETE FROM socios WHERE id_empresa = $1 AND nome = $2';
    const result = await pool.query(query, [id_empresa, nome]);
    return result.rowCount;
};

module.exports = {
    saveSocio,
    getSociosByEmpresa,
    deleteSocio,
};
