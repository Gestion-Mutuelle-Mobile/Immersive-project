import { useRef, useState } from "react";
import { useChat } from "../hooks/useChat";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const {
    chat,
    handleVoiceCommand,
    handlePatientTouch,
    loading,
    cameraZoomed,
    setCameraZoomed,
    message,
    patientState,
    consultationMode,
    setConsultationMode,
    diagnosticMode,
    setDiagnosticMode,
    interactionMode,
    setInteractionMode
  } = useChat();

  const [activeTab, setActiveTab] = useState("consultation");
  const [quickCommands, setQuickCommands] = useState(false);
  const [diagnosticNotes, setDiagnosticNotes] = useState("");
  const [symptoms, setSymptoms] = useState([]);

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message && text.trim()) {
      if (interactionMode === "voice") {
        handleVoiceCommand(text);
      } else {
        chat(text);
      }
      input.current.value = "";
    }
  };

  const addSymptom = (symptom) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  // Commandes rapides pour le médecin
  const medicalCommands = [
    { text: "Bonjour, comment vous sentez-vous aujourd'hui ?", type: "greeting" },
    { text: "Pouvez-vous me décrire vos symptômes ?", type: "question" },
    { text: "Depuis quand ressentez-vous ces douleurs ?", type: "question" },
    { text: "Levez-vous s'il vous plaît", type: "command" },
    { text: "Asseyez-vous", type: "command" },
    { text: "Allongez-vous sur la table d'examen", type: "command" },
    { text: "Respirez profondément", type: "command" },
    { text: "Toussez pour moi", type: "command" },
    { text: "Montrez-moi où vous avez mal", type: "diagnostic" },
  ];

  // Zones corporelles pour l'examen tactile
  const bodyParts = [
    { name: "Tête", id: "head", icon: "🧠" },
    { name: "Poitrine", id: "chest", icon: "🫁" },
    { name: "Abdomen", id: "abdomen", icon: "🤱" },
    { name: "Bras gauche", id: "left_arm", icon: "💪" },
    { name: "Bras droit", id: "right_arm", icon: "💪" },
    { name: "Jambe gauche", id: "left_leg", icon: "🦵" },
    { name: "Jambe droite", id: "right_leg", icon: "🦵" },
  ];

  if (hidden) {
    return null;
  }

  return (
      <>
        <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">

          {/* Header - Informations de consultation */}
          <div className="self-start backdrop-blur-md bg-blue-900 bg-opacity-80 p-4 rounded-lg text-white">
            <h1 className="font-black text-xl flex items-center gap-2">
              🏥 Simulation Médicale Immersive
            </h1>
            <p className="text-blue-200">Consultation virtuelle - Formation médicale</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="bg-green-500 px-2 py-1 rounded">Patient: Actif</span>
              <span className={`px-2 py-1 rounded ${
                  patientState === 'idle' ? 'bg-gray-500' :
                      patientState === 'sitting' ? 'bg-blue-500' :
                          patientState === 'lying' ? 'bg-purple-500' :
                              patientState === 'walking' ? 'bg-orange-500' : 'bg-red-500'
              }`}>
              État: {patientState === 'idle' ? 'Au repos' :
                  patientState === 'sitting' ? 'Assis' :
                      patientState === 'lying' ? 'Allongé' :
                          patientState === 'walking' ? 'Debout' : 'En mouvement'}
            </span>
            </div>
          </div>

          {/* Panel latéral - Outils médicaux */}
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-white bg-opacity-90 p-4 rounded-lg pointer-events-auto max-w-xs">

            {/* Onglets */}
            <div className="flex gap-2 mb-4">
              <button
                  onClick={() => setActiveTab("consultation")}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                      activeTab === "consultation" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
              >
                Consultation
              </button>
              <button
                  onClick={() => setActiveTab("examination")}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                      activeTab === "examination" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
              >
                Examen
              </button>
              <button
                  onClick={() => setActiveTab("diagnostic")}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                      activeTab === "diagnostic" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
              >
                Diagnostic
              </button>
            </div>

            {/* Contenu des onglets */}
            {activeTab === "consultation" && (
                <div>
                  <h3 className="font-bold mb-2">Commandes rapides</h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {medicalCommands.map((cmd, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                              input.current.value = cmd.text;
                              sendMessage();
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-xs hover:bg-gray-100 ${
                                cmd.type === 'command' ? 'border-l-4 border-orange-400' :
                                    cmd.type === 'question' ? 'border-l-4 border-blue-400' :
                                        cmd.type === 'diagnostic' ? 'border-l-4 border-red-400' :
                                            'border-l-4 border-green-400'
                            }`}
                        >
                          {cmd.text}
                        </button>
                    ))}
                  </div>
                </div>
            )}

            {activeTab === "examination" && (
                <div>
                  <h3 className="font-bold mb-2">Examen physique</h3>
                  <p className="text-xs text-gray-600 mb-2">Cliquez sur une zone pour examiner</p>
                  <div className="grid grid-cols-2 gap-1">
                    {bodyParts.map((part) => (
                        <button
                            key={part.id}
                            onClick={() => handlePatientTouch(part.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-xs border"
                        >
                          <span>{part.icon}</span>
                          <span>{part.name}</span>
                        </button>
                    ))}
                  </div>
                </div>
            )}

            {activeTab === "diagnostic" && (
                <div>
                  <h3 className="font-bold mb-2">Notes diagnostiques</h3>
                  <textarea
                      value={diagnosticNotes}
                      onChange={(e) => setDiagnosticNotes(e.target.value)}
                      className="w-full h-20 text-xs p-2 border rounded resize-none"
                      placeholder="Notez vos observations..."
                  />

                  <h4 className="font-semibold mt-2 mb-1 text-sm">Symptômes identifiés</h4>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {symptoms.map((symptom, idx) => (
                        <span
                            key={idx}
                            onClick={() => removeSymptom(symptom)}
                            className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs cursor-pointer hover:bg-red-200"
                        >
                    {symptom} ×
                  </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    {["Toux", "Fièvre", "Douleur", "Fatigue", "Nausée", "Vertige"].map((symptom) => (
                        <button
                            key={symptom}
                            onClick={() => addSymptom(symptom)}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                        >
                          + {symptom}
                        </button>
                    ))}
                  </div>
                </div>
            )}
          </div>

          {/* Contrôles de caméra et modes */}
          <div className="w-full flex flex-col items-end justify-center gap-4">

            {/* Mode d'interaction */}
            <div className="flex gap-2 pointer-events-auto">
              <button
                  onClick={() => setInteractionMode(interactionMode === "voice" ? "chat" : "voice")}
                  className={`p-3 rounded-md font-medium ${
                      interactionMode === "voice"
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
              >
                {interactionMode === "voice" ? "🎤 Commandes vocales" : "💬 Chat normal"}
              </button>
            </div>

            {/* Contrôles de caméra */}
            <div className="flex gap-2">
              <button
                  onClick={() => setCameraZoomed(!cameraZoomed)}
                  className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-md"
              >
                {cameraZoomed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                    </svg>
                )}
              </button>

              <button
                  onClick={() => {
                    setConsultationMode(!consultationMode);
                  }}
                  className={`pointer-events-auto p-4 rounded-md ${
                      consultationMode ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
                  } text-white`}
              >
                🏥
              </button>
            </div>
          </div>

          {/* Interface de chat */}
          <div className="flex items-center gap-2 pointer-events-auto max-w-screen-md w-full mx-auto">
            <input
                className="w-full placeholder:text-gray-600 placeholder:italic p-4 rounded-md bg-opacity-90 bg-white backdrop-blur-md border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
                placeholder={
                  interactionMode === "voice"
                      ? "Donnez une instruction au patient (ex: 'Levez-vous', 'Décrivez vos symptômes')..."
                      : "Posez une question médicale..."
                }
                ref={input}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
            />
            <button
                disabled={loading || message}
                onClick={sendMessage}
                className={`bg-blue-600 hover:bg-blue-700 text-white p-4 px-8 font-semibold uppercase rounded-md transition-all ${
                    loading || message ? "cursor-not-allowed opacity-30" : ""
                }`}
            >
              {interactionMode === "voice" ? "Commander" : "Envoyer"}
            </button>
          </div>

          {/* Indicateur de statut */}
          {loading && (
              <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Le patient réfléchit...</span>
                </div>
              </div>
          )}
        </div>
      </>
  );
};