const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'CNPJ',
    password: 'admin', 
    port: 5432,
});

pool.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao PostgreSQL:', err);
    } else {
        console.log('Conectado ao PostgreSQL com sucesso!');
    }
});

module.exports = pool;
