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
                const nome = socio.nome?.trim();
                if (!nome) {
                    console.log("⚠ Sócio ignorado: Nome vazio ou nulo");
                    continue;
                }
            
                console.log("Salvando ou atualizando sócio:", socio);
                await client.query(
                    `INSERT INTO socios (
                        id_empresa, nome, cep, endereco, bairro, cidade, uf, telefone, email, numero
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    ON CONFLICT (id_empresa, nome)
                    DO UPDATE SET
                        cep = EXCLUDED.cep,
                        endereco = EXCLUDED.endereco,
                        bairro = EXCLUDED.bairro,
                        cidade = EXCLUDED.cidade,
                        uf = EXCLUDED.uf,
                        telefone = EXCLUDED.telefone,
                        email = EXCLUDED.email,
                        numero = EXCLUDED.numero`,
                    [
                        pessoaId,
                        nome,
                        socio.cep?.trim() || null,
                        socio.endereco?.trim() || null,
                        socio.bairro?.trim() || null,
                        socio.cidade?.trim() || null,
                        socio.uf?.trim() || null,
                        socio.telefone?.trim() || null,
                        socio.email?.trim() || null,
                        socio.numero?.trim() || null
                    ]
                );
            }
            
            

            for (const ref of commercialRefs) {
                if (!ref.fornecedor?.trim()) {
                    console.log("⚠ Referência comercial ignorada: Fornecedor vazio");
                    continue;
                }
                console.log("Salvando ou atualizando referência comercial:", ref);
                await client.query(
                    `INSERT INTO referenciascomerciais (
                        id_empresa, fornecedor, telefone, ramo_atividade, contato
                    ) VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (id_empresa, fornecedor)
                    DO UPDATE SET
                        telefone = EXCLUDED.telefone,
                        ramo_atividade = EXCLUDED.ramo_atividade,
                        contato = EXCLUDED.contato`,
                    [
                        pessoaId,
                        ref.fornecedor,
                        ref.telefone ?? null,
                        ref.ramo_atividade ?? null,
                        ref.contato ?? null
                    ]
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
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (id_empresa, banco, agencia)
                    DO UPDATE SET
                        conta = EXCLUDED.conta,
                        data_abertura = EXCLUDED.data_abertura,
                        telefone = EXCLUDED.telefone,
                        gerente = EXCLUDED.gerente,
                        observacoes = EXCLUDED.observacoes`,
                    [
                        pessoaId,
                        ref.banco?.trim() || null,
                        ref.agencia?.trim() || null,
                        ref.conta?.trim() || null,
                        ref.dataAbertura ?? null,
                        ref.telefone?.trim() || null,
                        ref.gerente?.trim() || null,
                        ref.observacoes?.trim() || null
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
