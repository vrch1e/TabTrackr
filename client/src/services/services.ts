import { Visit } from '../../../types.js';
// todo: one folder for one file for one function? ok if adding more functionalities

const getSites = async (period: String): Promise<Visit[]> => {

  const url: RequestInfo = `http://localhost:3000/stats/${period}` // todo: unnecessary? or in an .env?

  try {

    const response: Response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json: Visit[] = await response.json();
    console.log(json); // remove?
    return json;

  } catch (error: any) {
    console.error(error.message);
    return [];
  }
}

export default { getSites }