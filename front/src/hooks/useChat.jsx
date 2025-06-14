import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const chat = async (message) => {
    // Ne pas permettre de nouveau chat si déjà en loading ou message en cours
    if (loading) return;

    setLoading(true);
    try {
      const data = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const resp = (await data.json()).messages;
      setMessages((messages) => [...messages, ...resp]);
    } catch (error) {
      console.error("Erreur chat:", error);
    }
    setLoading(false);
  };

  // Fonction pour les commandes médicales
  const sendMedicalCommand = async (command) => {
    if (loading) return;

    setLoading(true);
    try {
      const data = await fetch(`${backendUrl}/medical-command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });
      const resp = (await data.json()).messages;
      setMessages((messages) => [...messages, ...resp]);
    } catch (error) {
      console.error("Erreur commande médicale:", error);
    }
    setLoading(false);
  };

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  // États pour le contexte médical
  const [patientState, setPatientState] = useState("idle");
  const [consultationMode, setConsultationMode] = useState(true);
  const [diagnosticMode, setDiagnosticMode] = useState(false);
  const [interactionMode, setInteractionMode] = useState("voice");

  // Nouveau : état pour gérer les interactions tactiles
  const [touchInteractionCooldown, setTouchInteractionCooldown] = useState(false);

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  // CORRIGÉ : Fonction pour gérer les interactions tactiles
  const handlePatientTouch = (bodyPart) => {
    console.log(`🩺 Interaction tactile sur: ${bodyPart}`);

    // Empêcher les interactions répétées trop rapides
    if (touchInteractionCooldown || loading) {
      console.log("Interaction en cooldown ou loading en cours");
      return;
    }

    // Activer le cooldown
    setTouchInteractionCooldown(true);

    // Réactions selon la partie touchée (AVEC AUDIO cette fois)
    const touchReactions = {
      head: {
        animation: "Terrified",
        expression: "surprised",
        text: "Aïe, ma tête me fait mal! J'ai des migraines terribles..."
      },
      chest: {
        animation: "Talking_1",
        expression: "worried",
        text: "J'ai des douleurs à la poitrine, surtout quand je respire profondément..."
      },
      abdomen: {
        animation: "Angry",
        expression: "pain",
        text: "Ça me fait très mal au ventre! La douleur est constante..."
      },
      pelvis: {
        animation: "Talking_2",
        expression: "sad",
        text: "J'ai des douleurs dans le bas du dos..."
      },
      feet: {
        animation: "Talking_0",
        expression: "surprised",
        text: "Mes pieds sont un peu enflés..."
      }
    };

    const reaction = touchReactions[bodyPart] || touchReactions.chest;

    // Ajouter le message pour l'IA (AVEC génération audio)
    chat(`Le docteur examine ma ${bodyPart === 'head' ? 'tête' :
        bodyPart === 'chest' ? 'poitrine' :
            bodyPart === 'abdomen' ? 'ventre' :
                bodyPart === 'pelvis' ? 'bassin' : 'pieds'}. ${reaction.text}`);

    // Cooldown de 3 secondes
    setTimeout(() => {
      setTouchInteractionCooldown(false);
      console.log("Cooldown tactile terminé");
    }, 3000);
  };

  // Fonction pour les commandes vocales directes
  const handleVoiceCommand = (command) => {
    if (loading) return;

    const lowerCommand = command.toLowerCase();

    // Commandes spéciales avec animations
    if (lowerCommand.includes("clignez") || lowerCommand.includes("clin d'oeil")) {
      // Message spécial pour clignotement
      setMessages((messages) => [...messages, {
        text: "*cligne des yeux*",
        animation: "Idle",
        facialExpression: "smile",
        audio: null,
        lipsync: null,
        type: "special_action",
        specialAction: "wink"
      }]);
      return;
    }

    if (lowerCommand.includes("levez-vous") || lowerCommand.includes("debout")) {
      setPatientState("standing");
      chat("Le docteur me demande de me lever. D'accord docteur, je me lève...");
    } else if (lowerCommand.includes("asseyez-vous") || lowerCommand.includes("assis")) {
      setPatientState("sitting");
      chat("Le docteur me demande de m'asseoir. Je m'assieds docteur.");
    } else if (lowerCommand.includes("allongez-vous") || lowerCommand.includes("couchez")) {
      setPatientState("lying");
      chat("Le docteur me demande de m'allonger. Je m'allonge comme vous le demandez.");
    } else if (lowerCommand.includes("toussez") || lowerCommand.includes("toux")) {
      chat("Le docteur me demande de tousser. *tousse fort*");
    } else {
      // Commande normale - passer à l'IA
      chat(command);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
      <ChatContext.Provider
          value={{
            chat,
            sendMedicalCommand,
            handlePatientTouch,
            handleVoiceCommand,
            message,
            onMessagePlayed,
            loading,
            cameraZoomed,
            setCameraZoomed,
            patientState,
            setPatientState,
            consultationMode,
            setConsultationMode,
            diagnosticMode,
            setDiagnosticMode,
            interactionMode,
            setInteractionMode,
            touchInteractionCooldown, // Nouveau pour debug
          }}
      >
        {children}
      </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};