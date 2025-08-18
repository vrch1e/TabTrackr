
const getSites = async (period) => {
    const url = `http://localhost:3010/stats/${period}`
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



const postSites = async () => {
    // const url = `http://13.41.70.19:3010/`
    return;

}

export default { getSites, postSites }