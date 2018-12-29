const execFile = require('child_process').execFile;
const ls = execFile(`/root/go-etherzero/build/bin/geth`, ['attach', '--datadir', '/data/node1', '--exec',  'txpool.status']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
