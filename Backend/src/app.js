const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rotas
const empresaRoutes = require('./routes/empresaRoutes');
const socioRoutes = require('./routes/socioRoutes');
const referenciaRoutes = require('./routes/referenciaRoutes');
const cnpjRoutes = require('./routes/cnpjRoutes');
const salvarTudoRoutes = require('./routes/salvarTudoRoutes'); // Confirme que este caminho está correto

const app = express();
app.use((req, res, next) => {
    console.log(`Requisição recebida: ${req.method} ${req.originalUrl}`);
    next();
});

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());

// Configurar rotas
app.use('/empresa', empresaRoutes);
app.use('/socios', socioRoutes);
app.use('/referencias', referenciaRoutes);
app.use('/cnpj', cnpjRoutes);
app.use('/api/salvarTudo', salvarTudoRoutes);



app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
});

// Teste do servidor
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

module.exports = app;
