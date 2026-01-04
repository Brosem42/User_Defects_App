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

    // only fetch required fields to optimize performance and reduce payload size
    const results = await collection.find({}, {
        projection: {
            molding_machine_id: 1,
            timestamp: 1,
            "object_detection.reject": 1,
            "object_detection.contamination_defect.pixel_severity": 1
            // We EXCLUDE molding-machine-state to keep the payload under 6MB
        }
    }).toArray();

    const nivoReadyData = results.map(doc => ({
        id: doc._id.toString(),
        machine: doc.molding_machine_id, 
        rejectCount: doc.object_detection?.reject ? 1 : 0,
        severity: doc.object_detection?.contamination_defect?.pixel_severity?.value || 0,
        timestamp: doc.timestamp
    }));
    const userTask = event.arguments.task;

    return {
        summary: `Successfully processed your request: "${userTask}". Found ${results.length} results for analysis.`,
        nivoData: nivoReadyData
    };
};


