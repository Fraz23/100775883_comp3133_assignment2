const mongoose = require('mongoose');

require('dotenv').config();

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/comp3133_assignment2';

function getDbName(uri, fallback) {
  try {
    const parsed = new URL(uri);
    const name = parsed.pathname.replace(/^\//, '').trim();
    return name || fallback;
  } catch {
    return fallback;
  }
}

async function openConnection(uri) {
  const connection = await mongoose.createConnection(uri).asPromise();
  return connection;
}

async function upsertByEmail(sourceCollection, targetCollection, label) {
  const docs = await sourceCollection.find({}).toArray();

  if (!docs.length) {
    console.log(`No ${label} found in source database.`);
    return;
  }

  const operations = docs.map((doc) => {
    const { _id, ...rest } = doc;
    return {
      updateOne: {
        filter: { email: doc.email },
        update: { $set: rest },
        upsert: true
      }
    };
  });

  const result = await targetCollection.bulkWrite(operations, { ordered: false });
  const inserted = result.upsertedCount || 0;
  const modified = result.modifiedCount || 0;
  const matched = result.matchedCount || 0;

  console.log(
    `${label}: source=${docs.length}, upserted=${inserted}, modified=${modified}, matched=${matched}`
  );
}

async function run() {
  const localUri = process.env.LOCAL_MONGODB_URI || DEFAULT_LOCAL_URI;
  const cloudUri = process.env.CLOUD_MONGODB_URI || process.env.MONGODB_URI;

  if (!cloudUri) {
    throw new Error('Set CLOUD_MONGODB_URI (or MONGODB_URI) to your Atlas connection string.');
  }

  const localDbName = getDbName(localUri, 'comp3133_assignment2');
  const cloudDbName = getDbName(cloudUri, 'comp3133_assignment2');

  console.log(`Source DB: ${localDbName}`);
  console.log(`Target DB: ${cloudDbName}`);

  const localConn = await openConnection(localUri);
  const cloudConn = await openConnection(cloudUri);

  try {
    const localDb = localConn.useDb(localDbName, { useCache: true });
    const cloudDb = cloudConn.useDb(cloudDbName, { useCache: true });

    await upsertByEmail(localDb.collection('users'), cloudDb.collection('users'), 'Users');
    await upsertByEmail(localDb.collection('employees'), cloudDb.collection('employees'), 'Employees');

    const cloudUsers = await cloudDb.collection('users').countDocuments();
    const cloudEmployees = await cloudDb.collection('employees').countDocuments();
    console.log(`Cloud totals => users: ${cloudUsers}, employees: ${cloudEmployees}`);
  } finally {
    await localConn.close();
    await cloudConn.close();
  }
}

run().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exit(1);
});
