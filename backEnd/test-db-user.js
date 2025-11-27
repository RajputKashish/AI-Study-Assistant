import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/user.js';

const testConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
        
        const users = await User.find({});
        console.log(`Found ${users.length} users in database:`);
        users.forEach(user => {
            console.log(`  - ${user.name} (${user.email}) - ID: ${user._id}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testConnection();
