document.addEventListener("DOMContentLoaded", () => {
    const socioContainer = document.getElementById("socio-container");
    const addSocioBtn = document.getElementById("add-socio-btn");
    const avancarBtn = document.getElementById("avancar-btn");
    const cnpj = localStorage.getItem("empresaCNPJ")?.replace(/[^0-9]/g, "");

    console.log("📦 CNPJ recuperado do localStorage:", cnpj);

    let sociosData = [];
    let socioIndex = 0;

    async function carregarSocios() {
        if (!cnpj) {
            console.warn("⚠️ CNPJ não disponível no localStorage.");
            return;
        }

        try {
            console.log(`📡 Buscando sócios da empresa com CNPJ: ${cnpj}`);
            const response = await fetch(`http://localhost:3000/cnpj/${cnpj}`);

            if (!response.ok) {
                throw new Error(`❌ Erro na requisição: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log("📩 Resposta da API:", data);

            if (!data.qsa || !Array.isArray(data.qsa)) {
                console.warn("⚠️ Nenhum sócio encontrado.");
                return;
            }
            console.log("🔍 Verificando estrutura de sócios:", data.qsa);
            if (!data.qsa || !Array.isArray(data.qsa) || data.qsa.length === 0) {
                console.warn("⚠️ Nenhum sócio encontrado ou estrutura inválida.");
                return;
            }
            
            data.qsa.forEach((socio, index) => {
                const novoSocio = {
                    nome: socio.nome || "",  // ✅ Usar "socio.nome" e não "socio.nome_socio"
                    cep: "",
                    endereco: "",
                    numero: "",
                    bairro: "",
                    cidade: "",
                    uf: "",
                    telefone: "",
                    email: "",
                };
                console.log(`🛠 Criando Sócio ${index + 1}:`, novoSocio);
            
                sociosData.push(novoSocio);
                criarCamposSocio(novoSocio, index);
            });
            

        } catch (error) {
            console.error("🚨 Erro ao carregar sócios:", error);
            alert("Erro ao buscar os sócios. Verifique o console.");
        }
    }

    function criarCamposSocio(socio, index) {
        const socioDiv = document.createElement("div");
        socioDiv.classList.add("card", "p-4", "mb-4");
        socioDiv.id = `socio-${index}`;
    
        socioDiv.innerHTML = `
            <h5>Sócio ${index + 1}</h5>
            ${criarInput("nome", "Nome", socio.nome, index, true, "text", false)}
            ${criarInput("cep", "CEP", socio.cep, index)}
            ${criarInput("endereco", "Endereço", socio.endereco, index, true, "text", false)}
            ${criarInput("numero", "Número", socio.numero, index)}
            ${criarInput("bairro", "Bairro", socio.bairro, index, true, "text", false)}
            ${criarInput("cidade", "Cidade", socio.cidade, index, true, "text", false)}
            ${criarInput("uf", "UF", socio.uf, index, true, "text", false)}
            ${criarInput("telefone", "Telefone", socio.telefone, index)}
            ${criarInput("email", "Email", socio.email, index, false, "email")}
            <button type="button" class="btn btn-danger remove-socio-btn" data-index="${index}">Remover Sócio</button>
        `;
    
        socioContainer.appendChild(socioDiv);
    
        // 🔹 Atualiza os valores dos campos no objeto `sociosData` quando o usuário digita
        socioDiv.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", (event) => {
                const field = event.target.id.split("-")[0]; // Identifica o campo (ex: "cep", "endereco")
                sociosData[index][field] = event.target.value.trim(); // Atualiza no array
                localStorage.setItem("sociosData", JSON.stringify(sociosData)); // Salva no localStorage
                console.log(`🔄 Atualizando sócio ${index + 1}:`, sociosData[index]); // Debugging
            });
        });
    
        adicionarEventoCEP(index);
        adicionarEventoRemoverSocio(index);
    }
    
    
    function criarInput(id, label, valor, index, required = false, type = "text", readonly = false) {
        return `
            <div class="mb-3">
                <label for="${id}-socio-${index}" class="form-label">${label}:</label>
                <input type="${type}" id="${id}-socio-${index}" class="form-control ${required ? "required-socio" : ""}" value="${valor}" 
                ${required ? "required" : ""} ${readonly ? "readonly" : ""}>
            </div>
        `;
    }

    function adicionarEventoCEP(index) {
        const cepInput = document.getElementById(`cep-socio-${index}`);
    
        cepInput.addEventListener("blur", async () => {
            const cep = cepInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    
            if (cep.length !== 8) {
                console.warn(`⚠️ CEP inválido (${cep})`);
                return;
            }
    
            try {
                console.log(`📡 Buscando endereço para CEP: ${cep}`);
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
                if (!response.ok) {
                    throw new Error("Erro ao buscar endereço");
                }
    
                const data = await response.json();
    
                if (data.erro) {
                    alert("CEP não encontrado. Preencha os campos manualmente.");
                    return;
                }
    
                // 🔹 Preencher os campos visíveis no formulário
                document.getElementById(`endereco-socio-${index}`).value = data.logradouro || "";
                document.getElementById(`bairro-socio-${index}`).value = data.bairro || "";
                document.getElementById(`cidade-socio-${index}`).value = data.localidade || "";
                document.getElementById(`uf-socio-${index}`).value = data.uf || "";
    
                // 🔹 Atualizar o array `sociosData`
                sociosData[index].endereco = data.logradouro || "";
                sociosData[index].bairro = data.bairro || "";
                sociosData[index].cidade = data.localidade || "";
                sociosData[index].uf = data.uf || "";
    
                // 🔹 Salvar no `localStorage`
                localStorage.setItem("sociosData", JSON.stringify(sociosData));
    
                console.log("🏡 Endereço atualizado e salvo:", sociosData[index]);
            } catch (error) {
                console.error("❌ Erro ao buscar CEP:", error);
                alert("Erro ao buscar CEP. Tente novamente.");
            }
        });
    }
    
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

    function atualizarIndices() {
        document.querySelectorAll(".card").forEach((card, newIndex) => {
            card.id = `socio-${newIndex}`;
            card.querySelector("h5").textContent = `Sócio ${newIndex + 1}`;
            card.querySelectorAll("input").forEach(input => {
                const idParts = input.id.split("-");
                idParts[idParts.length - 1] = newIndex;
                input.id = idParts.join("-");
                input.setAttribute("data-index", newIndex);
            });
            card.querySelector(".remove-socio-btn").setAttribute("data-index", newIndex);
            adicionarEventoRemoverSocio(newIndex);
            adicionarEventoCEP(newIndex);
        });
        socioIndex = sociosData.length;
    }

    addSocioBtn.addEventListener("click", () => {
        const novoSocio = { nome: "", cep: "", endereco: "", numero: "", bairro: "", cidade: "", uf: "", telefone: "", email: "" };
        sociosData.push(novoSocio);
        criarCamposSocio(novoSocio, socioIndex++);
    });

    avancarBtn.addEventListener("click", () => {
        localStorage.setItem("sociosData", JSON.stringify(sociosData));
        window.location.href = "bancos.html";
    });

    carregarSocios();
});