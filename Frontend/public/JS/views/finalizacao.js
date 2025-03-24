document.addEventListener("DOMContentLoaded", () => {
    const dadosEmpresaDiv = document.getElementById("dadosEmpresa");
    const dadosSociosDiv = document.getElementById("dadosSocios");
    const dadosComerciaisDiv = document.getElementById("dadosComerciais");
    const dadosBancariasDiv = document.getElementById("dadosBancarias");
    const confirmarCadastroBtn = document.getElementById("confirmarCadastro");

    function carregarDados() {
        const empresa = JSON.parse(localStorage.getItem("pessoaJuridica")) || {};
        const socios = JSON.parse(localStorage.getItem("sociosData")) || [];
        const referenciasComerciais = JSON.parse(localStorage.getItem("commercialRefs")) || [];
        const referenciasBancarias = JSON.parse(localStorage.getItem("bankRefs")) || [];

        if (Object.keys(empresa).length === 0) {
            alert("Nenhum dado encontrado. Volte e preencha os dados.");
            window.location.href = "index.html"; // Redireciona de volta para a tela de cadastro
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
    }

    confirmarCadastroBtn.addEventListener("click", async () => {
        const empresa = JSON.parse(localStorage.getItem("pessoaJuridica"));
        const socios = JSON.parse(localStorage.getItem("sociosData"));
        const referenciasComerciais = JSON.parse(localStorage.getItem("commercialRefs"));
        const referenciasBancarias = JSON.parse(localStorage.getItem("bankRefs"));
    
        // 🔥 Função para remover objetos vazios
        function removerCamposVazios(arr, camposObrigatorios) {
            return arr.filter(obj => 
                camposObrigatorios.some(campo => obj[campo] && obj[campo].trim() !== "")
            );
        }
    
        // Removendo objetos vazios
        const referenciasComerciaisLimpa = removerCamposVazios(referenciasComerciais, ["fornecedor", "telefone", "ramo", "contato"]);
        const referenciasBancariasLimpa = removerCamposVazios(referenciasBancarias, ["banco", "agencia", "conta"]);
    
        const payload = {
            empresa: {
                ...empresa,
                capital_social: empresa.capital_social ? parseFloat(empresa.capital_social) : null // 🔥 Corrige o formato numérico
            },
            socios,
            referenciasComerciais: referenciasComerciais
                .filter(ref => ref.fornecedor.trim() !== "") // 🔥 Remove referências vazias
                .map(ref => ({
                    fornecedor: ref.fornecedor,
                    telefone: ref.telefone.replace(/\D/g, ""), // 🔥 Remove caracteres não numéricos
                    ramo_atividade: ref.ramo_atividade,
                    contato: ref.contato
                })),
            referenciasBancarias: referenciasBancarias
                .filter(ref => ref.banco.trim() !== "") // 🔥 Remove referências bancárias vazias
                .map(ref => ({
                    banco: ref.banco,
                    agencia: ref.agencia.replace(/\D/g, ""), // 🔥 Apenas números
                    conta: ref.conta.replace(/\D/g, ""), // 🔥 Apenas números
                    dataAbertura: ref.dataAbertura ? new Date(ref.dataAbertura).toISOString().split("T")[0] : null, // 🔥 Corrige formato da data
                    telefone: ref.telefone.replace(/\D/g, ""),
                    gerente: ref.gerente,
                    observacoes: ref.observacoes
                }))
        };
        
        console.log("📤 Enviando payload corrigido:", JSON.stringify(payload, null, 2));
        
        try {
            const response = await fetch("http://localhost:3000/api/salvarTudo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
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
