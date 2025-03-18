document.addEventListener("DOMContentLoaded", () => {
    const empresaTableBody = document.getElementById("empresaTableBody");
    const empresaModal = new bootstrap.Modal(document.getElementById("empresaModal"));
    const detalhesModal = new bootstrap.Modal(document.getElementById("detalhesModal"));
    const addEmpresaBtn = document.getElementById("addEmpresaBtn");
    const saveEmpresaBtn = document.getElementById("saveEmpresaBtn");
    const cnpjInput = document.getElementById("cnpj");
    const razaoSocialInput = document.getElementById("razao_social");
    const telefoneInput = document.getElementById("telefone");

    const empresaIdInput = document.getElementById("empresaId");

    // Exibir os detalhes de uma empresa
    window.exibirDetalhes = (empresa) => {
        try {
            if (typeof empresa === "string") {
                empresa = JSON.parse(decodeURIComponent(empresa)); // 🔥 Corrige se for string JSON
            }
    
            console.log("📌 Exibindo detalhes da empresa:", empresa);
    
            const detalhesConteudo = document.getElementById("detalhesConteudo");
    
            detalhesConteudo.innerHTML = `
                <h4>${empresa.razao_social || "Não informado"} (CNPJ: ${empresa.cnpj || "Não informado"})</h4>
                <p><strong>Nome Fantasia:</strong> ${empresa.nome_fantasia || "Não informado"}</p>
                <p><strong>Inscrição Estadual:</strong> ${empresa.inscricao_estadual || "Não informado"}</p>
                <p><strong>Ramo de Atividade:</strong> ${empresa.ramo_atividade || "Não informado"}</p>
                <p><strong>Data de Fundação:</strong> ${empresa.data_fundacao || "Não informado"}</p>
                <p><strong>Capital Social:</strong> R$ ${empresa.capital_social || "Não informado"}</p>
                <p><strong>Conta Bancária:</strong> ${empresa.conta_bancaria || "Não informado"}</p>
                <p><strong>Email:</strong> ${empresa.email || "Não informado"}</p>
                <p><strong>Site:</strong> ${empresa.site || "Não informado"}</p>
                <p><strong>Contador:</strong> ${empresa.contador || "Não informado"}</p>
    
                <h5>📍 Endereço:</h5>
                <p>${empresa.logradouro || "Não informado"}, ${empresa.numero_complemento || "S/N"}</p>
                <p>Bairro: ${empresa.empresa_bairro || "Não informado"}, Cidade: ${empresa.empresa_cidade || "Não informado"} - ${empresa.empresa_uf || "Não informado"}</p>
                
                <h5>📞 Contatos:</h5>
                <p><strong>Telefone da Empresa:</strong> ${empresa.empresa_telefone || "Não informado"}</p>
                <p><strong>Telefone do Contador:</strong> ${empresa.telefone_contador || "Não informado"}</p>
    
                <h5>🏦 Referências Bancárias:</h5>
                ${empresa.referencias_bancarias?.map(ref => `
                    <p>Banco: ${ref.banco || "-"}, Agência: ${ref.agencia || "-"}, Conta: ${ref.conta || "-"}</p>
                    <p>Gerente: ${ref.gerente || "-"}, Telefone: ${ref.telefone || "-"}, Abertura: ${ref.data_abertura || "-"}</p>
                `).join("") || "<p>Sem informações</p>"}
    
                <h5>🏢 Referências Comerciais:</h5>
                ${empresa.referencias_comerciais?.map(ref => `
                    <p>Fornecedor: ${ref.fornecedor || "-"}, Contato: ${ref.contato || "-"}, Telefone: ${ref.telefone || "-"}</p>
                    <p>Ramo de Atividade: ${ref.ramo_atividade || "-"}</p>
                `).join("") || "<p>Sem informações</p>"}
    
                <h5>👥 Sócios:</h5>
                ${empresa.socios?.map(socio => `
                    <p>Nome: ${socio.nome || "-"}, Email: ${socio.email || "-"}, Telefone: ${socio.telefone || "-"}</p>
                    <p>Endereço: ${socio.endereco || "-"}, Bairro: ${socio.bairro || "-"}, Cidade: ${socio.cidade || "-"} - ${socio.uf || "-"}</p>
                `).join("") || "<p>Sem informações</p>"}
            `;
    
            detalhesModal.show();
        } catch (error) {
            console.error("❌ Erro ao processar os detalhes da empresa:", error);
            alert("Erro ao exibir os detalhes da empresa.");
        }
    };
    setTimeout(() => {
        const tabs = document.querySelectorAll("#empresaTabs a");
        tabs.forEach(tab => {
            tab.addEventListener("click", function (event) {
                event.preventDefault();
                let activeTab = document.querySelector(".tab-pane.active");
                activeTab.classList.remove("active", "show");
                let targetTab = document.querySelector(this.getAttribute("href"));
                targetTab.classList.add("active", "show");
            });
        });
    }, 500); 

    function carregarEmpresas() {
        try {
            console.log("📌 Buscando empresas...");
            
            fetch("http://localhost:3000/empresa/vw_empresa_detalhada")
                .then(response => {
                    if (!response.ok) throw new Error(`Erro ao carregar empresas: ${response.statusText}`);
                    return response.json();
                })
                .then(empresas => {
                    const empresaTableBody = document.getElementById("empresaTableBody");
                    empresaTableBody.innerHTML = "";
    
                    empresas.forEach((empresa) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${empresa.id_empresa}</td>
                            <td>${empresa.cnpj}</td>
                            <td>${empresa.razao_social}</td>
                            <td>${empresa.empresa_telefone || "-"}</td>
                            <td>
                                <button class="btn btn-info btn-sm detalhes-btn" data-empresa='${encodeURIComponent(JSON.stringify(empresa))}'>Detalhes</button>
                            </td>
                            <td>
                                <button class="btn btn-warning btn-sm me-2 editar-btn" data-empresa='${encodeURIComponent(JSON.stringify(empresa))}'>Editar</button>
                                <button class="btn btn-danger btn-sm deletar-btn" data-id="${empresa.id_empresa}">Excluir</button>
                            </td>
                        `;
    
                        empresaTableBody.appendChild(row);
                    });
    
                    console.log("✅ Empresas carregadas com sucesso:", empresas);
    
                    // 🔥 Adicionar eventos dinamicamente após carregar a tabela
                    adicionarEventos();
                })
                .catch(error => {
                    console.error("❌ Erro ao carregar empresas:", error);
                    alert("Erro ao carregar empresas. Verifique se a API está rodando.");
                });
        } catch (error) {
            console.error("❌ Erro ao carregar empresas:", error);
            alert("Erro ao carregar empresas. Verifique se a API está rodando.");
        }
    }
     
    function adicionarEventos() {
        document.querySelectorAll(".detalhes-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const empresa = JSON.parse(decodeURIComponent(button.getAttribute("data-empresa")));
                exibirDetalhes(empresa);
            });
        });
    
        document.querySelectorAll(".editar-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const empresa = JSON.parse(decodeURIComponent(button.getAttribute("data-empresa")));
                editarEmpresa(empresa);
            });
        });
    
        document.querySelectorAll(".deletar-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-id");
                deletarEmpresa(id);
            });
        });
    }
    
    function limparFormularioEmpresa() {
        console.log("🛠️ Limpando formulário da empresa...");
    
        // Verifica se cada campo existe antes de tentar acessá-lo
        if (cnpjInput) cnpjInput.value = "";
        else console.warn("🚨 Campo CNPJ não encontrado!");
    
        if (razaoSocialInput) razaoSocialInput.value = "";
        else console.warn("🚨 Campo Razão Social não encontrado!");
    
        if (telefoneInput) telefoneInput.value = "";
        else console.warn("🚨 Campo Telefone não encontrado!");
    
        if (empresaIdInput) empresaIdInput.value = "";
        else console.warn("🚨 Campo ID da empresa não encontrado!");
    
        // Limpa os containers de referências bancárias, comerciais e sócios se existirem
        const refBancariasContainer = document.getElementById("referenciasBancariasContainer");
        if (refBancariasContainer) refBancariasContainer.innerHTML = "";
        else console.warn("🚨 Container de Referências Bancárias não encontrado!");
    
        const refComerciaisContainer = document.getElementById("referenciasComerciaisContainer");
        if (refComerciaisContainer) refComerciaisContainer.innerHTML = "";
        else console.warn("🚨 Container de Referências Comerciais não encontrado!");
    
        const sociosContainer = document.getElementById("sociosContainer");
        if (sociosContainer) sociosContainer.innerHTML = "";
        else console.warn("🚨 Container de Sócios não encontrado!");
    
        console.log("✅ Formulário limpo com sucesso!");
    }
    
    addEmpresaBtn.addEventListener("click", () => {
        limparFormularioEmpresa();
        empresaModal.show();
    });

    saveEmpresaBtn.addEventListener("click", async () => {
        const id = empresaIdInput.value;
    
        // 🔍 Captura os elementos corretamente antes de processá-los
        const bancoItems = document.querySelectorAll("#referenciasBancariasContainer .banco-item");
        const comercialItems = document.querySelectorAll("#referenciasComerciaisContainer .comercial-item");
        const socioItems = document.querySelectorAll("#sociosContainer .socio-item");
    
        if (bancoItems.length === 0) console.warn("🚨 Nenhuma referência bancária encontrada.");
        if (comercialItems.length === 0) console.warn("🚨 Nenhuma referência comercial encontrada.");
        if (socioItems.length === 0) console.warn("🚨 Nenhum sócio encontrado.");
    
        // 🔥 Coletar Referências Bancárias do formulário
        const referenciasBancarias = Array.from(bancoItems).map(div => {
            const inputs = div.querySelectorAll("input");
            return {
                banco: inputs[0] ? inputs[0].value.trim() : "",
                agencia: inputs[1] ? inputs[1].value.trim() : "",
                conta: inputs[2] ? inputs[2].value.trim() : "",
                gerente: inputs[3] ? inputs[3].value.trim() : "",
                telefone: inputs[4] ? inputs[4].value.trim() : "",
            };
        });
    
        // 🔥 Coletar Referências Comerciais do formulário
        const referenciasComerciais = Array.from(comercialItems).map(div => {
            const inputs = div.querySelectorAll("input");
            return {
                fornecedor: inputs[0] ? inputs[0].value.trim() : "",
                contato: inputs[1] ? inputs[1].value.trim() : "",
                telefone: inputs[2] ? inputs[2].value.trim() : "",
                ramo_atividade: inputs[3] ? inputs[3].value.trim() : "",
            };
        });
    
        // 🔥 Coletar Sócios do formulário
        const socios = Array.from(socioItems).map(div => {
            const inputs = div.querySelectorAll("input");
            return {
                nome: inputs[0] ? inputs[0].value.trim() : "",
                email: inputs[1] ? inputs[1].value.trim() : "",
                telefone: inputs[2] ? inputs[2].value.trim() : "",
                endereco: inputs[3] ? inputs[3].value.trim() : "",
                bairro: inputs[4] ? inputs[4].value.trim() : "",
                cidade: inputs[5] ? inputs[5].value.trim() : "",
                uf: inputs[6] ? inputs[6].value.trim() : "",
            };
        });
    
        // Criar o objeto da empresa com os dados coletados
        const empresa = {
            id_empresa: id,
            cnpj: cnpjInput.value.trim(),
            razao_social: razaoSocialInput.value.trim(),
            telefone: telefoneInput.value.trim(),
            referencias_bancarias: referenciasBancarias,
            referencias_comerciais: referenciasComerciais,
            socios: socios,
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
            alert("✅ Empresa salva com sucesso!");
            empresaModal.hide();
            carregarEmpresas();
        } catch (error) {
            console.error("❌ Erro ao salvar empresa:", error);
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
    window.editarEmpresa = (empresa) => {
        try {
            console.log("📌 Editando empresa:", empresa);
    
            // 🔍 Verifica se os campos existem antes de tentar acessá-los
            const empresaIdInput = document.getElementById("empresaId");
            const cnpjInput = document.getElementById("cnpj");
            const razaoSocialInput = document.getElementById("razao_social");
            const telefoneInput = document.getElementById("telefone");
    
            if (!empresaIdInput || !cnpjInput || !razaoSocialInput || !telefoneInput) {
                console.error("❌ ERRO: Algum campo do modal não foi encontrado!");
                alert("Erro ao abrir o modal de edição. Verifique o console.");
                return;
            }
    
            // 🛠️ Preenche os campos básicos
            empresaIdInput.value = empresa.id_empresa || "";
            cnpjInput.value = empresa.cnpj || "";
            razaoSocialInput.value = empresa.razao_social || "";
            telefoneInput.value = empresa.empresa_telefone || "";
    
            // 🛠️ Limpa os containers antes de adicionar os dados
            document.getElementById("referenciasBancariasContainer").innerHTML = "";
            document.getElementById("referenciasComerciaisContainer").innerHTML = "";
            document.getElementById("sociosContainer").innerHTML = "";
    
            // 🛠️ Adiciona as Referências Bancárias
            (empresa.referencias_bancarias || []).forEach(ref => adicionarReferenciaBancaria(ref));
    
            // 🛠️ Adiciona as Referências Comerciais
            (empresa.referencias_comerciais || []).forEach(ref => adicionarReferenciaComercial);
    
            // 🛠️ Adiciona os Sócios
            (empresa.socios || []).forEach(socio => adicionarSocio(socio));
    
            console.log("✅ Modal de edição preenchido com sucesso!");
    
            // 🛠️ Aguarda 200ms antes de abrir o modal
            setTimeout(() => {
                empresaModal.show();
            }, 200);
    
        } catch (error) {
            console.error("❌ Erro ao carregar os dados para edição:", error);
            alert("Erro ao carregar os dados para edição. Verifique o console.");
        }
    };
    
    function adicionarReferenciaBancaria(ref = {}) {
        const container = document.getElementById("referenciasBancariasContainer");
        
        const div = document.createElement("div");
        div.classList.add("banco-item", "card", "p-3", "mb-3");
        div.innerHTML = `
            <h5 class="card-title">🏦 Referência Bancária</h5>
            <input type="text" placeholder="Banco" class="form-control mb-2" value="${ref.banco || ''}">
            <input type="text" placeholder="Agência" class="form-control mb-2" value="${ref.agencia || ''}">
            <input type="text" placeholder="Conta" class="form-control mb-2" value="${ref.conta || ''}">
            <input type="text" placeholder="Gerente" class="form-control mb-2" value="${ref.gerente || ''}">
            <input type="text" placeholder="Telefone" class="form-control mb-2" value="${ref.telefone || ''}">
            <button class="btn btn-danger btn-sm" onclick="removerItem(this)">🗑️ Remover</button>
        `;
        container.appendChild(div);
    }
    
    
    function adicionarSocio(socio = {}) {
        const container = document.getElementById("sociosContainer");
    
        const div = document.createElement("div");
        div.classList.add("socio-item", "card", "p-3", "mb-3");
        div.innerHTML = `
            <h5 class="card-title">👥 Sócio</h5>
            <input type="text" placeholder="Nome" class="form-control mb-2" value="${socio.nome || ''}">
            <input type="text" placeholder="Email" class="form-control mb-2" value="${socio.email || ''}">
            <input type="text" placeholder="Telefone" class="form-control mb-2" value="${socio.telefone || ''}">
            <input type="text" placeholder="Endereço" class="form-control mb-2" value="${socio.endereco || ''}">
            <input type="text" placeholder="Bairro" class="form-control mb-2" value="${socio.bairro || ''}">
            <input type="text" placeholder="Cidade" class="form-control mb-2" value="${socio.cidade || ''}">
            <input type="text" placeholder="UF" class="form-control mb-2" value="${socio.uf || ''}">
            <button class="btn btn-danger btn-sm" onclick="removerItem(this)">🗑️ Remover</button>
        `;
        container.appendChild(div);
    }
    
    window.removerItem = function(button) {
        button.parentElement.remove();
    };
    
    window.adicionarReferenciaBancaria = function (ref = {}) {
        const container = document.getElementById("referenciasBancariasContainer");
        
        const div = document.createElement("div");
        div.classList.add("banco-item", "card", "p-3", "mb-3");
        div.innerHTML = `
            <h5 class="card-title">🏦 Referência Bancária</h5>
            <input type="text" placeholder="Banco" class="form-control mb-2" value="${ref.banco || ''}">
            <input type="text" placeholder="Agência" class="form-control mb-2" value="${ref.agencia || ''}">
            <input type="text" placeholder="Conta" class="form-control mb-2" value="${ref.conta || ''}">
            <input type="text" placeholder="Gerente" class="form-control mb-2" value="${ref.gerente || ''}">
            <input type="text" placeholder="Telefone" class="form-control mb-2" value="${ref.telefone || ''}">
            <button class="btn btn-danger btn-sm" onclick="removerItem(this)">🗑️ Remover</button>
        `;
        container.appendChild(div);
    };
    
    window.adicionarReferenciaComercial = function (ref = {}) {
        const container = document.getElementById("referenciasComerciaisContainer");
    
        const div = document.createElement("div");
        div.classList.add("comercial-item", "card", "p-3", "mb-3");
        div.innerHTML = `
            <h5 class="card-title">🏢 Referência Comercial</h5>
            <input type="text" placeholder="Fornecedor" class="form-control mb-2" value="${ref.fornecedor || ''}">
            <input type="text" placeholder="Contato" class="form-control mb-2" value="${ref.contato || ''}">
            <input type="text" placeholder="Telefone" class="form-control mb-2" value="${ref.telefone || ''}">
            <input type="text" placeholder="Ramo de Atividade" class="form-control mb-2" value="${ref.ramo_atividade || ''}">
            <button class="btn btn-danger btn-sm" onclick="removerItem(this)">🗑️ Remover</button>
        `;
        container.appendChild(div);
    };
    
    window.adicionarSocio = function (socio = {}) {
        const container = document.getElementById("sociosContainer");
    
        const div = document.createElement("div");
        div.classList.add("socio-item", "card", "p-3", "mb-3");
        div.innerHTML = `
            <h5 class="card-title">👥 Sócio</h5>
            <input type="text" placeholder="Nome" class="form-control mb-2" value="${socio.nome || ''}">
            <input type="text" placeholder="Email" class="form-control mb-2" value="${socio.email || ''}">
            <input type="text" placeholder="Telefone" class="form-control mb-2" value="${socio.telefone || ''}">
            <input type="text" placeholder="Endereço" class="form-control mb-2" value="${socio.endereco || ''}">
            <input type="text" placeholder="Bairro" class="form-control mb-2" value="${socio.bairro || ''}">
            <input type="text" placeholder="Cidade" class="form-control mb-2" value="${socio.cidade || ''}">
            <input type="text" placeholder="UF" class="form-control mb-2" value="${socio.uf || ''}">
            <button class="btn btn-danger btn-sm" onclick="removerItem(this)">🗑️ Remover</button>
        `;
        container.appendChild(div);
    };

    function verificarOuCriarContainer(idContainer, parentId) {
        let container = document.getElementById(idContainer);
        if (!container) {
            console.warn(`⚠️ Criando container ${idContainer} pois não foi encontrado no DOM.`);
            container = document.createElement("div");
            container.id = idContainer;
            document.getElementById(parentId).appendChild(container);
        }
        return container;
    }
    
    function removerItem(button) {
        button.parentElement.remove();
    }
    const refBancariasContainer = verificarOuCriarContainer("referenciasBancariasContainer", "empresaForm");
    const refComerciaisContainer = verificarOuCriarContainer("referenciasComerciaisContainer", "empresaForm");
    const sociosContainer = verificarOuCriarContainer("sociosContainer", "empresaForm");
    
    // Inicializar o CRUD
    carregarEmpresas();
});
