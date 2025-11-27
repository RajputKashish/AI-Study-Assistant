import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/user.js';

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
        
        // Check if test user exists
        const existingUser = await User.findOne({ email: 'test@test.com' });
        if (existingUser) {
            console.log('Test user already exists');
            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            console.log('\nUser Info:');
            console.log(JSON.stringify({
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                token: token
            }, null, 2));
            process.exit(0);
        }
        
        // Create test user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('test123', salt);
        
        const user = await User.create({
            name: 'Test User',
            email: 'test@test.com',
            password: hashedPassword
        });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        console.log('✅ Test user created successfully!');
        console.log('\nLogin credentials:');
        console.log('Email: test@test.com');
        console.log('Password: test123');
        console.log('\nUser Info:');
        console.log(JSON.stringify({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token
        }, null, 2));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createTestUser();
