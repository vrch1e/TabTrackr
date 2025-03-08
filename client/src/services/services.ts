import { Visit } from '../../../types.js';

const url: string = 'http://localhost:3000/';

const getSites = async (period: string): Promise<Visit[]> => {
  try {
    const response: Response = await fetch(url + `/${period}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json: Visit[] = await response.json();
    // console.log(json);
    return json;
  }
  catch (error: any) {
    console.error(error.message);
    return [];
  }
}

const postSites = async (usageData: Visit[]) => {
  fetch(url + "/visits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usage: usageData }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to send data");
      return response.json();
    })
    .catch((error) => {
      console.error("Error sending usage data:", error);
    });
}

export default { getSites, postSites }