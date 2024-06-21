const mongoose = require('mongoose');

// Set debug mode globally
mongoose.set('debug', true);

const url = 'mongodb://localhost:27017/';
const dbName = 'CorkDashboard';

let db; // Hold the database connection

const connectToDatabase = async () => {
    if (db) {
        return db; // If db connection is already established, return it
    }
    try {
        // Connect to MongoDB using mongoose
        const client = await mongoose.connect(url + dbName, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.connection.db; // Get the database instance from the client
        console.log('Connected to MongoDB');
        return db; // Return the database instance
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw error; // Throw error for handling in higher layers
    }
};

const getDatabase = () => {
    if (!db) {
        throw new Error('Database connection not initialized.');
    }
    return db;
};

module.exports = {
    connectToDatabase,
    getDatabase,
};