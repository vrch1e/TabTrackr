import './TotalTime.css'

export default function TotalTime({ allTime }) {
    const formatTime = (ms) => {
        const hours = Math.floor(ms / 3600000);  // Get full hours
        const minutes = Math.floor((ms % 3600000) / 60000); // Get minutes after full hours
        return `${hours}h ${minutes}m`;
    };
    return (
        <>
        <div id='total-time-container'>
            <h3>Total Time: {formatTime(allTime)}</h3>
        </div>
        </>
    )
}