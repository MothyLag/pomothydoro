import { Canvas } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";

interface ClockBoxProps {
    time: string;
    title: string;
}

export default ({ time, title }: ClockBoxProps) => {
    const { scene, materials } = useGLTF("/assets/pomoclock.gltf");
    materials.Glass.needsUpdate = true;

    return (
        <div className="w-full h-full flex justify-center items-center">
            <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
                {/* Lights */}
                <ambientLight intensity={0.1} />
                <directionalLight position={[2, 4, 8]} intensity={0.8} />

                {/* 3D model (from GLTF) */}
                {scene && (
                    <primitive
                        object={scene}
                        position={[0, -0.5, 0]}
                        rotation={[-0.12, 11, 0]}
                        scale={[1.2, 1.2, 1.2]}
                    />
                )}

                <Text position={[0, 0, 1.01]} fontSize={0.4} color="white">
                    {time}
                </Text>
            </Canvas>
        </div>
    );
};
