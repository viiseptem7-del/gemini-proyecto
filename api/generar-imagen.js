const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // CORS para permitir solicitudes desde tu página web
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'El prompt es requerido' });
    }

    // --- Usamos las variables de entorno de Vercel ---
    const HF_TOKEN = process.env.CLAVE_CLIENTE;
    // Esta es la dirección del modelo de Stable Diffusion 1.0, que ya no dará error
    const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

    // En tu prompt se incluirá el texto para generar imágenes semi-rizadas.
    const fullPrompt = `${prompt}, pictograma, cabello semi-rizado`;

    try {
        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HF_TOKEN}`
            },
            body: JSON.stringify({
                "inputs": fullPrompt
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de Hugging Face:', errorData);
            return res.status(response.status).json({
                error: 'Error de la API de IA',
                details: errorData.error
            });
        }

        // La respuesta de Hugging Face es una imagen binaria
        const imageBuffer = await response.buffer();
        const base64Image = imageBuffer.toString('base64');
        const dataURI = `data:image/jpeg;base64,${base64Image}`;

        res.status(200).json({ imageUrl: dataURI });

    } catch (error) {
        console.error('Error en la función:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};
