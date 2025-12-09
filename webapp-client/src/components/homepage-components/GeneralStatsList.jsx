import './GeneralStatsList.css'
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

export default function GeneralStatsList({ period }) {

    const siteTabsToday = useSelector((state) => state.sites.sitesToday)
    const siteTabsWeek = useSelector((state) => state.sites.sitesWeek)
    const siteTabsMonth = useSelector((state) => state.sites.sitesMonth)
    const siteTabsAllTime = useSelector((state) => state.sites.sitesAllTime)
    const totalDays = useSelector((state) => state.sites.totalDays)
    const [dailyAvgTime, setDailyAvgTime] = useState('')
    const [totalTime, setTotalTime] = useState('')


    useEffect(() => {

        const lookup = {
            today: [siteTabsToday, 1],
            week: [siteTabsWeek, 7],
            month: [siteTabsMonth, 30],
            all: [siteTabsAllTime, totalDays],
        };

        let addedTime = 0;

        for (let i in lookup[period][0]) {
          addedTime += Number(lookup[period][0][i].totalTimeSpent);
        }

        function formatTime(time) {
            const hours = Math.floor(time / 3600000);  // Get full hours
            const minutes = Math.floor((time % 3600000) / 60000); // Get minutes after full hours

            return `${hours}h ${minutes}m`
        }

        setDailyAvgTime(formatTime(addedTime / lookup[period][1]));
        setTotalTime(formatTime(addedTime));

    }, [period, siteTabsToday, siteTabsWeek, siteTabsMonth, siteTabsAllTime, totalDays])

    return (
        <>
        <div id='stats-container'>
            <div className='item-container'>
                <h2>Avg Time Browsing: </h2>
                <h2>{dailyAvgTime}</h2>
            </div>        
            <div className='item-container'>
                <h2>Avg Time Logging On: </h2>
                <h2>NA</h2>
            </div>        
            <div className='item-container'>
                <h2>Avg Time Logging Off: </h2>
                <h2>NA</h2>
            </div>        
            <div className='item-container'>
                <h2>Avg Amount of Sites Browsed: </h2>
                <h2>NA</h2>
            </div>
        </div>
        </>
    )
}