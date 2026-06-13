const { MongoClient } = require('mongodb');

async function dropOldIndex() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blood_donation';
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const db = client.db('blood_donation');
        const collection = db.collection('bloodstocks');
        
        // Drop the old index
        try {
            await collection.dropIndex('bloodGroup_1');
            console.log('✅ Dropped old index bloodGroup_1');
        } catch (error) {
            console.log('⚠️ Index bloodGroup_1 does not exist or already dropped');
        }
        
        // List current indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);
        
        await client.close();
        console.log('✅ Index cleanup completed');
    } catch (error) {
        console.error('❌ Error dropping index:', error);
    }
}

dropOldIndex();
