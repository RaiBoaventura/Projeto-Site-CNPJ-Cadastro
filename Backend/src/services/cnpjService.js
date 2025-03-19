const fetch = require('node-fetch');

const fetchCnpjDataFromApi = async (cnpj) => {
    if (!cnpj || cnpj.length !== 14 || !/^\d+$/.test(cnpj)) {
        throw new Error('CNPJ inválido. Deve conter 14 dígitos numéricos.');
    }

    try {
        console.log(`Buscando dados para o CNPJ: ${cnpj}`);
        const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);

        if (!response.ok) {
            throw new Error('Erro ao buscar dados na ReceitaWS.');
        }

        const data = await response.json();

        if (data.status === 'ERROR') {
            throw new Error(data.message || 'CNPJ não encontrado.');
        }

        return data; 
    } catch (error) {
        console.error('Erro na API ReceitaWS:', error.message);
        throw new Error('Erro ao consultar a API ReceitaWS.');
    }
};

module.exports = {
    fetchCnpjDataFromApi,
};
