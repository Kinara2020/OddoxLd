import dotenv from 'dotenv';
process.env.PORT = '9999';
dotenv.config({ override: true });
console.log('PORT:', process.env.PORT);
