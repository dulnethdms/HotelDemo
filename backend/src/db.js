const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017');
const dbName = process.env.MONGODB_DB || 'ocean_paradise';
let databasePromise;

function getDb() {
  if (!databasePromise) {
    databasePromise = client.connect().then(() => client.db(dbName));
  }
  return databasePromise;
}

async function collection(name) {
  return (await getDb()).collection(name);
}

async function nextId(sequence) {
  const counters = await collection('_counters');
  const result = await counters.findOneAndUpdate(
    { _id: sequence },
    { $inc: { value: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  return (result.value || result).value;
}

async function close() {
  await client.close();
  databasePromise = undefined;
}

module.exports = { collection, getDb, nextId, close };
