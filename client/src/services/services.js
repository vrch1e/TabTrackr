
// todo: one folder for one file for one function? ok if adding more functionalities

const getSites = async (period) => {
    const url = `http://localhost:3000/stats/${period}` // todo: unnecessary? or in an .env?
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();
        console.log(json); // remove?
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

export default { getSites }