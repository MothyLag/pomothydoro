import { Canvas } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";

interface ClockBoxProps {
    time: string;
    title: string;
}

export default ({ time, title }: ClockBoxProps) => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Canvas>
                <RoundedBox args={[2, 2, 2]} radius={0.2} smoothness={4}>
                    <meshToonMaterial />
                </RoundedBox>
                <Text position={[0, 0, 1.01]} fontSize={0.4} color="white">
                    {time}
                </Text>
                <ambientLight intensity={0.1} />
                <directionalLight position={[0, 0, 5]} color="red" />
            </Canvas>
        </div>
    );
};
