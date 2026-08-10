import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini API
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Route for AI Weekly Menu Generation
app.post("/api/gemini/generate-menu", async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY no configurada. Configure la clave de API en Settings > Secrets.",
      });
    }

    const {
      targetType = "Colegio / Escuela Infantil",
      dietType = "Equilibrado y Nutritivo",
      customPrompt = "",
      days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      meals = ["Merienda / Mañana", "Almuerzo", "Merienda / Tarde"],
    } = req.body;

    const promptText = `Eres un nutricionista experto en planificación de menús escolares y gastronómicos.
Genera un menú semanal completo en idioma español para:
- Tipo de Institución/Público: ${targetType}
- Estilo Nutricional/Dieta: ${dietType}
- Días requeridos: ${days.join(", ")}
- Comidas/Horarios por día: ${meals.join(", ")}
${customPrompt ? `- Indicaciones especiales: ${customPrompt}` : ""}

Instrucciones de formato:
Para cada día y para cada comida, proporciona los platillos recomendados en una cadena de texto clara, apetitosa y balanceada.
Por ejemplo para "Almuerzo": "Arroz con pollo, Ensalada de verduras frescas, Jugo natural de mango, Fruta picada".
Asegúrate de incluir nombres de comida atractivos en español para niños o comensales.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Nombre sugerido para la institución o menú",
            },
            slogan: {
              type: Type.STRING,
              description: "Eslogan o frase motivacional de nutrición saludable",
            },
            menuGrid: {
              type: Type.ARRAY,
              description: "Lista de días con sus respectivas comidas",
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  meals: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        mealName: { type: Type.STRING },
                        content: { type: Type.STRING },
                        iconTag: {
                          type: Type.STRING,
                          description:
                            "Un tag corto como: apple, juice, soup, protein, salad, healthy, dairy, carb",
                        },
                      },
                      required: ["mealName", "content"],
                    },
                  },
                },
                required: ["day", "meals"],
              },
            },
          },
          required: ["title", "slogan", "menuGrid"],
        },
      },
    });

    if (!response.text) {
      return res.status(500).json({ error: "No se recibió respuesta válida del modelo." });
    }

    const data = JSON.parse(response.text.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Error generating menu with Gemini:", error);
    return res.status(500).json({
      error: error.message || "Error interno procesando la solicitud de IA",
    });
  }
});

// Start Vite development or static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
