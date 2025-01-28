// src/controllers/salvarTudoController.js

exports.salvarTudo = (req, res) => {
    try {
        const dados = req.body;

        // Lógica de processamento dos dados
        console.log("Dados recebidos:", dados);

        // Enviar uma resposta de sucesso
        res.status(200).json({ mensagem: "Dados salvos com sucesso!" });
    } catch (error) {
        console.error("Erro ao salvar dados:", error);
        res.status(500).json({ mensagem: "Erro ao salvar os dados." });
    }
};
