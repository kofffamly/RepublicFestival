const fs = require('fs');
const path = require('path');

function parseDotEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) {
    return env;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }
  return env;
}

function filterExpoPublic(env) {
  return Object.entries(env).reduce((acc, [key, value]) => {
    if (key.startsWith('EXPO_PUBLIC_')) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

module.exports = ({ config }) => {
  const projectRoot = path.resolve(__dirname);
  const envPath = path.join(projectRoot, '.env');
  const dotenv = parseDotEnv(envPath);

  return {
    ...config,
    extra: {
      ...filterExpoPublic(dotenv),
      ...filterExpoPublic(process.env),
    },
  };
};
