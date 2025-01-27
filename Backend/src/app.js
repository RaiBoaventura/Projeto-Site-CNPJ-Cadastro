const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rotas
const empresaRoutes = require('./routes/empresaRoutes');
const socioRoutes = require('./routes/socioRoutes');
const referenciaRoutes = require('./routes/referenciaRoutes');
const cnpjRoutes = require('./routes/cnpjRoutes');

const app = express();

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());

// Configurar rotas
app.use('/empresa', empresaRoutes); // Rotas para empresas
app.use('/socios', socioRoutes); // Rotas para sócios
app.use('/referencias', referenciaRoutes); // Rotas para referências
app.use('/cnpj', cnpjRoutes); // Rotas para busca de CNPJ

// Rota padrão para testar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

module.exports = app;
