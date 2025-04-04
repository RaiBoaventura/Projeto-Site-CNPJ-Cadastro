const fetch = require('node-fetch'); 

const fetchCnpjData = async (req, res) => {
    const { cnpj } = req.params;

    if (!cnpj || cnpj.length !== 14 || !/^\d+$/.test(cnpj)) {
        return res.status(400).json({
            message: 'CNPJ inválido. Verifique se o número contém 14 dígitos numéricos.',
        });
    }

    try {
        console.log(`Buscando dados para o CNPJ: ${cnpj}`);
        const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);
        if (!response.ok) throw new Error('Erro ao buscar dados na ReceitaWS');

        const data = await response.json();

        if (data.status === 'ERROR') {
            return res.status(404).json({ message: data.message || 'CNPJ não encontrado.' });
        }

        res.json(data); 
    } catch (error) {
        console.error('Erro ao buscar dados do CNPJ:', error);
        res.status(500).json({
            message: 'Erro ao buscar dados do CNPJ.',
            error: error.message,
        });
    }
};

module.exports = { fetchCnpjData };
