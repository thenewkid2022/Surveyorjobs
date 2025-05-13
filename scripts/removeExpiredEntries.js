const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Fehler: MONGODB_URI nicht gesetzt!');
  process.exit(1);
}

async function removeExpiredEntries() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const now = new Date().toISOString();

    // Lösche abgelaufene Jobs
    const jobsResult = await db.collection('jobs').deleteMany({ expiresAt: { $lte: now } });
    // Lösche abgelaufene Stellengesuche
    const stellengesucheResult = await db.collection('stellengesuche').deleteMany({ expiresAt: { $lte: now } });

    console.log(`Abgelaufene Jobs gelöscht: ${jobsResult.deletedCount}`);
    console.log(`Abgelaufene Stellengesuche gelöscht: ${stellengesucheResult.deletedCount}`);
  } catch (err) {
    console.error('Fehler beim Löschen abgelaufener Einträge:', err);
  } finally {
    await client.close();
  }
}

removeExpiredEntries(); 