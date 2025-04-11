const pool = require('../models/db');
const empresaModel = require("../models/empresaModel");

const salvarTudo = async (req, res) => {
    try {
        console.log("Recebendo dados no body:", JSON.stringify(req.body, null, 2));

        const { pessoaJuridica, socios, commercialRefs, bankRefs } = req.body;

        if (!pessoaJuridica || !pessoaJuridica.cnpj?.trim() || !pessoaJuridica.razao_social?.trim()) {
            return res.status(400).json({ message: "Os dados da Pessoa Jurídica são obrigatórios." });
        }
        if (!Array.isArray(socios) || socios.length === 0) {
            return res.status(400).json({ message: "É necessário pelo menos um sócio." });
        }
        if (!Array.isArray(commercialRefs) || commercialRefs.length === 0) {
            return res.status(400).json({ message: "Adicione pelo menos uma referência comercial." });
        }
        if (!Array.isArray(bankRefs) || bankRefs.length === 0) {
            return res.status(400).json({ message: "Adicione pelo menos uma referência bancária." });
        }

        console.log("Iniciando transação no banco de dados...");
        const client = await pool.connect();
        
        try {
            await client.query("BEGIN");

            console.log("Verificando se a empresa já existe...");
            const checkEmpresa = await client.query(
                `SELECT id FROM empresa WHERE cnpj = $1`,
                [pessoaJuridica.cnpj]
            );
            
            let pessoaId;
            
            if (checkEmpresa.rows.length > 0) {
                pessoaId = checkEmpresa.rows[0].id;
                console.log(`Empresa existente encontrada (ID: ${pessoaId}). Atualizando...`);
                
                await client.query(
                    `UPDATE empresa SET 
                        razao_social = $1,
                        nome_fantasia = $2,
                        inscricao_estadual = $3,
                        ramo_atividade = $4,
                        data_fundacao = $5,
                        capital_social = $6,
                        conta_bancaria = $7,
                        email = $8,
                        site = $9,
                        contador = $10,
                        logradouro = $11,
                        numero_complemento = $12,
                        bairro = $13,
                        cidade = $14,
                        uf = $15,
                        telefone = $16,
                        telefone_contador = $17
                    WHERE cnpj = $18`,
                    [
                        pessoaJuridica.razao_social,
                        pessoaJuridica.nome_fantasia ?? null,
                        pessoaJuridica.inscricao_estadual ?? null,
                        pessoaJuridica.ramo_atividade ?? null,
                        pessoaJuridica.data_fundacao ?? null,
                        pessoaJuridica.capital_social ?? null,
                        pessoaJuridica.conta_bancaria ?? null,
                        pessoaJuridica.email ?? null,
                        pessoaJuridica.site ?? null,
                        pessoaJuridica.contador ?? null,
                        pessoaJuridica.logradouro ?? null,
                        pessoaJuridica.numero_complemento ?? null,
                        pessoaJuridica.bairro ?? null,
                        pessoaJuridica.cidade ?? null,
                        pessoaJuridica.uf ?? null,
                        pessoaJuridica.telefone ?? null,
                        pessoaJuridica.telefone_contador ?? null,
                        pessoaJuridica.cnpj
                    ]
                );
            
            } else {
                console.log("Empresa nova. Inserindo...");
                const pessoaResult = await client.query(
                    `INSERT INTO empresa (
                        cnpj, razao_social, nome_fantasia, inscricao_estadual, ramo_atividade,
                        data_fundacao, capital_social, conta_bancaria, email, site, contador, 
                        logradouro, numero_complemento, bairro, cidade, uf, telefone, telefone_contador
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
                    RETURNING id`,
                    [
                        pessoaJuridica.cnpj,
                        pessoaJuridica.razao_social,
                        pessoaJuridica.nome_fantasia ?? null,
                        pessoaJuridica.inscricao_estadual ?? null,
                        pessoaJuridica.ramo_atividade ?? null,
                        pessoaJuridica.data_fundacao ?? null,
                        pessoaJuridica.capital_social ?? null,
                        pessoaJuridica.conta_bancaria ?? null,
                        pessoaJuridica.email ?? null,
                        pessoaJuridica.site ?? null,
                        pessoaJuridica.contador ?? null,
                        pessoaJuridica.logradouro ?? null,
                        pessoaJuridica.numero_complemento ?? null,
                        pessoaJuridica.bairro ?? null,
                        pessoaJuridica.cidade ?? null,
                        pessoaJuridica.uf ?? null,
                        pessoaJuridica.telefone ?? null,
                        pessoaJuridica.telefone_contador ?? null
                    ]
                );
            
                pessoaId = pessoaResult.rows[0]?.id;
                if (!pessoaId) throw new Error("Falha ao inserir Pessoa Jurídica");
            }
            

            for (const socio of socios) {
                if (!socio.nome?.trim()) {
                    console.log("⚠ Sócio ignorado: Nome vazio");
                    continue;
                }
                console.log("Salvando sócio:", socio);
                await client.query(
                    `INSERT INTO socios (
                        id_empresa, nome, cep, endereco, bairro, cidade, uf, telefone, email, numero
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                    [
                        pessoaId,
                        socio.nome,
                        socio.cep ?? null,
                        socio.endereco ?? null,
                        socio.bairro ?? null,
                        socio.cidade ?? null,
                        socio.uf ?? null,
                        socio.telefone ?? null,
                        socio.email ?? null,
                        socio.numero ?? null
                    ]
                );
            }

            for (const ref of commercialRefs) {
                if (!ref.fornecedor?.trim()) {
                    console.log("⚠ Referência comercial ignorada: Fornecedor vazio");
                    continue;
                }
                console.log("Salvando referência comercial:", ref);
                await client.query(
                    `INSERT INTO referenciascomerciais (
                        id_empresa, fornecedor, telefone, ramo_atividade, contato
                    ) VALUES ($1, $2, $3, $4, $5)`,
                    [pessoaId, ref.fornecedor, ref.telefone ?? null, ref.ramo_atividade ?? null, ref.contato ?? null]
                );
            }

            for (const ref of bankRefs) {
                if (!ref.banco?.trim() || !ref.agencia?.trim() || !ref.conta?.trim()) {
                    console.log("⚠ Referência bancária ignorada: Dados obrigatórios ausentes");
                    continue;
                }
                console.log("Salvando referência bancária:", ref);
                await client.query(
                    `INSERT INTO referenciasbancarias (
                        id_empresa, banco, agencia, conta, data_abertura, telefone, gerente, observacoes
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [
                        pessoaId,
                        ref.banco,
                        ref.agencia,
                        ref.conta,
                        ref.dataAbertura ?? null,
                        ref.telefone ?? null,
                        ref.gerente ?? null,
                        ref.observacoes ?? null
                    ]
                );
            }

            await client.query("COMMIT");
            console.log("✅ Transação concluída com sucesso!");
            return res.status(200).json({ message: "Dados salvos com sucesso!" });

        } catch (error) {
            await client.query("ROLLBACK");
            console.error("❌ Erro na transação:", error);
            return res.status(500).json({ message: "Erro ao salvar os dados no servidor." });

        } finally {
            client.release();
        }

    } catch (error) {
        console.error("❌ Erro geral:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

console.log("⚡ Função salvarTudo foi carregada!");
module.exports = { salvarTudo };
