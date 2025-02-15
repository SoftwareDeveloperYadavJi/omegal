import { useEffect, useRef, useState } from "react";
import { Room } from "./Room";

export const Landing = () => {
    const [name, setName] = useState("");
    const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    const [joined, setJoined] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const getCam = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            console.error("getUserMedia is not supported in this browser.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const audioTrack = stream.getAudioTracks()[0] || null;
            const videoTrack = stream.getVideoTracks()[0] || null;

            setLocalAudioTrack(audioTrack);
            setLocalVideoTrack(videoTrack);

            if (videoRef.current && videoTrack) {
                videoRef.current.srcObject = new MediaStream([videoTrack]);
                videoRef.current.play().catch(err => console.error("Error playing video:", err));
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    useEffect(() => {
        getCam();
    }, []); // Only run once on mount

    if (!joined) {
        return (
            <div>
                <video autoPlay ref={videoRef}></video>
                <input 
                    type="text" 
                    placeholder="Enter your name" 
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={() => setJoined(true)}>Join</button>
            </div>
        );
    }

    return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />;
};
