const pool = require('../models/db'); // Conexão com o banco de dados

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
        // Verificar se a empresa existe antes de inserir os sócios
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
                socio.endereco ?? null,
                socio.bairro ?? null,
                socio.cidade ?? null,
                socio.uf ?? null,
                socio.telefone ?? null,
                socio.email ?? null,
            ];

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

// 🔹 Função para listar sócios por ID da empresa
async function listSociosByEmpresa(req, res) {
    try {
        const idEmpresa = parseInt(req.params.id_empresa, 10);
        if (isNaN(idEmpresa)) {
            return res.status(400).json({ error: "ID da empresa inválido" });
        }
        
        console.log("📌 Buscando sócios para empresa com ID:", idEmpresa);

        const query = `SELECT * FROM socios WHERE id_empresa = $1`;
        const result = await db.query(query, [idEmpresa]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Nenhum sócio encontrado." });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("❌ Erro ao listar sócios:", error);
        res.status(500).json({ error: "Erro ao listar sócios" });
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
    listSociosByEmpresa,  // 🔹 Certifique-se de que esta função está aqui
    deleteSocio
};

