const express = require('express');
const cors = require('cors');

const empresaRoutes = require('./routes/empresaRoutes');
const socioRoutes = require('./routes/socioRoutes');
const referenciaRoutes = require('./routes/referenciaRoutes');
const cnpjRoutes = require('./routes/cnpjRoutes');
const salvarTudoRoutes = require('./routes/salvarTudoRoutes');

const app = express();


app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
    console.log(`📌 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/empresa', empresaRoutes);
app.use('/socios', socioRoutes);
app.use('/referencias', referenciaRoutes);
app.use('/cnpj', cnpjRoutes);
app.use('/api/salvarTudo', salvarTudoRoutes);

app.get('/', (req, res) => {
    res.send('✅ API funcionando corretamente!');
});

app.use((req, res) => {
    res.status(404).json({ error: "❌ Rota não encontrada" });
});

module.exports = app;
