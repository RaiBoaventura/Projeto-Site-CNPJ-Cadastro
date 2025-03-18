const pool = require('../models/db');
const fetch = require("node-fetch");

const saveSocios = async (req, res) => {
    const { id_empresa, socios } = req.body;

    if (!id_empresa) {
        return res.status(400).json({ message: "❌ ID da empresa é obrigatório." });
    }

    if (!Array.isArray(socios) || socios.length === 0) {
        return res.status(400).json({ message: "❌ É necessário pelo menos um sócio válido." });
    }

    console.log("🔹 Tentando salvar sócios para a empresa:", id_empresa);

    try {
        const empresaCheck = await pool.query("SELECT id FROM empresa WHERE id = $1", [id_empresa]);
        if (empresaCheck.rows.length === 0) {
            return res.status(404).json({ message: "❌ Empresa não encontrada." });
        }

        for (const socio of socios) {
            if (!socio.nome?.trim()) {
                console.warn("⚠ Sócio ignorado: Nome vazio");
                continue;
            }

            const query = `
                INSERT INTO socios (
                    id_empresa, nome, cep, endereco, numero, bairro, cidade, uf, telefone, email
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT (id_empresa, nome) DO UPDATE SET
                    cep = EXCLUDED.cep,
                    endereco = EXCLUDED.endereco,
                    numero = EXCLUDED.numero,
                    bairro = EXCLUDED.bairro,
                    cidade = EXCLUDED.cidade,
                    uf = EXCLUDED.uf,
                    telefone = EXCLUDED.telefone,
                    email = EXCLUDED.email;
        `;
        
            const values = [
                id_empresa,
                socio.nome,
                socio.cep ?? null,
                socio.endereco ?? null,
                socio.numero ?? null,
                socio.bairro ?? null,
                socio.cidade ?? null,
                socio.uf ?? null,
                socio.telefone ?? null,
                socio.email ?? null
            ];
        
        await pool.query(query, values);
        

            await pool.query(query, values);
            console.log(`✅ Sócio "${socio.nome}" salvo com sucesso!`);
        }

        res.status(200).json({ message: '✅ Sócios salvos com sucesso.' });
    } catch (error) {
        console.error("❌ Erro ao salvar sócios:", error);
        res.status(500).json({
            message: "❌ Erro ao salvar sócios.",
            error: error.message,
        });
    }
};

async function listSociosByEmpresa(req, res) {
    try {
        const cnpj = req.params.id_empresa; 

        if (!cnpj || cnpj.length !== 14) {
            return res.status(400).json({ error: "❌ CNPJ inválido." });
        }

        console.log("📡 Buscando dados da empresa pelo CNPJ:", cnpj);

        const urlBrasilAPI = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;
        const urlReceitaWS = `https://www.receitaws.com.br/v1/cnpj/${cnpj}`;

        let response;
        try {
            response = await fetch(urlBrasilAPI);
        } catch (error) {
            console.warn("⚠️ Erro na BrasilAPI. Tentando ReceitaWS...");
            response = await fetch(urlReceitaWS);
        }

        if (!response.ok) {
            throw new Error(`Erro ao buscar dados da API (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log("📩 Resposta da API:", data);

        if (!data || !data.socios || data.socios.length === 0) {
            return res.status(404).json({ message: "⚠️ Nenhum sócio encontrado para este CNPJ." });
        }

        const socios = data.socios.map((socio) => ({
            nome: socio.nome_socio || socio.nome || "Não informado",
            qualificacao: socio.qualificacao_socio || "Desconhecida",
            cpf_cnpj: socio.cnpj_cpf_do_socio || "Não disponível",
            pais: socio.codigo_pais || "BR",
        }));

        res.json(socios);
    } catch (error) {
        console.error("❌ Erro ao listar sócios:", error);
        res.status(500).json({ error: "Erro ao buscar sócios na API externa." });
    }
}

const deleteSocio = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID do sócio é obrigatório." });
        }

        console.log(`🗑️ Deletando sócio com ID: ${id}`);

        const result = await pool.query("DELETE FROM socios WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Sócio não encontrado." });
        }

        res.status(200).json({ message: "Sócio deletado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao deletar sócio:", error);
        res.status(500).json({ message: "Erro ao deletar sócio." });
    }
};
module.exports = {
    saveSocios,
    listSociosByEmpresa, 
    deleteSocio
};

