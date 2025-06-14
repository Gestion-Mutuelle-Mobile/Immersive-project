/*
VERSION FINALE CORRIGÉE - Fix audio double + interactions
*/

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { useChat } from "../hooks/useChat";

// Expressions faciales complètes
const facialExpressions = {
  default: {},
  smile: {
    browInnerUp: 0.17,
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.44,
    noseSneerLeft: 0.1700000727403593,
    noseSneerRight: 0.14000002836874015,
    mouthPressLeft: 0.61,
    mouthPressRight: 0.41000000000000003,
  },
  funnyFace: {
    jawLeft: 0.63,
    mouthPucker: 0.53,
    noseSneerLeft: 1,
    noseSneerRight: 0.39,
    mouthLeft: 1,
    eyeLookUpLeft: 1,
    eyeLookUpRight: 1,
    cheekPuff: 0.9999924982764238,
    mouthDimpleLeft: 0.414743888682652,
    mouthRollLower: 0.32,
    mouthSmileLeft: 0.35499733688813034,
    mouthSmileRight: 0.35499733688813034,
  },
  sad: {
    mouthFrownLeft: 1,
    mouthFrownRight: 1,
    mouthShrugLower: 0.78341,
    browInnerUp: 0.452,
    eyeSquintLeft: 0.72,
    eyeSquintRight: 0.75,
    eyeLookDownLeft: 0.5,
    eyeLookDownRight: 0.5,
    jawForward: 1,
  },
  surprised: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    jawOpen: 0.351,
    mouthFunnel: 1,
    browInnerUp: 1,
  },
  angry: {
    browDownLeft: 1,
    browDownRight: 1,
    eyeSquintLeft: 1,
    eyeSquintRight: 1,
    jawForward: 1,
    jawLeft: 1,
    mouthShrugLower: 1,
    noseSneerLeft: 1,
    noseSneerRight: 0.42,
    eyeLookDownLeft: 0.16,
    eyeLookDownRight: 0.16,
    cheekSquintLeft: 1,
    cheekSquintRight: 1,
    mouthClose: 0.23,
    mouthFunnel: 0.63,
    mouthDimpleRight: 1,
  },
  crazy: {
    browInnerUp: 0.9,
    jawForward: 1,
    noseSneerLeft: 0.5700000000000001,
    noseSneerRight: 0.51,
    eyeLookDownLeft: 0.39435766259644545,
    eyeLookUpRight: 0.4039761421719682,
    eyeLookInLeft: 0.9618479575523053,
    eyeLookInRight: 0.9618479575523053,
    jawOpen: 0.9618479575523053,
    mouthDimpleLeft: 0.9618479575523053,
    mouthDimpleRight: 0.9618479575523053,
    mouthStretchLeft: 0.27893590769016857,
    mouthStretchRight: 0.2885543872656917,
    mouthSmileLeft: 0.5578718153803371,
    mouthSmileRight: 0.38473918302092225,
    tongueOut: 0.9618479575523053,
  },
  // Expressions médicales
  pain: {
    browDownLeft: 0.8,
    browDownRight: 0.8,
    eyeSquintLeft: 0.7,
    eyeSquintRight: 0.7,
    mouthFrownLeft: 0.6,
    mouthFrownRight: 0.6,
  },
  worried: {
    browInnerUp: 0.6,
    eyeLookDownLeft: 0.3,
    eyeLookDownRight: 0.3,
    mouthFrownLeft: 0.4,
    mouthFrownRight: 0.4,
  },
};

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

let setupMode = false;

