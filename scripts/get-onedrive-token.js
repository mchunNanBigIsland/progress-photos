// OneDrive Token Generator
// Run this script to get your refresh token

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 OneDrive Token Generator');
console.log('============================\n');

rl.question('Enter your OneDrive Client ID: ', (clientId) => {
  rl.question('Enter your OneDrive Client Secret: ', (clientSecret) => {
    console.log('\n📋 Follow these steps:');
    console.log('1. Open this URL in your browser:');
    console.log(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&scope=https://graph.microsoft.com/files.readwrite&response_type=code&redirect_uri=http://localhost:8080`);
    console.log('\n2. Sign in with your Microsoft account');
    console.log('3. Copy the "code" parameter from the redirect URL');
    console.log('4. Paste it here:\n');
    
    rl.question('Enter the authorization code: ', (authCode) => {
      // Exchange code for tokens
      const postData = JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: authCode,
        redirect_uri: 'http://localhost:8080',
        grant_type: 'authorization_code'
      });
      
      const options = {
        hostname: 'login.microsoftonline.com',
        port: 443,
        path: '/common/oauth2/v2.0/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const tokens = JSON.parse(data);
            console.log('\n✅ Success! Your tokens:');
            console.log('========================');
            console.log(`Refresh Token: ${tokens.refresh_token}`);
            console.log(`Access Token: ${tokens.access_token}`);
            console.log('\n📝 Save the REFRESH TOKEN - you\'ll need it for GitHub Secrets!');
          } catch (error) {
            console.error('❌ Error parsing response:', error);
            console.log('Response:', data);
          }
          rl.close();
        });
      });
      
      req.on('error', (error) => {
        console.error('❌ Request error:', error);
        rl.close();
      });
      
      req.write(postData);
      req.end();
    });
  });
});
