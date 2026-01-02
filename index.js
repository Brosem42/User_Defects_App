// install packages for appsync connection
// use singleton pattern to reduce response time + cold starts
const {MongoClient} = require('mongodb');
const path = require('path');

// cache method to handle client requests
let cacheDb = null;

async function connectToDatabase() {
    // does connection exist 
    if (cacheDb) {
        console.log("Using cached database instance");
        return cacheDb;
    }

    console.log("Creating new database connection");
    const caBundlePath = path.join(__dirname, 'global-bundle.pem');

    const client = await MongoClient.connect(process.env.DOCDB_URI, {
        tlsCAFile: caBundlePath,
        tls: true,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 30000
    });
    //fix cache typo
    cacheDb = client.db('user_defects');
    return cacheDb;
}

// optimized handler function to allow lambda to wait for event loop to be empty
exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const db = await connectToDatabase();
    const collection = db.collection('defects');

    // APPsync resolver 
    const results = await collection.find({}).toArray();
    return results.map(doc => ({
        ...doc,
        id: doc._id.toString()
    }));
};