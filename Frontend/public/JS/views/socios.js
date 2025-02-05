// Adaptação do script para a nova estrutura

document.addEventListener("DOMContentLoaded", () => {
    const socioContainer = document.getElementById("socio-container");
    const addSocioBtn = document.getElementById("add-socio-btn");
    const avancarBtn = document.getElementById("avancar-btn");
    
    let sociosData = [];
    let socioIndex = 0;

    let cnpj = localStorage.getItem("empresaCNPJ");
    console.log("📦 Valor recuperado do localStorage:", cnpj);
    
    // 🔹 Função para carregar os sócios do servidor
    async function carregarSocios() {
    let cnpj = localStorage.getItem("empresaCNPJ");

    if (!cnpj) {
        console.error("❌ CNPJ não encontrado no localStorage.");
        return;
    }

    try {
        cnpj = JSON.parse(cnpj); // Converte para objeto, se for JSON
        if (typeof cnpj === "object" && cnpj !== null && cnpj.hasOwnProperty("cnpj")) {
            cnpj = String(cnpj.cnpj); // Garante que seja string
        }
    } catch (error) {
        console.warn("⚠️ CNPJ armazenado não está em JSON, usando como string.");
    }

    // 🔹 Garante que cnpj seja string antes de chamar trim()
    if (typeof cnpj !== "string") {
        console.error("❌ CNPJ armazenado não é uma string válida.");
        return;
    }

    cnpj = cnpj.trim(); // Agora é seguro chamar trim()

    if (!cnpj) {
        console.error("❌ CNPJ inválido ou em branco.");
        return;
    }

    console.log("📡 Buscando sócios da empresa com CNPJ:", cnpj);

    try {
        const url = `http://localhost:3000/socios/empresa/${cnpj}`;
        console.log(`🔍 Fazendo requisição para: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao buscar sócios (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log("📩 Resposta da API:", data);

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("⚠️ Nenhum sócio encontrado para o CNPJ fornecido.");
            return;
        }

        sociosData = data.map(socio => ({
            nome: socio.nome || "",
            cep: socio.cep || "",
            endereco: socio.endereco || "",
            numero: socio.numero || "",
            bairro: socio.bairro || "",
            cidade: socio.cidade || "",
            uf: socio.uf || "",
            telefone: socio.telefone || "",
            email: socio.email || ""
        }));

        console.log("✅ Dados dos sócios processados:", sociosData);

        sociosData.forEach((socio, index) => criarCamposSocio(socio, index));
    } catch (error) {
        console.error("❌ Erro ao carregar sócios:", error);
    }
    }


    // 🔹 Função para criar campos de sócio no DOM
    function criarCamposSocio(socio, index) {
        const socioDiv = document.createElement("div");
        socioDiv.classList.add("card", "p-4", "mb-4");
        socioDiv.id = `socio-${index}`;
        socioDiv.innerHTML = `
            <h5>Sócio ${index + 1}</h5>
            ${criarInput("nome", "Nome", socio.nome, index, true)}
            ${criarInput("cep", "CEP", socio.cep, index)}
            ${criarInput("endereco", "Endereço", socio.endereco, index)}
            ${criarInput("numero", "Número", socio.numero, index)}
            ${criarInput("bairro", "Bairro", socio.bairro, index)}
            ${criarInput("cidade", "Cidade", socio.cidade, index)}
            ${criarInput("uf", "UF", socio.uf, index)}
            ${criarInput("telefone", "Telefone", socio.telefone, index, true)}
            ${criarInput("email", "Email", socio.email, index, true, "email")}
            <button type="button" class="btn btn-danger remove-socio-btn" data-index="${index}">Remover Sócio</button>
        `;

        socioContainer.appendChild(socioDiv);
        adicionarEventoRemoverSocio(index);
        adicionarEventoCEP(index);
    }

    // 🔹 Função para criar inputs dinamicamente
    function criarInput(id, label, valor, index, required = false, type = "text") {
        return `
            <div class="mb-3">
                <label for="${id}-socio-${index}" class="form-label">${label}:</label>
                <input type="${type}" id="${id}-socio-${index}" class="form-control ${required ? "required-socio" : ""}" value="${valor}" ${required ? "required" : ""}>
            </div>
        `;
    }

    // 🔹 Adicionar eventos de remoção de sócio
    function adicionarEventoRemoverSocio(index) {
        document.querySelector(`#socio-${index} .remove-socio-btn`).addEventListener("click", () => {
            const elemento = document.getElementById(`socio-${index}`);
            if (elemento) {
                socioContainer.removeChild(elemento);
                sociosData.splice(index, 1);
                atualizarIndices();
            }
        });
    }

    // 🔹 Adicionar eventos para buscar dados do CEP
    function adicionarEventoCEP(index) {
        const cepInput = document.getElementById(`cep-socio-${index}`);
        cepInput.addEventListener("blur", async () => {
            const cep = cepInput.value.replace(/\D/g, "");
            if (cep.length !== 8) return;

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                if (!response.ok) throw new Error("Erro ao buscar endereço");
                const data = await response.json();
                
                if (!data.erro) {
                    document.getElementById(`endereco-socio-${index}`).value = data.logradouro || "";
                    document.getElementById(`bairro-socio-${index}`).value = data.bairro || "";
                    document.getElementById(`cidade-socio-${index}`).value = data.localidade || "";
                    document.getElementById(`uf-socio-${index}`).value = data.uf || "";
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            }
        });
    }

    // 🔹 Atualizar os índices dos sócios após remoção
    function atualizarIndices() {
        document.querySelectorAll(".card").forEach((card, newIndex) => {
            card.id = `socio-${newIndex}`;
            card.querySelector("h5").textContent = `Sócio ${newIndex + 1}`;
        });
        socioIndex = sociosData.length;
    }

    // 🔹 Evento para adicionar um novo sócio
    addSocioBtn.addEventListener("click", () => {
        const novoSocio = { nome: "", cep: "", endereco: "", numero: "", bairro: "", cidade: "", uf: "", telefone: "", email: "" };
        sociosData.push(novoSocio);
        criarCamposSocio(novoSocio, socioIndex++);
    });

    // 🔹 Captura e salva os sócios no localStorage antes de avançar
    function salvarSocios() {
        const sociosSalvos = sociosData.filter(socio => socio.nome && socio.email && socio.telefone);
        if (sociosSalvos.length === 0) {
            alert("⚠️ É necessário adicionar pelo menos um sócio válido antes de continuar.");
            return false;
        }
        localStorage.setItem("sociosData", JSON.stringify(sociosSalvos));
        return true;
    }

    // 🔹 Evento para avançar para a próxima etapa
    avancarBtn.addEventListener("click", (event) => {
        if (!salvarSocios()) event.preventDefault();
        else window.location.href = "bancos.html";
    });

    // 🔹 Inicializar o carregamento dos sócios
    carregarSocios();
});
