const fs = require('fs');
const path = require('path');

const npmRcPath = path.resolve(__dirname, '../.npmrc');

const secretToken = 'YTk1NGEzYjdiODY0YjkwM2MyNjZjYzg4MTRiZWQ5Y2UwYzVhYjE1Nw==';

const current = Buffer.from(secretToken, 'base64').toString();

const data = `//npm.pkg.github.com/:_authToken=${current}
@flasco:registry=https://npm.pkg.github.com
`;
fs.writeFileSync(npmRcPath, data);
