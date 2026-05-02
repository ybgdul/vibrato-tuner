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
    const pitchRef = useRef(null);

    const start = async () => {
        try {
            
            //this stream is LITERALLY incoming audio from the mic, just raw
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            streamRef.current = stream;

            audioContextRef.current = new AudioContext();
            const audioContext = audioContextRef.current;

            //this method of audio context is used to get the raw stream to the correct format
            //pitch detector will not work with raw audio stream
            const source = audioContext.createMediaStreamSource(stream);
            sourceRef.current = source;

            const detector = PitchDetector.forFloat32Array(2048);

            const processor = audioContext.createScriptProcessor(2048, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (event) => {
                const inputData = event.inputBuffer.getChannelData(0);
                const [detectedPitch, detectedClarity] = detector.findPitch(inputData, audioContext.sampleRate);

                //rejecting bad frames
                if(detectedClarity < 0.25) return;
                if(detectedPitch < 80 || detectedPitch > 2000) return;

                //reject spikes 
                if(pitchRef.current && Math.abs(pitchRef.current - detectedPitch) > 150) return;

                const smoother = 0.15;
                
                if(pitchRef.current === null) pitchRef.current = detectedPitch;
                else { 
                    pitchRef.current = smoother * detectedPitch + (1 - smoother) * pitchRef.current;
                }
                setPitch(pitchRef.current);
                setClarity(detectedClarity);
                
            };

            source.connect(processor);
            processor.connect(audioContext.destination);

            await audioContext.resume();
            setIsActive(true);

        } catch(error) { 
            console.error("microphone error: ", error);
        }
    };
    const stop = () => {
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current.onaudioprocess = null;
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