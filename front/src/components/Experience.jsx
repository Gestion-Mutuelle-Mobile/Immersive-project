import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
  Sphere,
  Box,
  Plane,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Avatar } from "./Avatar";
import * as THREE from "three";
import {MedicalRoom} from "./MedicalRoom.jsx";

const Dots = (props) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);

  if (!loading) return null;

  return (
      <group {...props}>
        <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
          {loadingText}
          <meshBasicMaterial attach="material" color="#2563eb" />
        </Text>
      </group>
  );
};

// Indicateur d'état du patient
const PatientStatusIndicator = () => {
  const { patientState, loading, message } = useChat();

  const getStatusInfo = () => {
    if (loading) return { text: "Réflexion...", color: "#f59e0b" };
    if (message) return { text: "Parle...", color: "#10b981" };

    switch(patientState) {
      case 'sitting': return { text: "Assis", color: "#3b82f6" };
      case 'lying': return { text: "Allongé", color: "#8b5cf6" };
      case 'walking': return { text: "Debout", color: "#f97316" };
      case 'coughing': return { text: "Tousse", color: "#ef4444" };
      default: return { text: "Au repos", color: "#6b7280" };
    }
  };

  const status = getStatusInfo();

  return (
      <group position={[0, 2.5, 0]}>
        <Text
            fontSize={0.12}
            anchorX="center"
            anchorY="center"
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        >
          État: {status.text}
          <meshBasicMaterial attach="material" color={status.color} />
        </Text>

        {/* Petit indicateur visuel */}
        <Sphere args={[0.02]} position={[0, -0.15, 0]}>
          <meshBasicMaterial color={status.color} />
        </Sphere>
      </group>
  );
};

// Outils médicaux virtuels dans la scène
const MedicalTools = () => {
  const { handlePatientTouch } = useChat();

  const handleToolClick = (tool) => {
    console.log(`🩺 Utilisation de l'outil: ${tool}`);
    // Simuler l'utilisation d'un outil médical
    switch(tool) {
      case 'stethoscope':
        handlePatientTouch('chest');
        break;
      case 'thermometer':
        handlePatientTouch('head');
        break;
      case 'reflex_hammer':
        handlePatientTouch('leg');
        break;
    }
  };

  return (
      <group position={[2, 1, 0]}>
        {/* Stéthoscope */}
        <group position={[0, 0.5, 0]} onClick={() => handleToolClick('stethoscope')}>
          <Box args={[0.1, 0.1, 0.02]}>
            <meshStandardMaterial color="#2563eb" />
          </Box>
          <Text fontSize={0.08} position={[0, -0.15, 0]} anchorX="center">
            Stéthoscope
            <meshBasicMaterial color="#374151" />
          </Text>
        </group>

        {/* Thermomètre */}
        <group position={[0, 0, 0]} onClick={() => handleToolClick('thermometer')}>
          <Box args={[0.05, 0.2, 0.02]}>
            <meshStandardMaterial color="#dc2626" />
          </Box>
          <Text fontSize={0.08} position={[0, -0.15, 0]} anchorX="center">
            Thermomètre
            <meshBasicMaterial color="#374151" />
          </Text>
        </group>

        {/* Marteau à réflexes */}
        <group position={[0, -0.5, 0]} onClick={() => handleToolClick('reflex_hammer')}>
          <Box args={[0.15, 0.05, 0.02]}>
            <meshStandardMaterial color="#7c3aed" />
          </Box>
          <Text fontSize={0.08} position={[0, -0.15, 0]} anchorX="center">
            Marteau
            <meshBasicMaterial color="#374151" />
          </Text>
        </group>
      </group>
  );
};

// Environnement médical simple
const MedicalEnvironment = () => {
  return (
      <group>
        {/* Sol médical */}
        <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <meshStandardMaterial color="#f8fafc" />
        </Plane>

        {/* Mur arrière */}
        {/*<Plane args={[8, 6]} position={[0, 2, -3]}>*/}
        {/*  <meshStandardMaterial color="#e2e8f0" />*/}
        {/*</Plane>*/}

        {/* Éclairage médical */}
        <pointLight position={[2, 4, 2]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-2, 4, 2]} intensity={0.3} color="#f0f9ff" />

        {/* Éclairage ambiant */}
        <ambientLight intensity={0.6} color="#f8fafc" />
      </group>
  );
};

// Instructions visuelles
const InteractionGuide = () => {
  const { consultationMode, interactionMode } = useChat();

  if (!consultationMode) return null;

  return (
      <group position={[-2.5, 1.5, 0]}>
        <Text
            fontSize={0.08}
            anchorX="left"
            anchorY="top"
            maxWidth={2}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        >
          {interactionMode === 'voice'
              ? "🎤 Mode Commandes:\n• 'Levez-vous'\n• 'Asseyez-vous'\n• 'Toussez'\n• Cliquez sur le patient"
              : "💬 Mode Chat:\n• Conversation libre\n• Questions médicales\n• Cliquez sur le patient"
          }
          <meshBasicMaterial attach="material" color="#4b5563" />
        </Text>
      </group>
  );
};

export const Experience = () => {
  const cameraControls = useRef();
  const { cameraZoomed, consultationMode } = useChat();

  useEffect(() => {
    // Position initiale de la caméra - vue d'ensemble médicale
    cameraControls.current.setLookAt(0, 2, 5, 0, 1.5, 0);
  }, []);

  useEffect(() => {
    if (cameraZoomed) {
      // Vue rapprochée pour l'examen
      cameraControls.current.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
    } else {
      // Vue d'ensemble de la consultation
      cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
    }
  }, [cameraZoomed]);

  return (
      <>
        <CameraControls ref={cameraControls} />

        {/* Environnement selon le mode */}
        {consultationMode ? (
            <MedicalEnvironment />
        ) : (
            <Environment preset="sunset" />
        )}

        {/* Patient/Avatar */}
        <Avatar />

        {/* Indicateurs et outils */}
        <Suspense fallback={null}>
          <PatientStatusIndicator />
          <Dots position-y={1.75} position-x={-0.02} />
          {consultationMode && <MedicalTools />}
          <InteractionGuide />
        </Suspense>

        {/* Ombres */}
        <ContactShadows
            opacity={consultationMode ? 0.4 : 0.7}
            scale={10}
            blur={2}
            far={4}
            color={consultationMode ? "#94a3b8" : "#000000"}
        />

        {/* Éclairage conditionnel */}
        {!consultationMode && <Environment preset="sunset" />}
          <MedicalRoom />
      </>
  );
};