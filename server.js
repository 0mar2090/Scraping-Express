const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
// Configuración CORS
app.use(cors());
app.get("/api/live", async (req, res) => {
  try {
    // Construir la URL completa
    const url = `https://www.oigo.com/${req.query.search_query}/radioenvivo/`;
    // Realizar la solicitud HTTP con Axios
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    // Obtener nombre y URL de la imagen
    const radioName = $("h1.u-assistive-text").text().trim();
    const imageUrl = $("img.c-logo.c-logo--live").attr("src");
    // Obtener el URL del stream de audio
    const playButton = $('button[data-player-target="playButton"]');
    const streamUrl = playButton.attr("data-player-audio-url-param");
    // Comprobar si se encontró el URL del stream de audio
    if (streamUrl) {
      res.json({ radioName, imageUrl, streamUrl});
    } else {
      res
        .status(404)
        .json({ error: "No se pudo encontrar el URL del stream de audio." });
    }
  } catch (error) {
    // Manejar errores de manera más detallada
    console.error("Error en el proceso de scraping:", error);
    res
      .status(500)
      .json({
        error: "Error en el proceso de scraping.",
        details: error.message,
      });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

