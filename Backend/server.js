const app = require('./src/app'); // Importar o app configurado

const PORT = 3000; // Porta onde o servidor vai rodar

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
