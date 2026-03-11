import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1";

export async function transcribeAudio(audioFile) {
  if (!GROQ_API_KEY) {
    console.error("DEBUG: VITE_GROQ_API_KEY is missing/undefined in import.meta.env");
    throw new Error("API KEY no encontrada. Asegúrate de que el .env tenga VITE_GROQ_API_KEY y de haber reiniciado el servidor (npm run dev).");
  }

  const formData = new FormData();
  formData.append("file", audioFile);
  formData.append("model", "whisper-large-v3-turbo");
  formData.append("language", "es");
  formData.append("response_format", "json");

  try {
    const response = await axios.post(`${GROQ_API_URL}/audio/transcriptions`, formData, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.text;
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error("Groq API Transcription Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      msg: errorMsg
    });
    throw new Error(`Error de Groq: ${errorMsg}`);
  }
}

export async function summarizeClinicalNotes(text) {
  if (!GROQ_API_KEY) {
    throw new Error("API KEY no encontrada para resumen.");
  }

  try {
    const response = await axios.post(`${GROQ_API_URL}/chat/completions`, {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Eres un transcriptor médico ultra-directo. Tu única misión es transformar la transcripción de voz del médico en un resumen clínico extremadamente breve y profesional (máximo 1 o 2 líneas). No uses títulos, no uses introducciones como 'El médico dice...', ni uses el formato de 'Resumen:'. Solo devuelve la esencia clínica pura en lenguaje profesional."
        },
        {
          role: "user",
          content: `Extrae la esencia clínica de este audio: "${text}"`
        }
      ],
      temperature: 0.1,
      max_tokens: 200
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error("Groq API Summarization Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      msg: errorMsg
    });
    throw new Error(`Error de Resumen Groq: ${errorMsg}`);
  }
}
