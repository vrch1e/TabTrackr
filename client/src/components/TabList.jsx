import TabItem from './TabItem';
import './TabList.css';

export default function TabList({ tabs = [] }) {

    const formatTime = (ms) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        return `${hours}h ${minutes}m`; // 'mn'
    };

    // todo: unnec. parentheses around args + indentation?
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