const { MongoClient } = require('mongodb');

const oldUri = "mongodb+srv://mohitdev467:KR6frRCkPQmE5OuS@cluster0.ztrvj.mongodb.net/matrimonix";
const newUri = "mongodb+srv://samyotech:samyotech@cluster0.pj6ox.mongodb.net/matrimonix?retryWrites=true&w=majority&appName=Cluster0";

async function migrate() {
  const oldClient = new MongoClient(oldUri);
  const newClient = new MongoClient(newUri);

  try {
    await oldClient.connect();
    await newClient.connect();

    const oldDb = oldClient.db();
    const newDb = newClient.db();

    const collections = await oldDb.listCollections().toArray();

    for (let { name } of collections) {
      const data = await oldDb.collection(name).find().toArray();
      if (data.length) {
        await newDb.collection(name).insertMany(data);
        console.log(`Migrated ${data.length} documents from ${name}`);
      }
    }

    console.log('✅ Migration complete.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await oldClient.close();
    await newClient.close();
  }
}

migrate();
