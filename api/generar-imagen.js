const fetch = require('node-fetch');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { prompt, intention, skinColor, eyeColor, hairColor, shirtLetter } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'El prompt es requerido' });
    }

    const HF_TOKEN = process.env.CLAVE_CLIENTE;
    const HF_API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"; // ¡Aquí está el cambio!

    let promptParts = [
        "Un pictograma, estilo de dibujo de libro infantil, simple, limpio, personaje sin sombras, fondo blanco, ilustración vectorial",
        "con el cabello semi-rizado"
    ];

    if (skinColor) {
        promptParts.push(`piel ${skinColor}`);
    }
    if (eyeColor) {
        promptParts.push(`ojos ${eyeColor}`);
    }
    if (hairColor) {
        promptParts.push(`cabello ${hairColor}`);
    }
    if (shirtLetter) {
        promptParts.push(`con la letra ${shirtLetter} en la camisa`);
    }

    let personalizationPrompt = promptParts.join(', ');

    let finalPrompt = `${personalizationPrompt}, que muestre "${prompt}"`;

    if (intention === 'corregir') {
        finalPrompt += ', sobre un gran círculo rojo y una línea diagonal, prohibido';
    } else {
        finalPrompt += ', enmarcado en un círculo verde, acción';
    }
    
    const negativePrompt = "arte, pintura, dibujo a mano, dibujo, oscuro, sucio, feo, no un pictograma, texto, firma, marca de agua, blur, low quality, mala calidad, desenfocado, desordenado, distorted, malformado, manos deformes, blurry eyes, complex background, fondo complicado, realista, 3D, fotografía, sombreado, detallado, texturas, adultos";

    try {
        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HF_TOKEN}`
            },
            body: JSON.stringify({
                "inputs": finalPrompt,
                "negative_prompt": negativePrompt
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

        const imageBuffer = await response.buffer();
        const base64Image = imageBuffer.toString('base64');
        const dataURI = `data:image/jpeg;base64,${base64Image}`;

        res.status(200).json({ imageUrl: dataURI });

    } catch (error) {
        console.error('Error en la función:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};
