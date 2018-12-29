const { spawn } = require('child_process');
const ls = spawn('~/go-etherzero/build/bin/geth attach --datadir /data/node1 --exec  txpool.content');

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
