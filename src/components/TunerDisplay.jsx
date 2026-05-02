import { frequencyToTone } from "../utilities/noteUtils";
import { Meter } from "./Meter";

export function TunerDisplay( {pitch, clarity, isActive }) { 
    if(!isActive) {return <div className="tuner-inactive">Click start to begin</div>}

    if(!pitch || clarity < 0.6) {return <div className="tuner-waiting">Keep going for now</div>}

    const {note, cents} = frequencyToTone(pitch);
    const isInTune = Math.abs(cents) < 5;

    return (
        <div className="tuner-display">
            <div className="note-name">{note}</div>
            <div className="cents">{cents > 0 ? `+${cents}` : cents}</div>
            <Meter cents={cents} />
            <div className="tune-status"> 
                {isInTune ? "in tune" : "not tuned yet"};
            </div>
            <div className="frequency">{pitch.toFixed(1)} hz</div>
        </div>
    );
}