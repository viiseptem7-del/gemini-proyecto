<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generador de Pictogramas</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #e0f7fa;
            color: #333;
            display: flex;
            flex-direction: column; /* Cambiado a columna para el footer */
            justify-content: flex-start; /* Ajustado para que el contenido empiece arriba */
            align-items: center;
            min-height: 100vh;
            margin: 0;
            text-align: center;
            padding-bottom: 60px; /* Espacio para el footer */
        }
        .container {
            background-color: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
            margin-bottom: 30px; /* Espacio entre el contenedor principal y el footer */
        }
        h1 {
            color: #00796b;
            margin-bottom: 10px;
            font-size: 2em;
        }
        p {
            color: #555;
            line-height: 1.6;
            margin-bottom: 25px;
        }
        input[type="text"], input[type="color"] {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 1em;
            box-sizing: border-box;
        }
        .input-group {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .input-group label {
            width: 120px;
            text-align: left;
            margin-right: 10px;
            font-size: 0.9em;
        }
        .input-group input[type="color"] {
            width: 50px;
            height: 35px;
            padding: 0;
            border: 1px solid #ccc;
        }
        .button-container {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 15px;
        }
        button {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 1em;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
            flex-grow: 1;
        }
        button#corregir-btn {
            background-color: #d32f2f;
            color: white;
        }
        button#corregir-btn:hover {
            background-color: #b71c1c;
            transform: translateY(-2px);
        }
        button#cotidiana-btn {
            background-color: #00796b;
            color: white;
        }
        button#cotidiana-btn:hover {
            background-color: #004d40;
            transform: translateY(-2px);
        }
        #image-container {
            margin-top: 20px;
            position: relative;
        }
        #result-image {
            max-width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            display: none;
        }
        .loading {
            display: none;
            margin-top: 20px;
            font-size: 1.2em;
            color: #00796b;
        }
        #download-btn {
            display: none;
            background-color: #004d40;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 8px;
            margin-top: 10px;
            transition: background-color 0.3s;
        }
        #download-btn:hover {
            background-color: #00251a;
        }
        .error-message {
            color: #d32f2f;
            margin-top: 15px;
            display: none;
        }
        footer {
            width: 100%;
            background-color: #004d40;
            color: white;
            text-align: center;
            padding: 15px 0;
            position: fixed;
            bottom: 0;
            left: 0;
            font-size: 0.9em;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        }
        footer p {
            margin: 5px 0;
            color: white;
        }
        footer a {
            color: #a7ffeb;
            text-decoration: none;
        }
        footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Generador de Pictogramas</h1>
    <p>
        Bienvenido/a a un espacio donde la comunicación florece sin límites. Aquí, transformamos palabras en imágenes, creando puentes visuales que conectan mentes y corazones. Sabemos que cada voz es única y cada imagen, una oportunidad para entender y ser entendido. ¡Crea, comparte y celebra la diversidad con nosotros!
    </p>

    <input type="text" id="prompt-input" placeholder="Describe el pictograma que quieres">

    <div class="input-group">
        <label for="skin-color">Color de Piel:</label>
        <input type="text" id="skin-color" placeholder="ej. blanca, morena">
    </div>

    <div class="input-group">
        <label for="eye-color">Color de Ojos:</label>
        <input type="text" id="eye-color" placeholder="ej. café, azul, verde">
    </div>

    <div class="input-group">
        <label for="hair-color">Color de Pelo:</label>
        <input type="text" id="hair-color" placeholder="ej. castaño, rubio, negro">
    </div>

    <div class="input-group">
        <label for="shirt-letter">Letra en la Camisa:</label>
        <input type="text" id="shirt-letter" maxlength="1" placeholder="ej. A">
    </div>

    <div class="button-container">
        <button id="corregir-btn"><i class="fas fa-ban"></i> Conducta a Corregir</button>
        <button id="cotidiana-btn">Conducta Cotidiana</button>
    </div>

    <div class="loading" id="loading">Generando imagen...</div>
    <div class="error-message" id="error-message"></div>

    <div id="image-container">
        <img id="result-image" alt="Pictograma generado por IA">
        <a id="download-btn" href="#" download="pictograma.jpg">Descargar Pictograma</a>
    </div>
</div>

<footer>
    <p>Creado con ❤️ por el **
