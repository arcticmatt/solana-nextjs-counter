const fs = require('fs');
const idl = require('./target/idl/solana_nextjs.json');

fs.writeFileSync('./app/src/idl.json', JSON.stringify(idl));