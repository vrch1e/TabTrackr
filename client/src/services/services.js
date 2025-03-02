
const getSites = async (period) => {
    const url = `http://localhost:3000/stats/${period}`
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

const logVisit = async (site, timespent) => {
    const url = 'http://localhost:3000/visits'
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                site: site,
                timespent: timespent
            })
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
  
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.log(error.message)
    }
}

const clearAll = async () => {
    const url = 'http://localhost:3000/clearall'
    try {
        const response = await fetch(url, {
            method: "DELETE"
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
  
        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.log(error.message)
    }
}

export default { getSites, logVisit, clearAll }