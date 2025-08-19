import TimeTracking from '../model/model.js';

export async function saveVisits(visits) {
  if (!Array.isArray(visits['usage'])) throw new Error("Expected an array of visits");

  await Promise.all(
    visits['usage'].map(async ({ site, timespent, url }) => {
      await TimeTracking.create({ site, timespent, url });
    })
  );
}