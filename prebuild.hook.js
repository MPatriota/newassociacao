const ENCRYPTION_KEY = require('crypto').randomBytes(32);
require('fs').writeFileSync('environment/app-key.dat', ENCRYPTION_KEY);

function createEnvironmentVariablesEncrypted() {

  const fs = require('fs');

  const envDir = require('path').join(__dirname, '/environment');

  const files = fs.readdirSync(envDir);

  const environmentFiles = files.filter(file => file.startsWith(process.env.NODE_ENV) || file.startsWith(process.env.APP_TYPE));

  const allVariableContent = environmentFiles.map(file => fs.readFileSync('environment/' + file, 'utf8')).join('\n');

  const encrypted = encrypt(allVariableContent);

  fs.writeFileSync('environment/environment-variables.dat', encrypted);

}

function encrypt(text) {
  const crypto = require('crypto');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

createEnvironmentVariablesEncrypted();
