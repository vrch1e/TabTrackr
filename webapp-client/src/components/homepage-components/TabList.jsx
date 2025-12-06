import TabItem from './TabItem';
import './TabList.css';
import { useEffect, useState } from 'react';

export default function TabList({ period, tabs = [] }) {
    const [totalTime, setTotalTime] = useState(0)

    const formatTime = (ms) => {
        const hours = Math.floor(ms / 3600000);  // Get full hours
        const minutes = Math.floor((ms % 3600000) / 60000); // Get minutes after full hours
        return `${hours}h ${minutes}m`;
    };

    useEffect(() => {

        let addedTime = 0
        for (let i in tabs) {
            addedTime += Number(tabs[i].totalTimeSpent);
        }
        setTotalTime(addedTime)
        console.log(tabs)
        console.log('added time: ', addedTime);

    }, [tabs])

    return (
        <div id='container'>
            <div id='total-time-tab'>
                <h2>Total Time</h2>
                <h2>{formatTime(totalTime)}</h2>
            </div>
            {tabs.length > 0 ? (
                tabs.map((tab) => (
                    <TabItem key={tab.site} site={tab.site} timespent={formatTime(tab.totalTimeSpent)} />
                ))
            ) : (
                <p>Start browsing to see data!</p>
            )}
        </div>
    );
}