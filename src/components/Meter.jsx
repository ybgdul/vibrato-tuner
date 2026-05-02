export function Meter({cents}) { 
    const percentage = Math.min(Math.max((cents + 50)/100, 0), 1);

    return (
        <div className="meter-container">
            <div className="meter-track">
                <div
                className="meter-fill"
                style={ {width: `${percentage * 100}%`}}
                />
            </div>
            <div className="meter-marks">
                <span>-50c</span>
                <span>0c</span>
                <span>+50c</span>
            </div>
        </div>
    );
}