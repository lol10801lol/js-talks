const {createServer} = require('http');
const { fork } = require('child_process');

const server = createServer();

server.on('request', (req, res) => {
    if (req.url === '/compute') {
        const compute = fork('compute.js');
        compute.send('start');
        compute.on('message', sum => {
            res.end(`Sum is ${sum}`);
        });
    } else {
        res.end('Ok')
    }
});

server.listen(8080);