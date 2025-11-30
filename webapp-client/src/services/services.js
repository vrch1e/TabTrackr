
const getSites = async (period, userId) => {
    const url = `http://localhost:3010/stats/${period}/${userId}`
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

const getUserId = async (token) => {
    console.log('executing getUserId')
    const response = await fetch('http://localhost:3010/session/getuserid', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ token })
    })

    const json = await response.json();
    console.log('finished executing getUserId: ', json)
    return json;
}

export default { getSites, getUserId }