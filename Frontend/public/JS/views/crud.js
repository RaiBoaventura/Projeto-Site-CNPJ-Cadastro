document.addEventListener("DOMContentLoaded", () => {
    const empresaTableBody = document.getElementById("empresaTableBody");
    const empresaModal = new bootstrap.Modal(document.getElementById("empresaModal"));
    const detalhesModal = new bootstrap.Modal(document.getElementById("detalhesModal"));
    const addEmpresaBtn = document.getElementById("addEmpresaBtn");
    const saveEmpresaBtn = document.getElementById("saveEmpresaBtn");
    const cnpjInput = document.getElementById("cnpj");
    const razaoSocialInput = document.getElementById("razao_social");
    const telefoneInput = document.getElementById("telefone");
    const referenciasBancariasInput = document.getElementById("referencias_bancarias");
    const referenciasComerciaisInput = document.getElementById("referencias_comerciais");
    const sociosInput = document.getElementById("socios");
    const empresaIdInput = document.getElementById("empresaId");

    // Exibir os detalhes de uma empresa
    window.exibirDetalhes = (empresaData) => {
        try {
            const empresa = JSON.parse(decodeURIComponent(empresaData));
            const detalhesConteudo = document.getElementById("detalhesConteudo");

            detalhesConteudo.innerHTML = `
                <h4>${empresa.razao_social || "Não informado"} (CNPJ: ${empresa.cnpj || "Não informado"})</h4>
                <p><strong>Telefone:</strong> ${empresa.empresa_telefone || "Não informado"}</p>
                <h5>Referências Bancárias:</h5>
                ${empresa.referencias_bancarias?.map(ref => `
                    <p>Banco: ${ref.banco || "-"}, Agência: ${ref.agencia || "-"}, Conta: ${ref.conta || "-"}</p>
                `).join("") || "<p>Sem informações</p>"}
                <h5>Referências Comerciais:</h5>
                ${empresa.referencias_comerciais?.map(ref => `
                    <p>Fornecedor: ${ref.fornecedor || "-"}, Contato: ${ref.contato || "-"}, Telefone: ${ref.telefone || "-"}</p>
                `).join("") || "<p>Sem informações</p>"}
                <h5>Sócios:</h5>
                ${empresa.socios?.map(socio => `
                    <p>Nome: ${socio.nome || "-"}, Email: ${socio.email || "-"}, Telefone: ${socio.telefone || "-"}</p>
                `).join("") || "<p>Sem informações</p>"}
            `;

            detalhesModal.show();
        } catch (error) {
            console.error("Erro ao processar os detalhes da empresa:", error);
            alert("Não foi possível exibir os detalhes da empresa.");
        }
    };

    // Carregar empresas na tabela
    async function carregarEmpresas() {
        try {
            const response = await fetch("http://localhost:3000/vw_empresa_detalhada");
            if (!response.ok) throw new Error(`Erro ao carregar empresas: ${response.statusText}`);

            const empresas = await response.json();
            empresaTableBody.innerHTML = "";
            empresas.forEach((empresa) => {
                const row = document.createElement("tr");
                const empresaEncoded = encodeURIComponent(JSON.stringify(empresa));

                row.innerHTML = `
                    <td>${empresa.id_empresa}</td>
                    <td>${empresa.cnpj}</td>
                    <td>${empresa.razao_social}</td>
                    <td>${empresa.empresa_telefone || "-"}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick='exibirDetalhes("${empresaEncoded}")'>Detalhes</button>
                    </td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2" onclick='editarEmpresa("${empresaEncoded}")'>Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deletarEmpresa(${empresa.id_empresa})">Excluir</button>
                    </td>
                `;
                empresaTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Erro ao carregar empresas:", error);
        }
    }

    // Limpar o formulário de empresa
    function limparFormularioEmpresa() {
        cnpjInput.value = "";
        razaoSocialInput.value = "";
        telefoneInput.value = "";
        referenciasBancariasInput.value = "";
        referenciasComerciaisInput.value = "";
        sociosInput.value = "";
        empresaIdInput.value = "";
    }

    // Adicionar uma nova empresa
    addEmpresaBtn.addEventListener("click", () => {
        limparFormularioEmpresa();
        empresaModal.show();
    });

    // Salvar ou editar uma empresa
    saveEmpresaBtn.addEventListener("click", async () => {
        const id = empresaIdInput.value;
        const empresa = {
            cnpj: cnpjInput.value,
            razao_social: razaoSocialInput.value,
            telefone: telefoneInput.value,
            referencias_bancarias: referenciasBancariasInput.value ? JSON.parse(referenciasBancariasInput.value) : [],
            referencias_comerciais: referenciasComerciaisInput.value ? JSON.parse(referenciasComerciaisInput.value) : [],
            socios: sociosInput.value ? JSON.parse(sociosInput.value) : [],
        };

        try {
            const url = id ? `http://localhost:3000/empresa/${id}` : "http://localhost:3000/empresa";
            const method = id ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(empresa),
            });

            if (!response.ok) throw new Error("Erro ao salvar empresa.");
            alert("Empresa salva com sucesso!");
            empresaModal.hide();
            carregarEmpresas();
        } catch (error) {
            console.error("Erro ao salvar empresa:", error);
            alert("Erro ao salvar empresa. Verifique o console para mais detalhes.");
        }
    });

    // Deletar uma empresa
    window.deletarEmpresa = async (id) => {
        if (confirm("Deseja realmente excluir esta empresa?")) {
            try {
                const response = await fetch(`http://localhost:3000/empresa/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Erro ao excluir empresa.");
                alert("Empresa excluída com sucesso!");
                carregarEmpresas();
            } catch (error) {
                console.error("Erro ao excluir empresa:", error);
                alert("Erro ao excluir empresa. Verifique o console para mais detalhes.");
            }
        }
    };

    // Editar uma empresa
    window.editarEmpresa = (empresaEncoded) => {
        const empresa = JSON.parse(decodeURIComponent(empresaEncoded));
        empresaIdInput.value = empresa.id_empresa;
        cnpjInput.value = empresa.cnpj;
        razaoSocialInput.value = empresa.razao_social;
        telefoneInput.value = empresa.empresa_telefone || "";
        referenciasBancariasInput.value = empresa.referencias_bancarias ? JSON.stringify(empresa.referencias_bancarias, null, 2) : "";
        referenciasComerciaisInput.value = empresa.referencias_comerciais ? JSON.stringify(empresa.referencias_comerciais, null, 2) : "";
        sociosInput.value = empresa.socios ? JSON.stringify(empresa.socios, null, 2) : "";
        empresaModal.show();
    };

    // Inicializar o CRUD
    carregarEmpresas();
});
