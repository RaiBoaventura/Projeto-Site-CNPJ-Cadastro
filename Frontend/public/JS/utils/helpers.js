/**
 * Valida o formato de um CNPJ
 * @param {string} cnpj 
 * @returns {boolean} 
 */
export function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, ""); 

    if (cnpj.length !== 14) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho++;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
}

/**
 * Valida o formato de um número de telefone brasileiro
 * @param {string} telefone
 * @returns {boolean}
 */
export function validarTelefone(telefone) {
    const regex = /^\(?\d{2}\)?[\s-]?[\d]{4,5}[-\s]?\d{4}$/;
    return regex.test(telefone);
}

/**
 * Valida o formato de um CEP
 * @param {string} cep 
 * @returns {boolean} 
 */
export function validarCEP(cep) {
    const regex = /^[0-9]{8}$/;
    return regex.test(cep);
}

/**
 * Valida o formato de um email
 * @param {string} email 
 * @returns {boolean} 
 */
export function validarEmail(email) {
    const regex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

/**
 * Valida se um campo obrigatório foi preenchido
 * @param {HTMLElement} campo 
 * @returns {boolean} 
 */
export function validarCampoObrigatorio(campo) {
    if (!campo.value.trim()) {
        campo.classList.add("is-invalid");
        return false;
    }
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
    return true;
}

/**
 * Aplica máscara de telefone no formato brasileiro
 * @param {string} telefone - Número de telefone a ser formatado
 * @returns {string} - Telefone formatado
 */
/**
 * Aplica máscara e valida telefone no formato brasileiro
 * @param {string} telefone 
 * @returns {string|null} 
 */

export function mascararEValidarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, ""); 

    if (telefone.length === 11) {
        return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (telefone.length === 10) {
        return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    }

    return null;
}
/**
 * Limpa classes de validação de um campo
 * @param {HTMLElement} campo 
 */
export function limparValidacao(campo) {
    campo.classList.remove("is-valid", "is-invalid");
}
