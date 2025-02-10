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
                <p><strong>Telefone:</strong> ${ref.telefone}</p>
                <p><strong>Ramo:</strong> ${ref.ramo_atividade}</p>
                <p><strong>Contato:</strong> ${ref.contato}</p>
            </div>
        `).join("\n");

        dadosBancariasDiv.innerHTML = referenciasBancarias.map(ref => `
            <div class="ref-bancaria">
                <p><strong>Banco:</strong> ${ref.banco}</p>
                <p><strong>Agência:</strong> ${ref.agencia}</p>
                <p><strong>Conta:</strong> ${ref.conta}</p>
                <p><strong>Data de Abertura:</strong> ${ref.dataAbertura}</p>
                <p><strong>Telefone:</strong> ${ref.telefone}</p>
                <p><strong>Gerente:</strong> ${ref.gerente}</p>
            </div>
        `).join("\n");
    }

    confirmarCadastroBtn.addEventListener("click", async () => {
        const empresa = JSON.parse(localStorage.getItem("pessoaJuridica"));
        const socios = JSON.parse(localStorage.getItem("sociosData"));
        const referenciasComerciais = JSON.parse(localStorage.getItem("commercialRefs"));
        const referenciasBancarias = JSON.parse(localStorage.getItem("bankRefs"));

        const payload = { empresa, socios, referenciasComerciais, referenciasBancarias };

        try {
            const response = await fetch("http://localhost:3000/api/salvarCadastro", {
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
