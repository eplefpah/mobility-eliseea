import { GoogleGenAI } from "@google/genai";
import { JournalEntry, Evaluation } from "../types";

// NOTE: In a real production app, this call should likely go through a backend proxy
// to protect the API key, or use a secure client-side mechanism if available.
// For this MVP, we assume the environment variable is available.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTestimonial = async (
  journalEntries: JournalEntry[],
  evaluation: Evaluation,
  userName: string,
  destination: string
): Promise<{ title: string; content: string }> => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. Returning mock data.");
    return {
        title: "Une expérience inoubliable en Espagne",
        content: "Mon stage à Séville a été une révélation. J'ai non seulement amélioré mon espagnol, mais j'ai aussi appris des techniques de jardinage que je ne connaissais pas. L'accueil a été chaleureux malgré la barrière de la langue au début. Je recommande à tous de partir !"
    };
  }

  try {
    const journalSummary = journalEntries.map(e => 
      `Date: ${e.date}, Activités: ${e.activities}, Ressenti: ${e.mood}/5, Contenu: ${e.content}`
    ).join('\n');

    const prompt = `
      Tu es un expert en communication pour le consortium ELISEEA (Echanges des Lycées d’Île-de-France).
      Ton objectif est de rédiger un témoignage inspirant et synthétique pour un étudiant nommé ${userName} qui revient d'une mobilité à ${destination}.
      
      Voici les données d'entrée :
      
      RÉPONSES AU QUESTIONNAIRE DE FIN DE STAGE :
      - Points forts : ${evaluation.highlights}
      - Note logistique : ${evaluation.logistics}/5
      - Note compétences acquises : ${evaluation.skills}/5
      - Contenu du stage : ${evaluation.content}

      EXTRAITS DU JOURNAL DE BORD :
      ${journalSummary}

      CONSIGNES DE RÉDACTION :
      1. Rédige un témoignage à la première personne ("Je").
      2. Le ton doit être vivant, authentique et encourageant pour les futurs élèves.
      3. Mets en avant les compétences acquises (savoir-faire et savoir-être) et l'aspect culturel.
      4. Fais environ 150-200 mots.
      5. Propose un titre accrocheur pour ce témoignage.

      Format de réponse attendu (JSON) :
      {
        "title": "Titre du témoignage",
        "content": "Corps du témoignage..."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);
    return {
      title: result.title,
      content: result.content
    };

  } catch (error) {
    console.error("Error generating testimonial:", error);
    throw error;
  }
};