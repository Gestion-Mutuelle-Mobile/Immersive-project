import { useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { Suspense } from "react";

export function MedicalRoom() {
    const { roomScale, roomPosition, roomRotation, showRoom } = useControls("Salle Médicale", {
        showRoom: { value: true, label: "Afficher la salle" },
        roomScale: { value: 1, min: 0.1, max: 5, step: 0.1, label: "Taille" },
        roomPosition: {
            value: { x: 2, y: 0, z: 9 },
            step: 0.1,
            label: "Position"
        },
        roomRotation: {
            value: { x: 0, y: 0, z: 0 },
            min: -Math.PI,
            max: Math.PI,
            step: 0.1,
            label: "Rotation"
        }
    });

    if (!showRoom) return null;

    return (
        <Suspense fallback={null}>
            <RoomModel
                scale={roomScale}
                position={[roomPosition.x, roomPosition.y, roomPosition.z]}
                rotation={[roomRotation.x, roomRotation.y, roomRotation.z]}
            />
        </Suspense>
    );
}

function RoomModel(props) {
    try {
        const { scene } = useGLTF("/models/Salle.glb");
        return <primitive object={scene} {...props} />;
    } catch (error) {
        console.error("❌ Erreur chargement salle:", error);
        return (
            <group {...props}>
                {/* Salle de secours simple */}
                <mesh position={[0, -0.1, 0]}>
                    <planeGeometry args={[8, 8]} />
                    <meshStandardMaterial color="#f0f0f0" />
                </mesh>
                <mesh position={[0, 2, -3]}>
                    <planeGeometry args={[8, 4]} />
                    <meshStandardMaterial color="#e0e0e0" />
                </mesh>
            </group>
        );
    }
}

useGLTF.preload("/models/Salle.glb");