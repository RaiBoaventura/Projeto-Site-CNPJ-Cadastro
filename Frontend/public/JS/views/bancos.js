import { validarCampoObrigatorio, validarEmail, validarTelefone } from "../utils/helpers.js";

document.addEventListener("DOMContentLoaded", () => {
    const commercialRefsContainer = document.getElementById("commercialRefsContainer");
    const bankRefsContainer = document.getElementById("bankRefsContainer");
    const concluirCadastroBtn = document.getElementById("concluirCadastroBtn");
    const MAX_REFERENCES = 3;

    function adicionarReferencia(container, className, template, maxRefs, alertMsg) {
        const currentRefs = container.querySelectorAll(`.${className}`).length;
        if (currentRefs >= maxRefs) {
            alert(alertMsg);
            return;
        }

        const refDiv = document.createElement("div");
        refDiv.className = `card p-3 mb-3 ${className}`;
        refDiv.innerHTML = template;
        container.appendChild(refDiv);

        refDiv.querySelectorAll("input, textarea").forEach((input) => {
            input.addEventListener("input", validarFormulario);
        });

        validarFormulario();
    }

    const comercialTemplate = `
        <h4 class="card-title">Referência Comercial</h4>
        <div class="mb-3">
            <label class="form-label">Fornecedor:</label>
            <input type="text" class="form-control required-field" placeholder="Nome do Fornecedor">
        </div>
        <div class="mb-3">
            <label class="form-label">Telefone:</label>
            <input type="text" class="form-control required-field" placeholder="Telefone do Fornecedor">
        </div>
        <div class="mb-3">
            <label class="form-label">Ramo:</label>
            <input type="text" class="form-control required-field" placeholder="Ramo de Atividade">
        </div>
        <div class="mb-3">
            <label class="form-label">Contato:</label>
            <input type="text" class="form-control required-field" placeholder="Nome do Contato">
        </div>
        <button type="button" class="btn btn-danger remove-button mt-2">Remover Referência</button>
    `;

    const bancarioTemplate = `
        <h4 class="card-title">Referência Bancária</h4>
        <div class="mb-3">
            <label class="form-label">Banco:</label>
            <input type="text" class="form-control required-field" placeholder="Nome do Banco">
        </div>
        <div class="mb-3">
            <label class="form-label">Agência:</label>
            <input type="text" class="form-control required-field" placeholder="Agência">
        </div>
        <div class="mb-3">
            <label class="form-label">Conta:</label>
            <input type="text" class="form-control required-field" placeholder="Conta">
        </div>
        <div class="mb-3">
            <label class="form-label">Data de Abertura:</label>
            <input type="date" class="form-control required-field">
        </div>
        <div class="mb-3">
            <label class="form-label">Telefone:</label>
            <input type="text" class="form-control required-field" placeholder="Telefone do Gerente">
        </div>
        <div class="mb-3">
            <label class="form-label">Gerente:</label>
            <input type="text" class="form-control required-field" placeholder="Nome do Gerente">
        </div>
        <div class="mb-3">
            <label class="form-label">Observações:</label>
            <textarea class="form-control required-field" placeholder="Observações"></textarea>
        </div>
        <button type="button" class="btn btn-danger remove-button mt-2">Remover Referência</button>
    `;

    function validarFormulario() {
        const comerciais = document.querySelectorAll(".commercial-ref-form");
        const bancarias = document.querySelectorAll(".bank-ref-form");
    
        let comerciaisValidas = false;
        let bancariasValidas = false;
    
        comerciaisValidas = Array.from(comerciais).some(ref => {
            return (
                ref.querySelector('input[placeholder="Nome do Fornecedor"]')?.value.trim() &&
                ref.querySelector('input[placeholder="Telefone do Fornecedor"]')?.value.trim() &&
                ref.querySelector('input[placeholder="Ramo de Atividade"]')?.value.trim() &&
                ref.querySelector('input[placeholder="Nome do Contato"]')?.value.trim()
            );
        });
    
        bancariasValidas = Array.from(bancarias).some(ref => {
            return (
                ref.querySelector('input[placeholder="Nome do Banco"]')?.value.trim() &&
                ref.querySelector('input[placeholder="Agência"]')?.value.trim() &&
                ref.querySelector('input[placeholder="Conta"]')?.value.trim()
            );
        });
    
        concluirCadastroBtn.disabled = !(comerciaisValidas && bancariasValidas);
    }
    
    window.adicionarReferenciaComercial = function () {
        adicionarReferencia(
            commercialRefsContainer,
            "commercial-ref-form",
            comercialTemplate,
            MAX_REFERENCES,
            `Você pode adicionar no máximo ${MAX_REFERENCES} referências comerciais.`
        );
    };

    window.adicionarReferenciaBancaria = function () {
        adicionarReferencia(
            bankRefsContainer,
            "bank-ref-form",
            bancarioTemplate,
            MAX_REFERENCES,
            `Você pode adicionar no máximo ${MAX_REFERENCES} referências bancárias.`
        );
    };

    commercialRefsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-button")) {
            const refDiv = event.target.closest(".commercial-ref-form");
            if (refDiv) refDiv.remove();
            validarFormulario();
        }
    });

    bankRefsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-button")) {
            const refDiv = event.target.closest(".bank-ref-form");
            if (refDiv) refDiv.remove();
            validarFormulario();
        }
    });

    function irParaFinalizacao() {
        console.log("🔄 Salvando dados no localStorage e redirecionando para a finalização...");
    
        const commercialRefs = Array.from(document.querySelectorAll(".commercial-ref-form")).map(ref => {
            return {
                fornecedor: ref.querySelector('input[placeholder="Nome do Fornecedor"]').value.trim(),
                telefone: ref.querySelector('input[placeholder="Telefone do Fornecedor"]').value.trim(),
                ramo_atividade: ref.querySelector('input[placeholder="Ramo de Atividade"]').value.trim(),
                contato: ref.querySelector('input[placeholder="Nome do Contato"]').value.trim(),
            };
        }).filter(ref => ref.fornecedor || ref.telefone || ref.ramo_atividade || ref.contato); 
    
        const bankRefs = Array.from(document.querySelectorAll(".bank-ref-form")).map(ref => {
            return {
                banco: ref.querySelector('input[placeholder="Nome do Banco"]').value.trim(),
                agencia: ref.querySelector('input[placeholder="Agência"]').value.trim(),
                conta: ref.querySelector('input[placeholder="Conta"]').value.trim(),
                dataAbertura: ref.querySelector('input[type="date"]').value.trim(),
                telefone: ref.querySelector('input[placeholder="Telefone do Gerente"]').value.trim(),
                gerente: ref.querySelector('input[placeholder="Nome do Gerente"]').value.trim(),
                observacoes: ref.querySelector('textarea[placeholder="Observações"]').value.trim(),
            };
        }).filter(ref => ref.banco || ref.agencia || ref.conta); 
    
        if (commercialRefs.length === 0) {
            alert("⚠ Adicione pelo menos uma referência comercial antes de continuar.");
            return;
        }
    
        if (bankRefs.length === 0) {
            alert("⚠ Adicione pelo menos uma referência bancária antes de continuar.");
            return;
        }
    
        localStorage.setItem("commercialRefs", JSON.stringify(commercialRefs));
        localStorage.setItem("bankRefs", JSON.stringify(bankRefs));
    

        console.log("✅ Dados armazenados no localStorage:", { commercialRefs, bankRefs });
    
        window.location.href = "finalizacao.html";
    }
    
    

    function limparDadosLocalStorage() {
        localStorage.removeItem("pessoaJuridica");
        localStorage.removeItem("sociosData");
    }

    concluirCadastroBtn.addEventListener("click", irParaFinalizacao);
    validarFormulario();
});
