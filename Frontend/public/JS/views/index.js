import { validarCNPJ, validarEmail, validarTelefone, mascararEValidarTelefone } from "../utils/helpers.js";

document.addEventListener("DOMContentLoaded", () => {
    const cnpjInput = document.getElementById("cnpj");
    const continuarBtn = document.getElementById("continuar-btn");
    const capitalSocialInput = document.getElementById("capital_social");
    const capitalSocialNumInput = document.getElementById("capital_social_num");
    const emailInput = document.getElementById("email");
    const telefoneInput = document.getElementById("telefone");
    const telefoneContadorInput = document.getElementById("telefone_contador");
    const dataFundacaoInput = document.getElementById("data_fundacao");
    const contratoInput = document.getElementById("contrato_Social");
    const cnpjFileInput = document.getElementById("cartao_CNPJ");
    const faturamentoInput = document.getElementById("relacao_Faturamento");

    const inputsObrigatorios = [
        "cnpj",
        "razao_social",
        "inscricao_estadual",
        "ramo_atividade",
        "data_fundacao",
        "capital_social",
        "telefone",
        "email",
        "conta_bancaria",
        "contador",
        "telefone_contador",
        "logradouro",
        "numero_complemento",
        "bairro",
        "cidade",
        "uf"
    ].map((id) => document.getElementById(id));
    
    const arquivosObrigatorios = [
        document.getElementById("contrato_Social"),
        document.getElementById("cartao_CNPJ"),
        document.getElementById("relacao_Faturamento")
    ];
    

    /**
     * Função para validar todos os campos obrigatórios
     */
    function validarFormulario() {
        // Verifica se os campos obrigatórios estão preenchidos
        const camposValidos = inputsObrigatorios.every((input) => {
            const preenchido = input && input.value.trim() !== ""; // Basta verificar se está preenchido
            console.log(`Campo ${input.id}: preenchido=${preenchido}`);
            return preenchido; // Não verifica 'is-valid' aqui
        });
    
        // Verifica se os arquivos obrigatórios estão preenchidos
        const contratoValido = contratoInput?.files?.length > 0;
        const cnpjValido = cnpjFileInput?.files?.length > 0;
        const faturamentoValido = faturamentoInput?.files?.length > 0;
    
        console.log("Contrato válido:", contratoValido);
        console.log("CNPJ válido:", cnpjValido);
        console.log("Faturamento válido:", faturamentoValido);
    
        const arquivosValidos = contratoValido && cnpjValido && faturamentoValido;
    
        // Verifica o formulário como um todo
        const formularioValido = camposValidos && arquivosValidos;
        console.log("Formulário válido:", formularioValido);
    
        // Habilita ou desabilita o botão
        continuarBtn.disabled = !formularioValido;
    }
    
    

    /**
     * Função para configurar o drag-and-drop e validação dos arquivos
     */
    function configurarUpload(dropZoneId, inputId, listId) {
        const dropZone = document.getElementById(dropZoneId);
        const fileInput = document.getElementById(inputId);
        const fileList = document.getElementById(listId);

        const mostrarArquivos = (arquivos) => {
            fileList.innerHTML = "";
            Array.from(arquivos).forEach((file, index) => {
                const listItem = document.createElement("li");
                listItem.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2");

                const fileLink = document.createElement("a");
                fileLink.href = URL.createObjectURL(file);
                fileLink.target = "_blank";
                fileLink.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
                fileLink.classList.add("text-primary", "text-decoration-underline", "me-3");

                const removeBtn = document.createElement("button");
                removeBtn.classList.add("btn", "btn-danger", "btn-sm");
                removeBtn.textContent = "Remover";
                removeBtn.addEventListener("click", () => {
                    fileList.removeChild(listItem);
                    const novoArquivo = Array.from(fileInput.files).filter((_, i) => i !== index);
                    atualizarInputArquivos(fileInput, novoArquivo);
                    validarFormulario(); // Revalidar formulário após a remoção
                });

                listItem.appendChild(fileLink);
                listItem.appendChild(removeBtn);
                fileList.appendChild(listItem);
            });
        };

        const atualizarInputArquivos = (input, arquivos) => {
            const dataTransfer = new DataTransfer();
            arquivos.forEach((arquivo) => dataTransfer.items.add(arquivo));
            input.files = dataTransfer.files;
        };
        [contratoInput, cnpjFileInput, faturamentoInput].forEach((input) => {
            input.addEventListener("change", () => {
                console.log(`Arquivos selecionados no campo ${input.id}:`, input.files.length);
                validarFormulario(); // Revalida o formulário após a seleção
            });
        });
        dropZone.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", (event) => mostrarArquivos(event.target.files));
        dropZone.addEventListener("dragover", (event) => {
            event.preventDefault();
            dropZone.classList.add("drag-over");
        });
        dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
        dropZone.addEventListener("drop", (event) => {
            event.preventDefault();
            dropZone.classList.remove("drag-over");
        
            const arquivos = event.dataTransfer.files;
            fileInput.files = arquivos; // Vincula os arquivos ao input oculto
        
            console.log(`Arquivos no campo ${fileInput.id}:`, arquivos.length); // Verifica se os arquivos estão sendo registrados
            mostrarArquivos(arquivos); // Exibe os arquivos na interface
            validarFormulario(); // Revalida o formulário
        });  
    }

    // Configuração de uploads
    configurarUpload("contrato-drop-zone", "contrato_Social", "contrato-list");
    configurarUpload("cnpj-drop-zone", "cartao_CNPJ", "cnpj-list");
    configurarUpload("faturamento-drop-zone", "relacao_Faturamento", "faturamento-list");

    // Eventos de validação dos campos de texto
    inputsObrigatorios.forEach((input) => {
        input?.addEventListener("input", validarFormulario);
    });

    // Eventos de validação para telefones
    [telefoneInput, telefoneContadorInput].forEach((input) => {
        input.addEventListener("input", () => {
            input.value = mascararEValidarTelefone(input.value) || input.value.replace(/\D/g, "");
        });
        input.addEventListener("blur", () => {
            const telefone = mascararEValidarTelefone(input.value);
            if (!telefone) {
                input.classList.add("is-invalid");
                input.classList.remove("is-valid");
            } else {
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
            }
        });
    });

    // Validação da data de fundação
    dataFundacaoInput.addEventListener("blur", () => {
        const data = dataFundacaoInput.value.trim();
        if (!data || new Date(data) > new Date()) {
            dataFundacaoInput.classList.add("is-invalid");
        } else {
            dataFundacaoInput.classList.remove("is-invalid");
            dataFundacaoInput.classList.add("is-valid");
        }
        validarFormulario();
    });

    // Validação do email
    emailInput.addEventListener("blur", () => {
        if (!validarEmail(emailInput.value.trim())) {
            emailInput.classList.add("is-invalid");
        } else {
            emailInput.classList.remove("is-invalid");
            emailInput.classList.add("is-valid");
        }
    });

    // Validação do CNPJ
    cnpjInput.addEventListener("blur", async () => {
        if (!validarCNPJ(cnpjInput.value.trim())) {
            cnpjInput.classList.add("is-invalid");
        } else {
            try {
                const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjInput.value.trim()}`);
                if (!response.ok) throw new Error();
                const data = await response.json();
                preencherDadosEmpresa(data);
                cnpjInput.classList.add("is-valid");
            } catch {
                cnpjInput.classList.add("is-invalid");
            }
        }
        validarFormulario();
    });

    // Preencher dados da empresa
    function preencherDadosEmpresa(data) {
        document.getElementById("razao_social").value = data.razao_social || "";
        document.getElementById("nome_fantasia").value = data.nome_fantasia || "";
        document.getElementById("logradouro").value = data.logradouro || "";
        document.getElementById("ramo_atividade").value = data.cnae_fiscal_descricao || "";
        document.getElementById("data_fundacao").value = data.data_inicio_atividade || "";

        const numericValue = parseFloat(data.capital_social || "0");
        capitalSocialNumInput.value = numericValue.toFixed(2);
        capitalSocialInput.value = numericValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        document.getElementById("bairro").value = data.bairro || "";
        document.getElementById("cidade").value = data.municipio || "";
        document.getElementById("uf").value = data.uf || "";
        document.getElementById("telefone").value = data.ddd_telefone_1 || "";
        document.getElementById("email").value = data.email || "";
    }
    

    // Inicializa o formulário com validação
    validarFormulario();

    // Salvar e continuar
    continuarBtn.addEventListener("click", () => {
        const pessoaJuridica = {
            cnpj: cnpjInput.value.trim(),
            razao_social: document.getElementById("razao_social").value.trim(),
            nome_fantasia: document.getElementById("nome_fantasia").value.trim(),
            ramo_atividade: document.getElementById("ramo_atividade").value.trim(),
            data_fundacao: dataFundacaoInput.value.trim(),
            capital_social: capitalSocialNumInput.value.trim(),
            telefone: telefoneInput.value.trim(),
            email: emailInput.value.trim(),
            logradouro: document.getElementById("logradouro").value.trim(),
            bairro: document.getElementById("bairro").value.trim(),
            cidade: document.getElementById("cidade").value.trim(),
            uf: document.getElementById("uf").value.trim(),
        };
    
        console.log("🟢 Salvando pessoaJuridica no localStorage:", pessoaJuridica);
    
        localStorage.setItem("pessoaJuridica", JSON.stringify(pessoaJuridica));
    
        // Redireciona para a próxima página
        window.location.href = "socios.html";  
    });
    
    console.log("Salvando CNPJ no localStorage:", cnpj); // Log para verificar o CNPJ sendo salvo
    localStorage.setItem("empresaCNPJ", JSON.stringify(cnpj));

});
