import TabItem from './TabItem';
import './TabList.css';

export default function TabList({ tabs = [] }) {

    const formatTime = (ms) => {
        const hours = Math.floor(ms / 3600000);  // Get full hours
        const minutes = Math.floor((ms % 3600000) / 60000); // Get minutes after full hours
        return `${hours}h ${minutes}m`;
    };

    return (
        <div id='container'>
            {tabs.length > 0 ? (
                tabs.map((tab) => (
                    <TabItem key={tab.id} site={tab.site} timespent={formatTime(tab.totalTimeSpent)} />
                ))
            ) : (
                <p>No tracked data available.</p>
            )}
        </div>
    );
}