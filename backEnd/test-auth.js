import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Test token generation and verification
const testUserId = '507f1f77bcf86cd799439011';
const token = jwt.sign({ id: testUserId }, process.env.JWT_SECRET, { expiresIn: '7d' });

console.log('Generated token:', token);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully:', decoded);
} catch (error) {
    console.log('❌ Token verification failed:', error.message);
}
