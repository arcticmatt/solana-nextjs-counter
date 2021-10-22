const fs = require('fs');
const idl = require('./target/idl/solana_nextjs_counter.json');

fs.writeFileSync('./app/src/idl.json', JSON.stringify(idl));