export function Avatar(props) {
  const { nodes, materials, scene } = useGLTF("/models/64f1a714fe61576b46f27ca2.glb");
  const { message, onMessagePlayed, chat, handlePatientTouch, touchInteractionCooldown } = useChat();
  const { camera, raycaster, pointer } = useThree();

  const [lipsync, setLipsync] = useState();
  const [currentAudio, setCurrentAudio] = useState(null);

  // GESTION DES MESSAGES - CORRIGÉE
  useEffect(() => {
    console.log("📩 Nouveau message:", message);

    if (!message) {
      setAnimation("Idle");
      setFacialExpression("default");
      return;
    }

    // Arrêter l'audio précédent si il existe
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Appliquer l'animation et expression de l'IA
    setAnimation(message.animation || "Idle");
    setFacialExpression(message.facialExpression || "default");
    setLipsync(message.lipsync);

    // Gérer les actions spéciales
    if (message.specialAction === "wink") {
      triggerWink();
      onMessagePlayed(); // Message traité immédiatement
      return;
    }

    // Jouer l'audio si disponible
    if (message.audio) {
      const audio = new Audio("data:audio/mp3;base64," + message.audio);
      setCurrentAudio(audio);

      audio.onended = () => {
        console.log("🔊 Audio terminé");
        setCurrentAudio(null);
        setAnimation("Idle");
        setFacialExpression("default");
        onMessagePlayed(); // UNE SEULE FOIS ici
      };

      audio.onerror = () => {
        console.error("❌ Erreur audio");
        setCurrentAudio(null);
        onMessagePlayed();
      };

      audio.play().catch(console.error);
    } else {
      // Pas d'audio, retour à Idle après délai
      setTimeout(() => {
        setAnimation("Idle");
        setFacialExpression("default");
        onMessagePlayed();
      }, 2000);
    }
  }, [message]); // PAS onMessagePlayed dans les deps!

  const { animations } = useGLTF("/models/animations.glb");
  const group = useRef();
  const { actions, mixer } = useAnimations(animations, group);

  const [animation, setAnimation] = useState("Idle");

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
        if (animation !== "Idle") {
          setAnimation("Idle");
        }
      }
    }
  }, [animation, actions]);

  // FONCTION DE CLIC CORRIGÉE
  const handleClick = (event) => {
    event.stopPropagation();

    // Vérifier les conditions d'interaction
    if (touchInteractionCooldown) {
      console.log("⏰ Interaction en cooldown");
      return;
    }

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const bodyPart = identifyBodyPart(clickedObject, intersects[0].point);

      console.log(`👆 Clic sur: ${bodyPart}`);

      // Appeler la fonction du hook
      handlePatientTouch(bodyPart);
    }
  };

  // Identification des parties du corps
  const identifyBodyPart = (object, point) => {
    const objectName = object.name.toLowerCase();
    const position = point;

    if (objectName.includes('head') || objectName.includes('hair') || objectName.includes('eye') || objectName.includes('teeth')) {
      return 'head';
    } else if (objectName.includes('body') || objectName.includes('outfit_top')) {
      return position.y > 1.3 ? 'chest' : 'abdomen';
    } else if (objectName.includes('outfit_bottom')) {
      return 'pelvis';
    } else if (objectName.includes('footwear')) {
      return 'feet';
    }

    if (position.y > 1.5) return 'head';
    if (position.y > 1.2) return 'chest';
    if (position.y > 0.8) return 'abdomen';
    return 'feet';
  };

  // Fonction pour clignotement spécial
  const triggerWink = () => {
    setWinkLeft(true);
    setTimeout(() => setWinkLeft(false), 300);
  };

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (index === undefined || child.morphTargetInfluences[index] === undefined) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
            child.morphTargetInfluences[index],
            value,
            speed
        );

        if (!setupMode) {
          try {
            set({
              [target]: value,
            });
          } catch (e) {}
        }
      }
    });
  };

  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);
  const [facialExpression, setFacialExpression] = useState("default");

  useFrame(() => {
    !setupMode &&
    Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
      const mapping = facialExpressions[facialExpression];
      if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
        return;
      }
      if (mapping && mapping[key]) {
        lerpMorphTarget(key, mapping[key], 0.1);
      } else {
        lerpMorphTarget(key, 0, 0.1);
      }
    });

    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

    // LIPSYNC
    if (setupMode) return;

    const appliedMorphTargets = [];
    if (message && lipsync && currentAudio) {
      const currentAudioTime = currentAudio.currentTime;
      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const mouthCue = lipsync.mouthCues[i];
        if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
          appliedMorphTargets.push(corresponding[mouthCue.value]);
          lerpMorphTarget(corresponding[mouthCue.value], 1, 0.2);
          break;
        }
      }
    }

    Object.values(corresponding).forEach((value) => {
      if (appliedMorphTargets.includes(value)) {
        return;
      }
      lerpMorphTarget(value, 0, 0.1);
    });
  });

  // CONTRÔLES avec nouvelles fonctions
  useControls("FacialExpressions", {
    chat: button(() => chat("Comment vous sentez-vous ?")),
    "Clin d'œil gauche": button(() => {
      setWinkLeft(true);
      setTimeout(() => setWinkLeft(false), 300);
    }),
    "Clin d'œil droit": button(() => {
      setWinkRight(true);
      setTimeout(() => setWinkRight(false), 300);
    }),
    animation: {
      value: animation,
      options: animations.map((a) => a.name),
      onChange: (value) => setAnimation(value),
    },
    facialExpression: {
      value: facialExpression,
      options: Object.keys(facialExpressions),
      onChange: (value) => setFacialExpression(value),
    },
    enableSetupMode: button(() => {
      setupMode = true;
    }),
    disableSetupMode: button(() => {
      setupMode = false;
    }),
  });

  // Debug cooldown
  useControls("Debug Interaction", {
    "Cooldown actif": { value: touchInteractionCooldown, disabled: true },
    "Test tête": button(() => handlePatientTouch("head")),
    "Test poitrine": button(() => handlePatientTouch("chest")),
  });

  const [, set] = useControls("MorphTarget", () =>
      Object.assign(
          {},
          ...Object.keys(nodes.EyeLeft.morphTargetDictionary).map((key) => {
            return {
              [key]: {
                label: key,
                value: 0,
                min: 0,
                max: 1,
                onChange: (val) => {
                  if (setupMode) {
                    lerpMorphTarget(key, val, 1);
                  }
                },
              },
            };
          })
      )
  );

  // Clignement automatique
  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Nettoyage audio
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  return (
      <group {...props} dispose={null} ref={group}>
        <primitive object={nodes.Hips} />

        {/* Tous les mesh avec interaction */}
        <skinnedMesh
            name="Wolf3D_Body"
            geometry={nodes.Wolf3D_Body.geometry}
            material={materials.Wolf3D_Body}
            skeleton={nodes.Wolf3D_Body.skeleton}
            onClick={handleClick}
            onPointerEnter={() => !touchInteractionCooldown && (document.body.style.cursor = 'pointer')}
            onPointerLeave={() => document.body.style.cursor = 'default'}
        />
        <skinnedMesh
            name="Wolf3D_Outfit_Bottom"
            geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
            material={materials.Wolf3D_Outfit_Bottom}
            skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
            onClick={handleClick}
            onPointerEnter={() => !touchInteractionCooldown && (document.body.style.cursor = 'pointer')}
            onPointerLeave={() => document.body.style.cursor = 'default'}
        />
        <skinnedMesh
            name="Wolf3D_Outfit_Footwear"
            geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
            material={materials.Wolf3D_Outfit_Footwear}
            skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
            onClick={handleClick}
            onPointerEnter={() => !touchInteractionCooldown && (document.body.style.cursor = 'pointer')}
            onPointerLeave={() => document.body.style.cursor = 'default'}
        />
        <skinnedMesh
            name="Wolf3D_Outfit_Top"
            geometry={nodes.Wolf3D_Outfit_Top.geometry}
            material={materials.Wolf3D_Outfit_Top}
            skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
            onClick={handleClick}
            onPointerEnter={() => !touchInteractionCooldown && (document.body.style.cursor = 'pointer')}
            onPointerLeave={() => document.body.style.cursor = 'default'}
        />
        <skinnedMesh
            name="Wolf3D_Hair"
            geometry={nodes.Wolf3D_Hair.geometry}
            material={materials.Wolf3D_Hair}
            skeleton={nodes.Wolf3D_Hair.skeleton}
            onClick={handleClick}
            onPointerEnter={() => !touchInteractionCooldown && (document.body.style.cursor = 'pointer')}
            onPointerLeave={() => document.body.style.cursor = 'default'}
        />
        <skinnedMesh
            name="EyeLeft"
            geometry={nodes.EyeLeft.geometry}
            material={materials.Wolf3D_Eye}
            skeleton={nodes.EyeLeft.skeleton}
            morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
            morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
            onClick={handleClick}
            onPointerEnter={() => !touchInteractionCooldown && (document.body.style.cursor = 'pointer')}
            onPointerLeave={() => document.body.style.cursor = 'default'}
        />
        <skinnedMesh
            name="EyeRight"
            geometry={nodes.EyeRight.geometry}
            material={materials.Wolf3D_Eye}
            skeleton={nodes.EyeRight.skeleton}
            morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
            morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
            onClick={handleClick}
            onPointerEnter={() => !touchInteractionCooldown && (document.body.style.cursor = 'pointer')}
            onPointerLeave={() => document.body.style.cursor = 'default'}
        />
        <skinnedMesh
            name="Wolf3D_Head"
            geometry={nodes.Wolf3D_Head.geometry}
            material={materials.Wolf3D_Skin}
            skeleton={nodes.Wolf3D_Head.skeleton}
            morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
            morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
            onClick={handleClick}
            onPointerEnter={() => !touchInteractionCooldown && (document.body.style.cursor = 'pointer')}
            onPointerLeave={() => document.body.style.cursor = 'default'}
        />
        <skinnedMesh
            name="Wolf3D_Teeth"
            geometry={nodes.Wolf3D_Teeth.geometry}
            material={materials.Wolf3D_Teeth}
            skeleton={nodes.Wolf3D_Teeth.skeleton}
            morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
            morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
            onClick={handleClick}
            onPointerEnter={() => !touchInteractionCooldown && (document.body.style.cursor = 'pointer')}
            onPointerLeave={() => document.body.style.cursor = 'default'}
        />
      </group>
  );
}

useGLTF.preload("/models/64f1a714fe61576b46f27ca2.glb");
useGLTF.preload("/models/animations.glb");