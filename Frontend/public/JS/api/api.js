const API_BASE_URL = "http://localhost:3000";

/**
 * Envia os dados de Pessoa Jurídica ao servidor
 * @param {Object} data
 * @returns {Promise}
 */
export async function enviarPessoaJuridica(data) {
    const response = await fetch(`${API_BASE_URL}/pessoa-juridica`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}

/**
 * Envia os dados de sócios ao servidor
 * @param {Object} data
 * @returns {Promise}
 */
export async function enviarSocios(data) {
    const response = await fetch(`${API_BASE_URL}/socios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}

/**
 * Envia as referências comerciais ao servidor
 * @param {Object} data 
 * @returns {Promise} 
 */
export async function enviarReferenciasComerciais(data) {
    const response = await fetch(`${API_BASE_URL}/referenciascomerciais`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}

/**
 * Envia os dados bancários ao servidor
 * @param {Object} data 
 * @returns {Promise}
 */
export async function enviarBancos(data) {
    const response = await fetch(`${API_BASE_URL}/bancos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}
