import { useState, useEffect } from "react";
import services from "./services/services";
import TabList from "./components/TabList";
import TotalTime from "./components/TotalTime";
import "./App.css";

function App() {
  const [tabs, setTabs] = useState([]);
  const [allTime, setAllTime] = useState(0);
  const [period, setPeriod] = useState("today");
  const [daysDownloaded, setDaysDownloaded] = useState(0)
  console.log("POPUP LOADED");

  async function getUserId() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(["userId"], (result) => {
        const userId = result?.userId;
        if (!userId) {
          console.warn("No userId found in storage");
          resolve(0);
        }
        resolve(userId);
      })
    })
  }

  // Fetching sites whenever period changes
  useEffect(() => {
    const fetchSites = async () => {

      const userId = await getUserId()

      console.log("UserId found:", userId);

      try {
        const data = await services.getSites(period, userId);
        setTabs(data);

        let addedTime = 0;

        for (let i in data) {
          addedTime += Number(data[i].totalTimeSpent);
        }

        setAllTime(addedTime);
      } catch (err) {
        console.error("Failed to fetch sites:", err);
      }
    };

    fetchSites();
  }, [period]);

  useEffect(() => {
    chrome.storage.local.get(['userId'], async (result) => {
      const userId = result?.userId;
      if (!userId) {
        console.warn("No userId found in storage");
        return;
      }

      try {

        const totalDays = await services.getFirstEntry(userId);
        
        setDaysDownloaded(totalDays.totalDaysUsing);

      } catch (error) {
        console.error(error);
      }
    })
  }, [])

  function openWebsite() {
    try {
      chrome.runtime.sendMessage({ type: "OPEN_APP" })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div id="container">
      <div id="weblink" onClick={openWebsite}><span className="anchortext">Ascend your productivity</span><p>&nbsp;&gt;:)</p></div>
      <header id="dashboard">
        <h1>Time Tracked</h1>
        <PeriodDropdown period={period} setPeriod={setPeriod} daysDownloaded={daysDownloaded} />
        <TotalTime allTime={allTime}/>
      </header>
      <hr />
      <main>
        <TabList tabs={tabs} />
      </main>
    </div>
  );
}

// Dropdown component
function PeriodDropdown({ period, setPeriod, daysDownloaded }) {
  return (
    <div className="period-dropdown">
      <select
        id="period"
        className="period-select"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
      >
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="all">All Time{daysDownloaded ? `: ${daysDownloaded} days` : ""}</option>
      </select>
    </div>
  );
}

export default App;

