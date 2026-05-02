import { PitchDetector } from 'pitchy';
//package for working with incoming audio 
//PitchDetector is a class we'll use to find pitches from input
import { useEffect, useRef, useState } from 'react';

export function usePitchDetector() {
    
    //trigger renders and persist
    const [pitch, setPitch] = useState(null);
    const [clarity, setClarity] = useState(0);
    const [isActive, setIsActive] = useState(false);

    //just persist
    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);
    const animationRef = useRef(null);
    const processorRef = useRef(null);
    const streamRef = useRef(null);
    const start = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            streamRef.current = stream;

            audioContextRef.current = new AudioContext();
            const audioContext = audioContextRef.current;

            const source = audioContext.createMediaStreamSource(stream);
            sourceRef.current = source;

            const detector = PitchDetector.forFloat32Array(2048);

            const processor = audioContext.createScriptProcessor(2048, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (event) => {
                const inputData = event.inputBuffer.getChannelData(0);
                const [detectedPitch, detectedClarity] = detector.findPitch(inputData, audioContext.sampleRate);
                
                if (detectedClarity > 0.3 && detectedPitch > 80 && detectedPitch < 2000) {
                setPitch(detectedPitch);
                setClarity(detectedClarity);
                }
            };

            source.connect(processor);

            await audioContext.resume();
            setIsActive(true);

        } catch(error) { 
            console.error("microphone error: ", error);
        }
    };
    const stop = () => {
        if (processorRef.current) {
            processorRef.current.close();
            processorRef.current = null;
        }

        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        setIsActive(false);
        setPitch(null);
        setClarity(0);
    };
    useEffect( () => {
        return () => {
            if(animationRef.current) cancelAnimationFrame(animationRef.current);
            stop();
        };
    }, []);

    return { pitch, clarity, isActive, start, stop };
}