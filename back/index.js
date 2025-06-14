import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import voice from "elevenlabs-node";
import express from "express";
import { promises as fs } from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "-");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = "TojRWZatQyy9dujEdiQ1"; //9BWtsMINqrJLrRacOk9x

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/", (req, res) => {
  res.send("🏥 Simulation Médicale - Serveur actif !");
});

app.get("/voices", async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message) => {
  const time = new Date().getTime();
  console.log(`Starting conversion for message ${message}`);
  await execCommand(
      `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
  );
  console.log(`Conversion done in ${new Date().getTime() - time}ms`);
  await execCommand(
      `rhubarb -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`
  );
  console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};

// NOUVELLE ROUTE pour les commandes médicales directes (optionnelle)
app.post("/medical-command", async (req, res) => {
  const command = req.body.command;
  console.log(`🩺 Commande médicale: ${command}`);

  // Traiter comme un chat normal pour l'instant
  req.body.message = command;
  return handleChat(req, res);
});

// VOTRE ROUTE CHAT ORIGINALE avec adaptation médicale
app.post("/chat", handleChat);

async function handleChat(req, res) {
  const userMessage = req.body.message;

  if (!userMessage) {
    // Messages d'accueil adaptés au contexte médical
    res.send({
      messages: [
        {
          text: "Bonjour docteur... Je ne me sens pas très bien aujourd'hui.",
          audio: await audioFileToBase64("audios/intro_0.wav"),
          lipsync: await readJsonTranscript("audios/intro_0.json"),
          facialExpression: "worried",
          animation: "Talking_1",
        },
        {
          text: "J'ai des maux de tête et je me sens fatigué depuis quelques jours...",
          audio: await audioFileToBase64("audios/intro_1.wav"),
          lipsync: await readJsonTranscript("audios/intro_1.json"),
          facialExpression: "sad",
          animation: "Talking_2",
        },
      ],
    });
    return;
  }

  if (!elevenLabsApiKey || !process.env.GEMINI_API_KEY) {
    res.send({
      messages: [
        {
          text: "Désolé docteur, il y a un problème technique avec mes systèmes...",
          audio: await audioFileToBase64("audios/api_0.wav"),
          lipsync: await readJsonTranscript("audios/api_0.json"),
          facialExpression: "worried",
          animation: "Terrified",
        },
        {
          text: "J'espère que vous pourrez quand même m'aider...",
          audio: await audioFileToBase64("audios/api_1.wav"),
          lipsync: await readJsonTranscript("audios/api_1.json"),
          facialExpression: "sad",
          animation: "Talking_0",
        },
      ],
    });
    return;
  }

  try {
    // PROMPT MÉDICAL mais qui garde la même structure de réponse
    const prompt = `Tu es un patient virtuel dans une simulation médicale pour former de jeunes médecins.
    
    CONTEXTE: Tu es un patient de 35 ans qui consulte pour des maux de tête, de la fatigue et des douleurs diverses. Tu es inquiet mais coopératif.
    
    IMPORTANT: Réponds STRICTEMENT en JSON avec ce format :
    {
      "messages": [
        {
          "text": "ta réponse de patient",
          "facialExpression": "expression",
          "animation": "animation"
        }
      ]
    }
    
    Expressions/Animations disponibles :
    - facialExpression: smile, sad, angry, surprised, funnyFace, default, worried, pain
    - animation: Talking_0, Talking_1, Talking_2, Crying, Laughing, Idle, Terrified, Angry, Standing Idle
    
 ACTIONS SPÉCIALES disponibles :
- Pour faire cligner des yeux : "specialAction": "wink"
- Utilisez l'action spéciale avec : {"text": "*cligne des yeux*", "facialExpression": "smile", "animation": "Idle", "specialAction": "wink"}

INSTRUCTIONS POUR L'IA :
- Tu peux décider des expressions faciales selon le contexte (worried si inquiet, pain si douleur, etc.)
- Tu peux utiliser les actions spéciales si approprié
- Adapte tes réponses aux examens tactiles (si le docteur examine une partie du corps)
    
    COMPORTEMENT:
    - Parle comme un vrai patient français
    - Montre de l'inquiétude pour ta santé
    - Sois coopératif avec le médecin
    - Décris tes symptômes de façon réaliste
    - Utilise des expressions appropriées (worried/pain pour les douleurs, surprised pour les examens, etc.)
    
    Message du médecin : "${userMessage}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text()
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

    let messages;
    try {
      messages = JSON.parse(text).messages;
    } catch (parseError) {
      console.error("Erreur parsing JSON:", parseError);
      console.log("Texte reçu:", text);
      // Fallback
      messages = [{
        text: "Excusez-moi docteur, je n'ai pas bien compris votre question...",
        facialExpression: "worried",
        animation: "Talking_0"
      }];
    }

    // VOTRE LOGIQUE AUDIO ORIGINALE (inchangée)
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      console.log(`Expression: ${message.facialExpression}, Animation: ${message.animation}`);
      const fileName = `audios/message_${i}.mp3`;

      try {
        await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, message.text);
        await lipSyncMessage(i);
        message.audio = await audioFileToBase64(fileName);
        message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
      } catch (audioError) {
        console.error(`Erreur audio pour message ${i}:`, audioError);
        // Continuer sans audio en cas d'erreur
        message.audio = null;
        message.lipsync = null;
      }
    }

    res.send({ messages });
  } catch (error) {
    console.error("Erreur Gemini:", error);
    res.status(500).send({
      messages: [{
        text: "Je ne me sens vraiment pas bien docteur...",
        facialExpression: "pain",
        animation: "Crying",
        audio: null,
        lipsync: null
      }]
    });
  }
}

// VOS FONCTIONS ORIGINALES (inchangées)
const readJsonTranscript = async (file) => {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erreur lecture ${file}:`, error);
    return { mouthCues: [] };
  }
};

const audioFileToBase64 = async (file) => {
  try {
    const data = await fs.readFile(file);
    return data.toString("base64");
  } catch (error) {
    console.error(`Erreur lecture audio ${file}:`, error);
    return null;
  }
};

app.listen(port, () => {
  console.log(`🏥 Simulation médicale en écoute sur le port ${port}`);
});