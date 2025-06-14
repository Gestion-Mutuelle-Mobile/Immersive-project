# 🏥 Simulation Médicale Immersive 3D

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture du projet](#architecture-du-projet)
- [Installation et configuration](#installation-et-configuration)
- [Synchronisation labiale - Guide technique détaillé](#synchronisation-labiale---guide-technique-détaillé)
- [Intelligence artificielle et génération vocale](#intelligence-artificielle-et-génération-vocale)
- [Interactions 3D et animations](#interactions-3d-et-animations)
- [Interface utilisateur médicale](#interface-utilisateur-médicale)
- [API et endpoints](#api-et-endpoints)
- [Débogage et développement](#débogage-et-développement)
- [Performances et optimisations](#performances-et-optimisations)
- [Troubleshooting](#troubleshooting)
- [Roadmap et améliorations futures](#roadmap-et-améliorations-futures)

## Vue d'ensemble

La **Simulation Médicale Immersive 3D** est une application web avancée conçue pour former les étudiants en médecine à travers des consultations virtuelles interactives. Le projet simule un patient virtuel en 3D capable de répondre aux questions, réagir aux examens physiques et exprimer des symptômes de manière réaliste.

### 🎯 Objectifs pédagogiques

- **Formation pratique** : Permettre aux étudiants de pratiquer les consultations médicales sans risque
- **Interaction réaliste** : Simulations d'examens physiques avec retours appropriés
- **Diversité des cas** : Différents symptômes et pathologies simulés
- **Évaluation continue** : Suivi des actions et décisions des étudiants

### 🏗️ Architecture technique

Le système repose sur une architecture client-serveur moderne :
- **Frontend** : React + Three.js pour la 3D immersive
- **Backend** : Node.js + Express pour l'orchestration
- **IA** : Google Gemini pour les réponses contextuelles
- **Audio** : ElevenLabs pour la synthèse vocale
- **Synchronisation** : Rhubarb Lip Sync pour l'animation faciale

## Fonctionnalités

### 🎭 Patient virtuel intelligent
- **Réponses contextuelles** adaptées aux questions médicales
- **Expressions faciales** dynamiques (douleur, inquiétude, surprise)
- **Animations corporelles** réalistes selon les symptômes
- **Synchronisation labiale** parfaite avec la parole

### 🩺 Examens physiques interactifs
- **Zones corporelles cliquables** (tête, poitrine, abdomen, membres)
- **Réactions appropriées** aux examens selon la zone touchée
- **Feedback visuel et audio** immédiat
- **Système de cooldown** pour éviter les interactions répétées

### 💬 Communication naturelle
- **Chat textuel** pour questions ouvertes
- **Commandes vocales** pour instructions directes
- **Réponses audio** avec synchronisation labiale
- **Interface multilingue** (français principalement)

### 🏥 Environnement médical
- **Salle de consultation** 3D modélisable
- **Outils médicaux virtuels** (stéthoscope, thermomètre)
- **Interface diagnostique** pour prise de notes
- **Modes d'interaction** multiples

## Technologies utilisées

### Frontend (React + Three.js)

```json
{
  "dependencies": {
    "@react-three/drei": "9.75.0",
    "@react-three/fiber": "8.13.3", 
    "@react-three/xr": "^5.7.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "0.153.0",
    "leva": "^0.9.35"
  }
}
```

**Rôles des principales bibliothèques :**
- **@react-three/fiber** : Bridge React-Three.js pour composants 3D déclaratifs
- **@react-three/drei** : Utilitaires et composants 3D prêts à l'emploi
- **three** : Moteur 3D WebGL pour rendu et animations
- **leva** : Interface de contrôle en temps réel pour développement

### Backend (Node.js + IA)

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.22.0",
    "elevenlabs-node": "latest",
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  }
}
```

**Services intégrés :**
- **Google Gemini AI** : Génération de réponses contextuelles
- **ElevenLabs** : Synthèse vocale ultra-réaliste
- **Express** : Serveur HTTP et gestion des routes
- **FFmpeg** : Conversion et traitement audio
- **Rhubarb Lip Sync** : Analyse phonétique pour synchronisation

### Outils de développement

- **Vite** : Build tool moderne et serveur de développement
- **TailwindCSS** : Framework CSS utilitaire
- **PostCSS** : Traitement CSS avancé
- **ESLint** : Linting et qualité de code

## Architecture du projet

```
tiger-foxx-my-ai-gf/
├── README.md
├── code-back/                    # Serveur Node.js
│   ├── index.js                 # Point d'entrée du serveur
│   ├── package.json             # Dépendances backend
│   ├── .env.example             # Variables d'environnement
│   └── audios/                  # Fichiers audio générés
│       ├── message_*.mp3        # Audio synthétisé
│       ├── message_*.wav        # Audio converti
│       ├── message_*.json       # Données de synchronisation
│       └── intro_*.wav          # Messages d'accueil
└── code-front/                  # Application React
    ├── index.html               # Point d'entrée HTML
    ├── package.json             # Dépendances frontend
    ├── vite.config.js           # Configuration Vite
    ├── tailwind.config.js       # Configuration TailwindCSS
    ├── public/                  # Assets statiques
    │   ├── animations/          # Fichiers d'animation FBX
    │   │   ├── Idle.fbx
    │   │   ├── Talking_*.fbx
    │   │   ├── Angry.fbx
    │   │   └── ...
    │   └── models/              # Modèles 3D
    │       ├── 64f1a714fe61576b46f27ca2.glb  # Modèle patient
    │       ├── animations.glb   # Animations compilées
    │       └── Salle.dae        # Environnement médical
    └── src/                     # Code source React
        ├── App.jsx              # Composant racine
        ├── main.jsx             # Point d'entrée React
        ├── index.css            # Styles globaux
        ├── components/          # Composants React
        │   ├── Avatar.jsx       # Patient 3D principal
        │   ├── Experience.jsx   # Scène 3D principale
        │   ├── UI.jsx           # Interface utilisateur
        │   └── MedicalRoom.jsx  # Environnement médical
        └── hooks/               # Hooks React personnalisés
            └── useChat.jsx      # Gestion de la communication
```

## Installation et configuration

### Prérequis système

- **Node.js** ≥ 16.0.0
- **npm** ou **yarn**
- **FFmpeg** installé et accessible via PATH
- **Rhubarb Lip Sync** installé et accessible via PATH

### Installation de Rhubarb Lip Sync

#### Windows
```bash
# Télécharger depuis https://github.com/DanielSWolf/rhubarb-lip-sync/releases
# Extraire et ajouter au PATH
```

#### macOS
```bash
brew install rhubarb-lip-sync
```

#### Linux
```bash
# Compiler depuis les sources ou utiliser AppImage
wget https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v1.13.0/Rhubarb-Lip-Sync-1.13.0-Linux.zip
```

### Installation du projet

1. **Cloner le repository**
```bash
git clone <repository-url>
cd tiger-foxx-my-ai-gf
```

2. **Configuration du backend**
```bash
cd code-back
npm install

# Créer le fichier .env
cp .env.example .env
```

3. **Variables d'environnement (.env)**
```env
# Clé API Google Gemini
GEMINI_API_KEY=votre_clé_gemini_ici

# Clé API ElevenLabs
ELEVEN_LABS_API_KEY=sk_votre_clé_elevenlabs_ici

# Configuration serveur
PORT=3000
NODE_ENV=development
```

4. **Configuration du frontend**
```bash
cd ../code-front
npm install

# Créer le fichier d'environnement local
echo "VITE_API_URL=http://localhost:3000" > .env.local
```

5. **Démarrage en développement**

Terminal 1 (Backend) :
```bash
cd code-back
npm start
```

Terminal 2 (Frontend) :
```bash
cd code-front
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Synchronisation labiale - Guide technique détaillé

La synchronisation labiale est l'une des fonctionnalités les plus complexes et impressionnantes du projet. Elle permet au patient virtuel de "parler" de manière naturelle en synchronisant les mouvements de bouche avec l'audio.

### 🔧 Pipeline de traitement

#### 1. Génération de l'audio (ElevenLabs)

```javascript
// Backend : index.js
await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, message.text, {
  model_id: "eleven_multilingual_v2",
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.2
  }
});
```

**Paramètres optimisés :**
- **model_id** : `eleven_multilingual_v2` pour supporter le français
- **stability** : 0.5 pour équilibre naturalité/cohérence
- **similarity_boost** : 0.8 pour maintenir la voix du personnage
- **style** : 0.2 pour légère expressivité émotionnelle

#### 2. Conversion audio (FFmpeg)

```javascript
// Conversion MP3 → WAV pour Rhubarb
await execCommand(
  `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
);
```

**Pourquoi cette conversion ?**
- Rhubarb nécessite des fichiers WAV non compressés
- Meilleure précision d'analyse phonétique
- Format standardisé pour tous les traitements

#### 3. Analyse phonétique (Rhubarb Lip Sync)

```javascript
// Génération des données de synchronisation
await execCommand(
  `rhubarb -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`
);
```

**Options Rhubarb expliquées :**
- **-f json** : Format de sortie JSON pour intégration web
- **-o** : Fichier de sortie pour les données
- **-r phonetic** : Mode d'analyse phonétique (vs PocketSphinx)

#### 4. Structure des données générées

```json
{
  "metadata": {
    "soundFile": "message_0.wav",
    "duration": 2.34
  },
  "mouthCues": [
    {
      "start": 0.00,
      "end": 0.13,
      "value": "X"
    },
    {
      "start": 0.13, 
      "end": 0.26,
      "value": "B"
    },
    {
      "start": 0.26,
      "end": 0.41,
      "value": "C"
    }
  ]
}
```

**Signification des valeurs :**
- **start/end** : Timestamps en secondes
- **value** : Phonème correspondant (A, B, C, D, E, F, G, H, X)

### 🎯 Mapping phonétique → Visèmes

Les phonèmes de Rhubarb sont mappés vers les visèmes (positions de bouche) du modèle 3D :

```javascript
// Avatar.jsx - Correspondance phonème → visème
const corresponding = {
  A: "viseme_PP",    // Voyelles fermées (papa, mama)
  B: "viseme_kk",    // Consonnes occlusives (k, g, ng)
  C: "viseme_I",     // Voyelles antérieures (eat, bit)
  D: "viseme_AA",    // Voyelles ouvertes (car, lot)
  E: "viseme_O",     // Voyelles arrondies (you, book)
  F: "viseme_U",     // Voyelles fermées arrondies
  G: "viseme_FF",    // Fricatives labiodentales (f, v)
  H: "viseme_TH",    // Fricatives dentales (th)
  X: "viseme_PP"     // Silence / transitions
};
```

### ⚡ Rendu temps réel

La synchronisation est appliquée dans la boucle de rendu Three.js :

```javascript
// Avatar.jsx - useFrame hook
useFrame(() => {
  // ... autres animations ...

  const appliedMorphTargets = [];
  if (message && lipsync && currentAudio) {
    const currentAudioTime = currentAudio.currentTime;
    
    // Parcourir tous les phonèmes
    for (let i = 0; i < lipsync.mouthCues.length; i++) {
      const mouthCue = lipsync.mouthCues[i];
      
      // Vérifier si nous sommes dans la fenêtre temporelle
      if (currentAudioTime >= mouthCue.start && 
          currentAudioTime <= mouthCue.end) {
        
        // Appliquer le visème correspondant
        appliedMorphTargets.push(corresponding[mouthCue.value]);
        lerpMorphTarget(corresponding[mouthCue.value], 1, 0.2);
        break;
      }
    }
  }

  // Réinitialiser les autres visèmes
  Object.values(corresponding).forEach((value) => {
    if (appliedMorphTargets.includes(value)) {
      return;
    }
    lerpMorphTarget(value, 0, 0.1);
  });
});
```

### 🔄 Interpolation des morphs

```javascript
// Fonction d'interpolation douce des targets
const lerpMorphTarget = (target, value, speed = 0.1) => {
  scene.traverse((child) => {
    if (child.isSkinnedMesh && child.morphTargetDictionary) {
      const index = child.morphTargetDictionary[target];
      if (index === undefined || 
          child.morphTargetInfluences[index] === undefined) {
        return;
      }
      
      // Interpolation linéaire pour transition douce
      child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
        child.morphTargetInfluences[index],
        value,
        speed
      );
    }
  });
};
```

**Paramètres d'interpolation :**
- **speed = 0.2** : Activation rapide du visème
- **speed = 0.1** : Désactivation plus lente pour naturel

### 🎭 Modèle 3D et morphing

Le modèle 3D du patient utilise des **blend shapes** (morphing) :

```javascript
// Structure des morphTargets dans le modèle GLB
morphTargetDictionary: {
  "viseme_PP": 0,
  "viseme_kk": 1, 
  "viseme_I": 2,
  "viseme_AA": 3,
  "viseme_O": 4,
  "viseme_U": 5,
  "viseme_FF": 6,
  "viseme_TH": 7,
  // ... autres expressions faciales
}
```

### 📊 Métriques de performance

**Latence typique du pipeline :**
- Génération audio ElevenLabs : ~2-5 secondes
- Conversion FFmpeg : ~100-300ms
- Analyse Rhubarb : ~200-500ms
- **Total** : ~3-6 secondes selon la longueur

**Optimisations implémentées :**
- Cache des fichiers audio générés
- Traitement asynchrone non-bloquant
- Interpolation optimisée en GPU
- Préchargement des assets 3D

### 🐛 Debugging de la synchronisation

**Contrôles de développement disponibles :**

```javascript
// Contrôles Leva pour debug
useControls("Lipsync Debug", {
  "Audio Time": { value: audioTime, disabled: true },
  "Current Phoneme": { value: currentPhoneme, disabled: true },
  "Active Visemes": { value: activeVisemes, disabled: true }
});
```

**Logs de diagnostic :**
```javascript
console.log(`🎵 Audio: ${currentAudioTime.toFixed(2)}s`);
console.log(`📱 Phonème actuel: ${mouthCue.value}`);
console.log(`👄 Visème appliqué: ${corresponding[mouthCue.value]}`);
```

### ⚠️ Limitations et solutions

**Problèmes courants :**

1. **Décalage audio/visuel**
    - **Cause** : Latence de démarrage audio navigateur
    - **Solution** : Calibrage automatique +50ms

2. **Phonèmes manqués**
    - **Cause** : Analyse Rhubarb imprécise
    - **Solution** : Fallback sur phonème précédent

3. **Transitions brusques**
    - **Cause** : Vitesse d'interpolation trop élevée
    - **Solution** : Ajustement dynamique selon BPM

## Intelligence artificielle et génération vocale

### 🤖 Google Gemini Integration

Le système utilise Gemini 1.5 Flash pour générer des réponses contextuelles de patient :

```javascript
// Configuration du modèle IA
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
```

### 📝 Prompt Engineering médical

```javascript
const medicalPrompt = `Tu es un patient virtuel dans une simulation médicale pour former de jeunes médecins.

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
- animation: Talking_0, Talking_1, Talking_2, Crying, Laughing, Idle, Terrified, Angry

COMPORTEMENT:
- Parle comme un vrai patient français
- Montre de l'inquiétude pour ta santé
- Sois coopératif avec le médecin
- Décris tes symptômes de façon réaliste
- Utilise des expressions appropriées (worried/pain pour les douleurs, surprised pour les examens, etc.)

Message du médecin : "${userMessage}"`;
```

### 🎤 ElevenLabs Voice Synthesis

**Configuration optimisée pour le français :**

```javascript
await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, message.text, {
  model_id: "eleven_multilingual_v2", // Support multilingue
  voice_settings: {
    stability: 0.5,        // Équilibre cohérence/naturalité
    similarity_boost: 0.8, // Maintien du caractère vocal
    style: 0.2,           // Expressivité émotionnelle légère
    use_speaker_boost: true // Amélioration de la clarté
  }
});
```

## Interactions 3D et animations

### 🎯 Système de détection tactile

Le système utilise le raycasting Three.js pour détecter les clics sur le modèle 3D :

```javascript
const handleClick = (event) => {
  event.stopPropagation();

  // Configuration du raycaster
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    const bodyPart = identifyBodyPart(clickedObject, intersects[0].point);
    
    // Déclencher la réaction appropriée
    handlePatientTouch(bodyPart);
  }
};
```

### 🗺️ Mapping anatomique

```javascript
// Identification intelligente des parties du corps
const identifyBodyPart = (object, point) => {
  const objectName = object.name.toLowerCase();
  const position = point;

  // Identification par nom d'objet
  if (objectName.includes('head') || objectName.includes('hair') || 
      objectName.includes('eye') || objectName.includes('teeth')) {
    return 'head';
  }
  
  // Identification par position spatiale
  if (objectName.includes('body') || objectName.includes('outfit_top')) {
    return position.y > 1.3 ? 'chest' : 'abdomen';
  }

  // Fallback par position Y
  if (position.y > 1.5) return 'head';
  if (position.y > 1.2) return 'chest';
  if (position.y > 0.8) return 'abdomen';
  return 'feet';
};
```

### 🎭 Système d'animations

**Gestion des animations Three.js :**

```javascript
const { actions, mixer } = useAnimations(animations, group);

useEffect(() => {
  if (actions[animation]) {
    try {
      actions[animation]
        .reset()
        .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
        .play();
      
      return () => {
        if (actions[animation]) {
          actions[animation].fadeOut(0.5);
        }
      };
    } catch (error) {
      console.warn(`Animation ${animation} problématique:`, error);
      // Fallback vers animation sûre
      if (animation !== "Idle") {
        setAnimation("Idle");
      }
    }
  }
}, [animation, actions]);
```

**Animations disponibles :**
- **Idle** : Position repos naturelle
- **Talking_0/1/2** : Variations de conversation
- **Crying** : Expression de douleur intense
- **Angry** : Réaction d'inconfort
- **Terrified** : Surprise ou peur
- **Laughing** : Détente ou soulagement

### ⏱️ Système de cooldown

```javascript
// Prévention des interactions répétées
const [touchInteractionCooldown, setTouchInteractionCooldown] = useState(false);

const handlePatientTouch = (bodyPart) => {
  if (touchInteractionCooldown || loading) {
    return; // Ignorer si en cooldown
  }

  setTouchInteractionCooldown(true);
  
  // Traitement de l'interaction...
  
  // Cooldown de 3 secondes
  setTimeout(() => {
    setTouchInteractionCooldown(false);
  }, 3000);
};
```

## Interface utilisateur médicale

### 🏥 Design système médical

L'interface utilise TailwindCSS avec une palette médicale professionnelle :

```css
/* Couleurs principales */
--medical-blue: #2563eb;
--medical-green: #10b981;
--medical-red: #ef4444;
--medical-gray: #6b7280;
--background-medical: #f8fafc;
```

### 📱 Composants d'interface

#### Panel de consultation

```jsx
<div className="fixed left-4 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-white bg-opacity-90 p-4 rounded-lg pointer-events-auto max-w-xs">
  {/* Onglets de navigation */}
  <div className="flex gap-2 mb-4">
    <button onClick={() => setActiveTab("consultation")} 
            className={`px-3 py-1 rounded text-sm font-medium ${
              activeTab === "consultation" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}>
      Consultation
    </button>
    {/* ... autres onglets */}
  </div>
  
  {/* Contenu contextuel */}
  {activeTab === "consultation" && <ConsultationPanel />}
  {activeTab === "examination" && <ExaminationPanel />}
  {activeTab === "diagnostic" && <DiagnosticPanel />}
</div>
```

#### Commandes rapides médicales

```jsx
const medicalCommands = [
  { text: "Bonjour, comment vous sentez-vous aujourd'hui ?", type: "greeting" },
  { text: "Pouvez-vous me décrire vos symptômes ?", type: "question" },
  { text: "Depuis quand ressentez-vous ces douleurs ?", type: "question" },
  { text: "Levez-vous s'il vous plaît", type: "command" },
  { text: "Respirez profondément", type: "command" },
  { text: "Toussez pour moi", type: "command" }
];
```

### 🎮 Contrôles interactifs

#### Modes d'interaction

```jsx
const [interactionMode, setInteractionMode] = useState("voice");

// Basculement entre modes
<button onClick={() => setInteractionMode(mode === "voice" ? "chat" : "voice")}>
  {interactionMode === "voice" ? "🎤 Commandes vocales" : "💬 Chat normal"}
</button>
```

#### Zones d'examen corporel

```jsx
const bodyParts = [
  { name: "Tête", id: "head", icon: "🧠" },
  { name: "Poitrine", id: "chest", icon: "🫁" },
  { name: "Abdomen", id: "abdomen", icon: "🤱" },
  { name: "Bras gauche", id: "left_arm", icon: "💪" },
  { name: "Bras droit", id: "right_arm", icon: "💪" },
  { name: "Jambe gauche", id: "left_leg", icon: "🦵" },
  { name: "Jambe droite", id: "right_leg", icon: "🦵" }
];
```

### 📊 Indicateurs de statut

```jsx
const PatientStatusIndicator = () => {
  const { patientState, loading, message } = useChat();
  
  const getStatusInfo = () => {
    if (loading) return { text: "Réflexion...", color: "#f59e0b" };
    if (message) return { text: "Parle...", color: "#10b981" };
    
    switch(patientState) {
      case 'sitting': return { text: "Assis", color: "#3b82f6" };
      case 'lying': return { text: "Allongé", color: "#8b5cf6" };
      case 'walking': return { text: "Debout", color: "#f97316" };
      default: return { text: "Au repos", color: "#6b7280" };
    }
  };
  
  return (
    <div className="status-indicator">
      <Text color={status.color}>État: {status.text}</Text>
    </div>
  );
};
```

## API et endpoints

### 🌐 Routes principales

#### POST /chat
**Conversation principale avec le patient**

```javascript
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  
  // Validation
  if (!userMessage) {
    return res.send({ messages: defaultWelcomeMessages });
  }
  
  // Génération IA
  const prompt = buildMedicalPrompt(userMessage);
  const aiResponse = await model.generateContent(prompt);
  
  // Traitement audio et synchronisation
  const messages = await processAudioSync(aiResponse);
  
  res.send({ messages });
});
```

#### POST /medical-command
**Commandes médicales directes**

```javascript
app.post("/medical-command", async (req, res) => {
  const command = req.body.command;
  
  // Traitement des commandes spéciales
  if (isSpecialCommand(command)) {
    return res.send({ messages: handleSpecialCommand(command) });
  }
  
  // Redirection vers chat normal
  req.body.message = command;
  return handleChat(req, res);
});
```

#### GET /voices
**Liste des voix disponibles ElevenLabs**

```javascript
app.get("/voices", async (req, res) => {
  try {
    const voices = await voice.getVoices(elevenLabsApiKey);
    res.send(voices);
  } catch (error) {
    res.status(500).send({ error: "Erreur récupération voix" });
  }
});
```

### 📡 Gestion des erreurs

```javascript
// Middleware de gestion d'erreurs global
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: 'Données invalides' });
  }
  
  if (error.code === 'ENOTFOUND') {
    return res.status(503).send({ error: 'Service externe indisponible' });
  }
  
  res.status(500).send({ 
    error: 'Erreur interne du serveur',
    fallback: generateFallbackResponse()
  });
});
```

### 🔐 Sécurité et validation

```javascript
// Validation des entrées
const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    throw new Error('Message invalide');
  }
  
  if (message.length > 1000) {
    throw new Error('Message trop long');
  }
  
  // Filtrage contenu inapproprié
  if (containsInappropriateContent(message)) {
    throw new Error('Contenu non autorisé');
  }
  
  return true;
};
```

## Débogage et développement

### 🛠️ Contrôles Leva

Le système inclut des contrôles de développement exhaustifs :

```javascript
// Contrôles expressions faciales
useControls("FacialExpressions", {
  chat: button(() => chat("Test message")),
  "Clin d'œil gauche": button(() => triggerWink("left")),
  "Clin d'œil droit": button(() => triggerWink("right")),
  animation: {
    value: animation,
    options: animations.map(a => a.name),
    onChange: setAnimation
  },
  facialExpression: {
    value: facialExpression,
    options: Object.keys(facialExpressions),
    onChange: setFacialExpression
  }
});

// Contrôles de morphing détaillés
useControls("MorphTarget", () =>
  Object.assign({},
    ...Object.keys(morphTargetDictionary).map(key => ({
      [key]: {
        label: key,
        value: 0,
        min: 0,
        max: 1,
        onChange: (val) => lerpMorphTarget(key, val, 1)
      }
    }))
  )
);

// Debug synchronisation labiale
useControls("Lipsync Debug", {
  "Audio Time": { value: audioTime, disabled: true },
  "Current Phoneme": { value: currentPhoneme, disabled: true },
  "Viseme Active": { value: activeViseme, disabled: true },
  "Manual Sync": button(() => testLipsync())
});

// Contrôles salle médicale
useControls("🏥 Salle Médicale", {
  showRoom: { value: true, label: "Afficher la salle" },
  roomScale: { value: 1, min: 0.1, max: 3, step: 0.1 },
  roomPositionX: { value: 0, min: -10, max: 10, step: 0.1 },
  roomPositionY: { value: 0, min: -5, max: 5, step: 0.1 },
  roomPositionZ: { value: 0, min: -10, max: 10, step: 0.1 },
  roomRotationY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 }
});
```

### 📊 Logging système

```javascript
// Logger configuré pour développement
const Logger = {
  info: (msg, data) => console.log(`ℹ️  ${msg}`, data),
  warn: (msg, data) => console.warn(`⚠️  ${msg}`, data),
  error: (msg, error) => console.error(`❌ ${msg}`, error),
  debug: (msg, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`🐛 ${msg}`, data);
    }
  },
  
  // Logs spécialisés
  audio: (msg, data) => console.log(`🔊 ${msg}`, data),
  ai: (msg, data) => console.log(`🤖 ${msg}`, data),
  interaction: (msg, data) => console.log(`👆 ${msg}`, data),
  animation: (msg, data) => console.log(`🎭 ${msg}`, data)
};
```

### 🔍 Performance monitoring

```javascript
// Métriques de performance
const PerformanceMonitor = {
  startTimer: (label) => {
    console.time(label);
    return label;
  },
  
  endTimer: (label) => {
    console.timeEnd(label);
  },
  
  measureAudioGeneration: async (fn) => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    Logger.audio(`Génération audio: ${(end - start).toFixed(2)}ms`);
    return result;
  },
  
  measureLipsyncProcessing: async (fn) => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    Logger.debug(`Traitement lipsync: ${(end - start).toFixed(2)}ms`);
    return result;
  }
};
```

## Performances et optimisations

### ⚡ Optimisations Three.js

```javascript
// Configuration du renderer pour performance
const renderer = new THREE.WebGLRenderer({
  canvas: canvasRef.current,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});

// Optimisations de rendu
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
```

### 🚀 Optimisations audio

```javascript
// Cache audio pour éviter régénération
const audioCache = new Map();

const getCachedAudio = async (text, voiceSettings) => {
  const cacheKey = `${text}_${JSON.stringify(voiceSettings)}`;
  
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey);
  }
  
  const audio = await generateAudio(text, voiceSettings);
  audioCache.set(cacheKey, audio);
  
  return audio;
};
```

### 💾 Gestion mémoire

```javascript
// Nettoyage automatique des assets
useEffect(() => {
  return () => {
    // Nettoyage audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }
    
    // Nettoyage Three.js
    if (scene) {
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }
    
    // Nettoyage timeouts
    clearAllTimeouts();
  };
}, []);
```

### 📈 Métriques de performance

**Objectifs de performance :**
- **Temps de réponse IA** : < 3 secondes
- **Génération audio** : < 5 secondes
- **FPS 3D** : > 30 FPS constant
- **Latence interaction** : < 100ms
- **Mémoire utilisée** : < 500MB

**Monitoring automatique :**
```javascript
// Monitoring FPS
let frameCount = 0;
let lastTime = performance.now();

const monitorFPS = () => {
  frameCount++;
  const currentTime = performance.now();
  
  if (currentTime - lastTime >= 1000) {
    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    Logger.debug(`FPS: ${fps}`);
    
    if (fps < 30) {
      Logger.warn(`Performance dégradée: ${fps} FPS`);
    }
    
    frameCount = 0;
    lastTime = currentTime;
  }
};
```

## Troubleshooting

### ❌ Problèmes courants

#### 1. Audio ne se lit pas / double lecture

**Causes possibles :**
- Gestion multiple de `onended`
- Autoplay bloqué par le navigateur
- Conflits entre instances audio

**Solutions :**
```javascript
// Solution 1: Gestion unique de onended
useEffect(() => {
  if (!message?.audio) return;
  
  const audio = new Audio("data:audio/mp3;base64=" + message.audio);
  setCurrentAudio(audio);
  
  // UNE SEULE gestion de fin
  audio.onended = () => {
    setCurrentAudio(null);
    onMessagePlayed(); // Une seule fois
  };
  
  audio.play().catch(console.error);
}, [message]); // PAS onMessagePlayed dans deps

// Solution 2: Forcer interaction utilisateur
const enableAudio = () => {
  const dummy = new Audio();
  dummy.play().then(() => dummy.pause());
};
```

#### 2. Synchronisation labiale décalée

**Diagnostic :**
```javascript
// Vérifier timing
console.log({
  audioTime: audio.currentTime,
  expectedPhoneme: getCurrentExpectedPhoneme(),
  actualViseme: getCurrentViseme()
});
```

**Correction calibrage :**
```javascript
// Ajustement offset
const LIPSYNC_OFFSET = 0.05; // 50ms d'avance
const adjustedTime = audio.currentTime + LIPSYNC_OFFSET;
```

#### 3. Interactions ne fonctionnent plus

**Vérifications :**
```javascript
// Debug état interaction
console.log({
  touchInteractionCooldown,
  loading,
  message: !!message,
  canInteract: !touchInteractionCooldown && !loading && !message
});
```

#### 4. Animations cassées / T-pose

**Causes :**
- Animation inexistante dans le fichier GLB
- Conflit entre animations
- Problème de skeleton

**Solution :**
```javascript
// Vérification sécurisée
const setAnimationSafe = (animationName) => {
  if (actions[animationName]) {
    setAnimation(animationName);
  } else {
    console.warn(`Animation ${animationName} non trouvée, fallback vers Idle`);
    setAnimation("Idle");
  }
};
```

#### 5. Erreurs console Three.js PropertyBinding

**Cause :** Animations avec références vers bones inexistants

**Solution :**
```javascript
// Ignorer erreurs non-critiques
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('PropertyBinding') && 
      args[0]?.includes?.('wasn\'t found')) {
    return; // Ignorer ces erreurs spécifiques
  }
  originalConsoleError.apply(console, args);
};
```

### 🔧 Scripts de diagnostic

```bash
# Vérification dépendances audio
npm run check-audio-deps

# Test pipeline complet
npm run test-pipeline

# Diagnostic modèles 3D
npm run validate-models

# Nettoyage cache
npm run clean-cache
```

### 📞 Support technique

**Informations à fournir :**
1. Version navigateur et OS
2. Messages d'erreur console complets
3. Configuration GPU (chrome://gpu)
4. Logs serveur backend
5. Étapes de reproduction

## Roadmap et améliorations futures

### 🎯 Version 2.0 - Améliorations prévues

#### 🏥 Fonctionnalités médicales avancées

- **Pathologies multiples** : Simulation de cas complexes
- **Examens spécialisés** : Auscultation, palpation, réflexes
- **Outils médicaux** : Stéthoscope, tensiomètre, otoscope interactifs
- **Historique médical** : Dossier patient complet et évolutif

#### 🤖 Intelligence artificielle

- **Modèles spécialisés** : Formation sur corpus médical
- **Personnalités patients** : Différents profils psychologiques
- **Apprentissage adaptatif** : IA qui s'améliore selon les interactions
- **Diagnostic assistant** : Aide au diagnostic pour l'étudiant

#### 🎭 Rendu et interactions

- **Modèles haute résolution** : Avatars ultra-réalistes
- **Physiologie avancée** : Rougeur, transpiration, tremblements
- **Haptique** : Retour tactile pour examens
- **Eye tracking** : Suivi du regard pour interactions naturelles

#### 🌐 Collaboration et évaluation

- **Mode multi-utilisateur** : Consultations en équipe
- **Enregistrement sessions** : Replay et analyse
- **Évaluation automatique** : Scoring des performances
- **Scénarios scriptés** : Cas d'étude structurés

### 🔮 Vision long terme

#### Intégration AR/VR
```javascript
// Préparation WebXR
import { VRButton, ARButton, XR } from '@react-three/xr';

export const MedicalSimulationVR = () => {
  return (
    <XR>
      <VRButton />
      <Canvas>
        <Experience />
      </Canvas>
    </XR>
  );
};
```

#### IA médicale spécialisée
- **Diagnostic assistant** basé sur symptômes
- **Base de connaissances** médicale intégrée
- **Simulation pathologies** rares
- **Formation continue** adaptative

#### Écosystème éducatif
- **LMS intégré** pour cursus médical
- **Certification** des compétences
- **Analytics** d'apprentissage
- **Communauté** d'étudiants et formateurs

