const { MongoClient } = require('mongodb');
require('dotenv').config();

async function migrate() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Kopiere alle Dokumente von stellengesuche nach stellenanzeigen
    const stellengesuche = await db.collection('stellengesuche').find({}).toArray();
    
    if (stellengesuche.length > 0) {
      await db.collection('stellenanzeigen').insertMany(stellengesuche);
      console.log(`${stellengesuche.length} Dokumente wurden von stellengesuche nach stellenanzeigen migriert`);
    }
    
    // Lösche die alte Collection
    await db.collection('stellengesuche').drop();
    console.log('Alte Collection stellengesuche wurde gelöscht');
    
  } catch (error) {
    console.error('Fehler bei der Migration:', error);
  } finally {
    await client.close();
  }
}

migrate(); 