import crypto from 'crypto';

function generateSecret() {
  // Generate a random 64-character hex string
  const secret = crypto.randomBytes(32).toString('hex');
  
  console.log('Generated JWT Secret:');
  console.log(secret);
  console.log('\nAdd this to your .env file as:');
  console.log(`JWT_SECRET=${secret}`);
  console.log('\nOr set it as an environment variable in Render.');
}

generateSecret();
