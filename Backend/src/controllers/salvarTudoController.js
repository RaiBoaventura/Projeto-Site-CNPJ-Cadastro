const pool = require('../models/db');


const salvarTudo = async (req, res) => {
    try {
        console.log("Recebendo dados no body:", req.body); // Log do corpo recebido
        const { pessoaJuridica, socios, commercialRefs, bankRefs } = req.body;
        if (!pessoaJuridica || !socios || !commercialRefs || !bankRefs) {
            console.log("Erro: Dados incompletos fornecidos.");
            return res.status(400).json({ message: "Dados incompletos fornecidos." });
              }
        console.log("Iniciando transação no banco de dados...");
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            console.log("Salvando Pessoa Jurídica...");
            const pessoaResult = await client.query(
                "INSERT INTO pessoa_juridica (cnpj, razao_social) VALUES ($1, $2) RETURNING id",
                [pessoaJuridica.cnpj, pessoaJuridica.razao_social]
            );
            const pessoaId = pessoaResult.rows[0]?.id;
            console.log("Pessoa Jurídica salva com ID:", pessoaId);
            if (!pessoaId) throw new Error("Falha ao salvar Pessoa Jurídica");

            // Salvando Sócios
            for (const socio of socios) {
                console.log("Salvando sócio:", socio);
                await client.query(
                    "INSERT INTO socios (pessoa_juridica_id, nome, email) VALUES ($1, $2, $3)",
                    [pessoaId, socio.nome, socio.email]
                );
            }
            // Salvando Referências Comerciais
            for (const ref of commercialRefs) {
                console.log("Salvando referência comercial:", ref);
                await client.query(
                    "INSERT INTO referencias_comerciais (pessoa_juridica_id, fornecedor, telefone) VALUES ($1, $2, $3)",
                    [pessoaId, ref.fornecedor, ref.telefone]
                );
            }
            // Salvando Referências Bancárias
            for (const ref of bankRefs) {
                console.log("Salvando referência bancária:", ref);
                await client.query(
                    "INSERT INTO referencias_bancarias (pessoa_juridica_id, banco, agencia, conta) VALUES ($1, $2, $3, $4)",
                    [pessoaId, ref.banco, ref.agencia, ref.conta]
                );
            }
            await client.query("COMMIT");
            console.log("Transação concluída com sucesso!");
            return res.status(200).json({ message: "Dados salvos com sucesso!" });
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Erro na transação:", error);
            return res.status(500).json({ message: "Erro ao salvar os dados no servidor." });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Erro geral:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

console.log("Função salvarTudo foi chamada!");
module.exports = { salvarTudo };