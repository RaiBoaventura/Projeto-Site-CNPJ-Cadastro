const { Pool } = require('pg');

// Configuração do banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'CNPJ',
    password: 'admin', // Substitua pela sua senha
    port: 5432,
});

// Testar a conexão
pool.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao PostgreSQL:', err);
    } else {
        console.log('Conectado ao PostgreSQL com sucesso!');
    }
});

module.exports = pool;
