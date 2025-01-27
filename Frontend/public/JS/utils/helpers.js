/**
 * Valida o formato de um CNPJ
 * @param {string} cnpj - O CNPJ a ser validado
 * @returns {boolean} - Retorna `true` se o CNPJ for válido
 */
export function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, ""); // Remove caracteres não numéricos

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
 * @param {string} telefone - Telefone a ser validado
 * @returns {boolean} - Retorna `true` se o telefone for válido
 */
export function validarTelefone(telefone) {
    const regex = /^\(?\d{2}\)?[\s-]?[\d]{4,5}[-\s]?\d{4}$/;
    return regex.test(telefone);
}

/**
 * Valida o formato de um CEP
 * @param {string} cep - O CEP a ser validado
 * @returns {boolean} - Retorna `true` se o CEP for válido
 */
export function validarCEP(cep) {
    const regex = /^[0-9]{8}$/; // CEP deve ter 8 dígitos
    return regex.test(cep);
}

/**
 * Valida o formato de um email
 * @param {string} email - O email a ser validado
 * @returns {boolean} - Retorna `true` se o email for válido
 */
export function validarEmail(email) {
    const regex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

/**
 * Valida se um campo obrigatório foi preenchido
 * @param {HTMLElement} campo - Campo do formulário
 * @returns {boolean} - Retorna `true` se o campo for válido
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
 * @param {string} telefone - Número de telefone a ser formatado e validado
 * @returns {string|null} - Telefone formatado se válido; `null` caso contrário
 */

export function mascararEValidarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, ""); // Remove caracteres não numéricos

    // Aplica a máscara conforme o tamanho do telefone
    if (telefone.length === 11) {
        // Celular com DDD: (XX) XXXXX-XXXX
        return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (telefone.length === 10) {
        // Fixo com DDD: (XX) XXXX-XXXX
        return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    }

    // Caso o telefone não tenha o tamanho esperado, retorna null
    return null;
}

/**
 * Limpa classes de validação de um campo
 * @param {HTMLElement} campo - Campo do formulário
 */
export function limparValidacao(campo) {
    campo.classList.remove("is-valid", "is-invalid");
}


