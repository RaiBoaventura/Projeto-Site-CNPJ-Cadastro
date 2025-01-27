import { validarEmail, validarCEP, validarCampoObrigatorio } from "../utils/helpers.js";

document.addEventListener("DOMContentLoaded", () => {
    const socioContainer = document.getElementById("socio-container");
    const addSocioBtn = document.getElementById("add-socio-btn");
    const avancarBtn = document.getElementById("avancar-btn");
    const cnpj = JSON.parse(localStorage.getItem("empresaCNPJ"));

    let sociosData = [];
    let socioIndex = 0;

    // Sincronizar dados do DOM com o array sociosData
    function sincronizarDados() {
        sociosData = [];
        document.querySelectorAll(".card").forEach((card, index) => {
            sociosData.push({
                nome: document.getElementById(`nome-socio-${index}`).value.trim(),
                cep: document.getElementById(`cep-socio-${index}`).value.trim(),
                endereco: document.getElementById(`endereco-socio-${index}`).value.trim(),
                numero: document.getElementById(`numero-socio-${index}`).value.trim(),
                bairro: document.getElementById(`bairro-socio-${index}`).value.trim(),
                cidade: document.getElementById(`cidade-socio-${index}`).value.trim(),
                uf: document.getElementById(`uf-socio-${index}`).value.trim(),
                telefone: document.getElementById(`telefone-socio-${index}`).value.trim(),
                email: document.getElementById(`email-socio-${index}`).value.trim(),
            });
        });
    }

    // Adicionar evento de busca automática para CEP
    function adicionarEventoCEP(index) {
        const cepInput = document.getElementById(`cep-socio-${index}`);
        const enderecoInput = document.getElementById(`endereco-socio-${index}`);
        const bairroInput = document.getElementById(`bairro-socio-${index}`);
        const cidadeInput = document.getElementById(`cidade-socio-${index}`);
        const ufInput = document.getElementById(`uf-socio-${index}`);

        cepInput.addEventListener("blur", async () => {
            const cep = cepInput.value.trim().replace(/\D/g, "");
            if (!validarCEP(cep)) {
                alert("CEP inválido. Insira um CEP com 8 dígitos.");
                limparEndereco(index);
                return;
            }

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                if (!response.ok) throw new Error("Erro ao buscar endereço.");
                const data = await response.json();

                if (data.erro) {
                    alert("CEP não encontrado. Verifique e tente novamente.");
                    limparEndereco(index);
                    return;
                }

                enderecoInput.value = data.logradouro || "";
                bairroInput.value = data.bairro || "";
                cidadeInput.value = data.localidade || "";
                ufInput.value = data.uf || "";
            } catch (error) {
                console.error("Erro ao buscar endereço:", error);
                limparEndereco(index);
            }
        });
    }

    function limparEndereco(index) {
        document.getElementById(`endereco-socio-${index}`).value = "";
        document.getElementById(`bairro-socio-${index}`).value = "";
        document.getElementById(`cidade-socio-${index}`).value = "";
        document.getElementById(`uf-socio-${index}`).value = "";
    }

    // Validar os campos de todos os sócios
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
                if (!validarCampoObrigatorio(campo)) valid = false;
            });

            const emailInput = document.getElementById(`email-socio-${index}`);
            if (!validarEmail(emailInput.value.trim())) {
                emailInput.classList.add("is-invalid");
                valid = false;
            } else {
                emailInput.classList.remove("is-invalid");
                emailInput.classList.add("is-valid");
            }
        });

        if (!valid) alert("Por favor, preencha todos os campos corretamente.");
        return valid;
    }

    // Criar os campos de um novo sócio
    function criarCamposSocio(socio = {}, index) {
        const socioDiv = document.createElement("div");
        socioDiv.classList.add("card", "p-4", "mb-4");
        socioDiv.id = `socio-${index}`;
        socioDiv.innerHTML = `
            <h5>Sócio ${index + 1}</h5>
               <div class="mb-3">
                <label for="nome-socio-${index}" class="form-label">Nome:</label>
                <input type="text" id="nome-socio-${index}" class="form-control required-socio" value="${socio.nome || ''}">
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
                <input type="email" id="email-socio-${index}" class="form-control required-socio" value="${socio.email || ''}">
            </div>
            
            <button type="button" class="btn btn-danger remove-socio-btn" data-index="${index}">Remover Sócio</button>
        `;
        socioContainer.appendChild(socioDiv);

        adicionarEventoCEP(index);
        adicionarEventoRemoverSocio(index);
    }

    // Remover um sócio
    function adicionarEventoRemoverSocio(index) {
        const removeBtn = document.querySelector(`#socio-${index} .remove-socio-btn`);
        if (removeBtn) {
            removeBtn.addEventListener("click", () => {
                sociosData.splice(index, 1);
                socioContainer.removeChild(document.getElementById(`socio-${index}`));
                atualizarIndices();
            });
        }
    }

    function atualizarIndices() {
        document.querySelectorAll(".card").forEach((card, newIndex) => {
            card.id = `socio-${newIndex}`;
            card.querySelector("h5").textContent = `Sócio ${newIndex + 1}`;
        });
    }

    // Eventos principais
    addSocioBtn.addEventListener("click", () => {
        sincronizarDados();
        criarCamposSocio({}, socioIndex++);
    });

    avancarBtn.addEventListener("click", (event) => {
        if (!validarSocios()) {
            event.preventDefault();
            return;
        }
        sincronizarDados();
        localStorage.setItem("sociosData", JSON.stringify(sociosData));
        window.location.href = "bancos.html";
    });
});
