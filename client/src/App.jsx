import { useState, useEffect, useRef } from "react";
import services from "./services/services";
import TabList from "./components/TabList";
import "./App.css";

function App() {
  const [tabs, setTabs] = useState([]);
  const [period, setPeriod] = useState("today");
  const websocketRef = useRef(null);

  // Fetching sites whenever period changes
  useEffect(() => {
    const fetchSites = async () => {
      chrome.storage.local.get(["userId"], async (result) => {
        const userId = result?.userId;
        if (!userId) {
          console.warn("No userId found in storage");
          return;
        }

        console.log("UserId found:", userId);

        try {
          const data = await services.getSites(period, userId);
          setTabs(data);
          console.log("Sites updated:", data);
        } catch (err) {
          console.error("Failed to fetch sites:", err);
        }
      });
    };

    fetchSites();
  }, [period]);

  return (
    <div id="container">
      <header id="dashboard">
        <PeriodDropdown period={period} setPeriod={setPeriod} />
      </header>
      <hr />
      <main>
        <TabList tabs={tabs} />
      </main>
    </div>
  );
}

// Dropdown component
function PeriodDropdown({ period, setPeriod }) {
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
      </select>
    </div>
  );
}

export default App;

