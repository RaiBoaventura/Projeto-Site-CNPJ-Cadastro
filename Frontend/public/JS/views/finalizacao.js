// Corrigido finalizacao.js (função carregarDados e envio de payload)
document.addEventListener("DOMContentLoaded", () => {
    const dadosEmpresaDiv = document.getElementById("dadosEmpresa");
    const dadosSociosDiv = document.getElementById("dadosSocios");
    const dadosComerciaisDiv = document.getElementById("dadosComerciais");
    const dadosBancariasDiv = document.getElementById("dadosBancarias");
    const confirmarCadastroBtn = document.getElementById("confirmarCadastro");

    function removerCamposIncompletos(arr, camposObrigatorios) {
        return arr.filter(obj =>
            camposObrigatorios.every(campo => {
                const val = obj[campo];
                return val !== null && val !== undefined && String(val).trim() !== "";
            })
        );
    }

    function carregarDados() {
        const empresa = JSON.parse(localStorage.getItem("pessoaJuridica")) || {};
        const socios = JSON.parse(localStorage.getItem("sociosData")) || [];
        const referenciasComerciais = JSON.parse(localStorage.getItem("commercialRefs")) || [];
        const referenciasBancarias = JSON.parse(localStorage.getItem("bankRefs")) || [];

        if (Object.keys(empresa).length === 0) {
            alert("Nenhum dado encontrado. Volte e preencha os dados.");
            window.location.href = "index.html"; 
            return;
        }

        dadosEmpresaDiv.innerHTML = `
            <p><strong>Razão Social:</strong> ${empresa.razao_social || "N/A"}</p>
            <p><strong>Nome Fantasia:</strong> ${empresa.nome_fantasia || "N/A"}</p>
            <p><strong>CNPJ:</strong> ${empresa.cnpj || "N/A"}</p>
            <p><strong>Ramo de Atividade:</strong> ${empresa.ramo_atividade || "N/A"}</p>
            <p><strong>Telefone:</strong> ${empresa.telefone || "N/A"}</p>
            <p><strong>Email:</strong> ${empresa.email || "N/A"}</p>
        `;

        dadosSociosDiv.innerHTML = socios.map(socio => `
            <div class="socio">
                <p><strong>Nome:</strong> ${socio.nome}</p>
                <p><strong>Email:</strong> ${socio.email || "N/A"}</p>
                <p><strong>Telefone:</strong> ${socio.telefone || "N/A"}</p>
            </div>
        `).join("\n");

        dadosComerciaisDiv.innerHTML = referenciasComerciais.map(ref => `
            <div class="ref-comercial">
                <p><strong>Fornecedor:</strong> ${ref.fornecedor}</p>
                <p><strong>Telefone:</strong> ${ref.telefone || "N/A"}</p>
                <p><strong>Ramo:</strong> ${ref.ramo_atividade || "N/A"}</p>
                <p><strong>Contato:</strong> ${ref.contato || "N/A"}</p>
            </div>
        `).join("\n");

        dadosBancariasDiv.innerHTML = referenciasBancarias.map(ref => `
            <div class="ref-bancaria">
                <p><strong>Banco:</strong> ${ref.banco}</p>
                <p><strong>Agência:</strong> ${ref.agencia}</p>
                <p><strong>Conta:</strong> ${ref.conta}</p>
                <p><strong>Data de Abertura:</strong> ${ref.dataAbertura || "N/A"}</p>
                <p><strong>Telefone:</strong> ${ref.telefone || "N/A"}</p>
                <p><strong>Gerente:</strong> ${ref.gerente || "N/A"}</p>
            </div>
        `).join("\n");

        // Logar todos os dados carregados do localStorage
        console.log("📦 Dados carregados:", {
            empresa,
            socios,
            referenciasComerciais,
            referenciasBancarias
        });
    }

    confirmarCadastroBtn.addEventListener("click", async () => {
        const empresa = JSON.parse(localStorage.getItem("pessoaJuridica"));
        const socios = JSON.parse(localStorage.getItem("sociosData"));
        const referenciasComerciais = JSON.parse(localStorage.getItem("commercialRefs"));
        const referenciasBancarias = JSON.parse(localStorage.getItem("bankRefs"));

        const referenciasComerciaisLimpa = removerCamposIncompletos(referenciasComerciais, ["fornecedor", "telefone", "ramo_atividade", "contato"]);
        const referenciasBancariasLimpa = removerCamposIncompletos(referenciasBancarias, ["banco", "agencia", "conta"]);

        const payload = {
            pessoaJuridica: {
                ...empresa,
                capital_social: empresa.capital_social ? parseFloat(empresa.capital_social) : null
            },
            socios,
            referenciasComerciais: referenciasComerciaisLimpa.map(ref => ({
                fornecedor: ref.fornecedor,
                telefone: ref.telefone && /\d/.test(ref.telefone) ? ref.telefone.replace(/\D/g, "") : null                ,
                ramo_atividade: ref.ramo_atividade,
                contato: ref.contato
            })),
            referenciasBancarias: referenciasBancariasLimpa.map(ref => ({
                banco: ref.banco,
                agencia: ref.agencia ? String(ref.agencia).replace(/\D/g, "") : null,
                conta: ref.conta ? String(ref.conta).replace(/\D/g, "") : null,
                dataAbertura: ref.dataAbertura ? new Date(ref.dataAbertura).toISOString().split("T")[0] : null,
                telefone: ref.telefone && /\d/.test(ref.telefone) ? ref.telefone.replace(/\D/g, "") : null                ,
                gerente: ref.gerente,
                observacoes: ref.observacoes
            }))
        };

        console.log("📤 Enviando payload corrigido:", JSON.stringify(payload, null, 2));

        try {
            const response = await fetch("http://localhost:3000/api/salvarTudo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Erro ao salvar os dados");

            alert("Cadastro finalizado com sucesso!");
            localStorage.clear();
            window.location.href = "sucesso.html";

        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
            alert("Erro ao finalizar o cadastro. Tente novamente.");
        }
    });

    carregarDados();
});