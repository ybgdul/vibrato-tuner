

export function frequencyToTone(freq) {
    if(!freq || freq < 80) return {note: "--", cents: 0};

    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    const A4 =440;
    const C0 = A4 * Math.pow(2, -4.75);

    const halfStepsFromC0 = 12 * Math.log2(freq / C0);
    const noteIndex = Math.round(halfStepsFromC0) % 12;
    const octave = Math.floor(halfStepsFromC0 / 12);
    
    const targetFreq = C0 * Math.pow(2, Math.round(halfStepsFromC0) / 12);
    const cents = Math.floor(1200 * Math.log2(freq / targetFreq));
    
    return {
        note: `${noteNames[noteIndex]}${octave}`,
        cents: cents,
        frequency: freq
    };
}