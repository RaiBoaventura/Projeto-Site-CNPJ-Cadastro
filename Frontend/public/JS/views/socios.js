// Adaptação do script para a nova estrutura

document.addEventListener("DOMContentLoaded", () => {
    const socioContainer = document.getElementById("socio-container");
    const addSocioBtn = document.getElementById("add-socio-btn");
    const avancarBtn = document.getElementById("avancar-btn");
    const cnpj = JSON.parse(localStorage.getItem("empresaCNPJ"));

    console.log("CNPJ recuperado do localStorage:", cnpj);

    let sociosData = [];
    let socioIndex = 0;

    // Função para carregar os sócios do servidor
    async function carregarSocios() {
        if (!cnpj) {
            console.warn("CNPJ não disponível no localStorage.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/cnpj/${cnpj}`);
            if (!response.ok) throw new Error("Erro ao buscar sócios");
    
            const data = await response.json();
    
            // Processa os sócios retornados pela API
            if (data.qsa && Array.isArray(data.qsa)) {
                sociosData = data.qsa.map((socio) => ({
                    nome: socio.nome || "",
                    cep: socio.cep || "",
                    endereco: socio.endereco || "",
                    numero: socio.numero || "",
                    bairro: socio.bairro || "",
                    cidade: socio.cidade || "",
                    uf: socio.uf || "",
                    telefone: socio.telefone || "",
                    email: socio.email || "",
                }));
                console.log("CNPJ recuperado:", cnpj);
                console.log("Resposta da API de Sócios:", data);
                console.log("Dados dos sócios processados:", sociosData);
                // Cria os campos para cada sócio
                sociosData.forEach((socio, index) => criarCamposSocio(socio, index));
            } else {
                console.warn("Nenhum sócio encontrado para o CNPJ fornecido.");
            }
        } catch (error) {
            console.error("Erro ao carregar sócios:", error);
        }
    }
    
    // Função para criar campos de sócio no DOM
    function criarCamposSocio(socio = {}, index) {
        const socioDiv = document.createElement("div");
        socioDiv.classList.add("card", "p-4", "mb-4");
        socioDiv.id = `socio-${index}`;
        socioDiv.innerHTML = `
            <h5>Sócio ${index + 1}</h5>
            <div class="mb-3">
                <label for="nome-socio-${index}" class="form-label">Nome:</label>
                <input type="text" id="nome-socio-${index}" class="form-control required-socio" value="${socio.nome || ''}" required>
            </div>
            <div class="mb-3">
                <label for="cep-socio-${index}" class="form-label">CEP:</label>
                <input type="text" id="cep-socio-${index}" class="form-control" value="${socio.cep || ''}" placeholder="Ex: 12345678">
            </div>
            <div class="mb-3">
                <label for="endereco-socio-${index}" class="form-label">Endereço:</label>
                <input type="text" id="endereco-socio-${index}" class="form-control" value="${socio.endereco || ''}">
            </div>
            <div class="mb-3">
                <label for="numero-socio-${index}" class="form-label">Número:</label>
                <input type="text" id="numero-socio-${index}" class="form-control" value="${socio.numero || ''}">
            </div>
            <div class="mb-3">
                <label for="bairro-socio-${index}" class="form-label">Bairro:</label>
                <input type="text" id="bairro-socio-${index}" class="form-control" value="${socio.bairro || ''}">
            </div>
            <div class="mb-3">
                <label for="cidade-socio-${index}" class="form-label">Cidade:</label>
                <input type="text" id="cidade-socio-${index}" class="form-control" value="${socio.cidade || ''}">
            </div>
            <div class="mb-3">
                <label for="uf-socio-${index}" class="form-label">UF:</label>
                <input type="text" id="uf-socio-${index}" class="form-control" value="${socio.uf || ''}">
            </div>
            <div class="mb-3">
                <label for="telefone-socio-${index}" class="form-label">Telefone:</label>
                <input type="text" id="telefone-socio-${index}" class="form-control required-socio" value="${socio.telefone || ''}">
            </div>
            <div class="mb-3">
                <label for="email-socio-${index}" class="form-label">Email:</label>
                <input type="email" id="email-socio-${index}" class="form-control required-socio" value="${socio.email || ''}" required>
            </div>
            <button type="button" class="btn btn-danger remove-socio-btn" data-index="${index}">Remover Sócio</button>
        `;
        socioContainer.appendChild(socioDiv);

        // Adiciona eventos aos campos e botões
        adicionarEventoRemoverSocio(index);
        adicionarEventoCEP(index);
    }

    // Adicionar eventos de remoção de sócio
    function adicionarEventoRemoverSocio(index) {
        const removeBtn = document.querySelector(`#socio-${index} .remove-socio-btn`);
        if (removeBtn) {
            removeBtn.addEventListener("click", () => {
                const elemento = document.getElementById(`socio-${index}`);
                if (!elemento) {
                    console.error(`Elemento com ID socio-${index} não encontrado.`);
                    return;
                }
    
                console.log(`Removendo elemento com ID socio-${index}`);
    
                // Remove o elemento do DOM
                socioContainer.removeChild(elemento);
    
                // Remove o sócio do array de dados
                sociosData.splice(index, 1);
    
                // Atualiza os índices no DOM e no array
                atualizarIndices();
    
                console.log("Array atualizado:", sociosData);
            });
        }
    }
    
    
    
    

    // Adicionar eventos para buscar dados do CEP
    function adicionarEventoCEP(index) {
        const cepInput = document.getElementById(`cep-socio-${index}`);
        const enderecoInput = document.getElementById(`endereco-socio-${index}`);
        const bairroInput = document.getElementById(`bairro-socio-${index}`);
        const cidadeInput = document.getElementById(`cidade-socio-${index}`);
        const ufInput = document.getElementById(`uf-socio-${index}`);
    
        if (cepInput) {
            cepInput.addEventListener("blur", async () => {
                const cep = cepInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    
                if (!cep || cep.length !== 8) {
                    console.warn(`CEP inválido: ${cep}`);
                    return;
                }
    
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    if (!response.ok) throw new Error("Erro ao buscar endereço");
                    const data = await response.json();
    
                    if (data.erro) {
                        console.warn(`CEP não encontrado: ${cep}`);
                        return;
                    }
    
                    // Verifica se os campos relacionados existem antes de preenchê-los
                    if (enderecoInput) enderecoInput.value = data.logradouro || "";
                    if (bairroInput) bairroInput.value = data.bairro || "";
                    if (cidadeInput) cidadeInput.value = data.localidade || "";
                    if (ufInput) ufInput.value = data.uf || "";
                } catch (error) {
                    console.error("Erro ao buscar CEP:", error);
                }
            });
        }
    }
    

    // Atualizar os índices dos sócios após remoção
    function atualizarIndices() {
        document.querySelectorAll(".card").forEach((card, newIndex) => {
            card.id = `socio-${newIndex}`;
            card.querySelector("h5").textContent = `Sócio ${newIndex + 1}`;
            card.querySelectorAll("input").forEach((input) => {
                const idParts = input.id.split("-");
                idParts[idParts.length - 1] = newIndex;
                input.id = idParts.join("-");
            });
    
            const removeBtn = card.querySelector(".remove-socio-btn");
            if (removeBtn) {
                removeBtn.dataset.index = newIndex;
    
                // Remove eventos anteriores para evitar duplicação
                removeBtn.replaceWith(removeBtn.cloneNode(true));
                adicionarEventoRemoverSocio(newIndex); // Reassocia o evento
            }
        });
    
        // Atualiza o array de sócios para refletir os novos índices
        sociosData = Array.from(document.querySelectorAll(".card")).map((card, index) => {
            return {
                nome: document.getElementById(`nome-socio-${index}`).value.trim(),
                cep: document.getElementById(`cep-socio-${index}`).value.trim(),
                endereco: document.getElementById(`endereco-socio-${index}`).value.trim(),
                numero: document.getElementById(`numero-socio-${index}`).value.trim(),
                bairro: document.getElementById(`bairro-socio-${index}`).value.trim(),
                cidade: document.getElementById(`cidade-socio-${index}`).value.trim(),
                uf: document.getElementById(`uf-socio-${index}`).value.trim(),
                telefone: document.getElementById(`telefone-socio-${index}`).value.trim(),
                email: document.getElementById(`email-socio-${index}`).value.trim(),
            };
        });
    
        socioIndex = sociosData.length; // Atualiza o índice global
    }
    
    
    

    // Adicionar um novo sócio
    addSocioBtn.addEventListener("click", () => {
        const novoSocio = {
            nome: "",
            cep: "",
            endereco: "",
            numero: "",
            bairro: "",
            cidade: "",
            uf: "",
            telefone: "",
            email: "",
        };
        sociosData.push(novoSocio);
        criarCamposSocio(novoSocio, socioIndex++);
    });

    // Validar os sócios antes de avançar
    function validarSocios() {
        let valid = true;

        document.querySelectorAll(".card").forEach((card, index) => {
            const camposObrigatorios = [
                `nome-socio-${index}`,
                `cep-socio-${index}`,
                `endereco-socio-${index}`,
                `numero-socio-${index}`,
                `bairro-socio-${index}`,
                `cidade-socio-${index}`,
                `uf-socio-${index}`,
                `telefone-socio-${index}`,
                `email-socio-${index}`,
            ];

            camposObrigatorios.forEach((campoId) => {
                const campo = document.getElementById(campoId);
                if (!campo.value.trim()) {
                    campo.classList.add("is-invalid");
                    valid = false;
                } else {
                    campo.classList.remove("is-invalid");
                    campo.classList.add("is-valid");
                }
            });
        });

        if (!valid) {
            alert("Por favor, preencha todos os campos corretamente antes de avançar.");
        }

        return valid;
    }

    // Evento para avançar para a próxima etapa
    avancarBtn.addEventListener("click", (event) => {
        if (sociosData.length === 0) {
            alert("É necessário adicionar pelo menos um sócio antes de avançar.");
            event.preventDefault(); // Impede o redirecionamento
            return;
        }
        
        if (!validarSocios()) {
            event.preventDefault();
            return;
        }

        localStorage.setItem("sociosData", JSON.stringify(sociosData));
        window.location.href = "bancos.html";
    });


    
    // Inicializar o carregamento dos sócios
    carregarSocios();
});
