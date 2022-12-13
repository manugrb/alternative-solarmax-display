import http from 'http';
const port = 3001;

const server = http.createServer((req, res) => {
    res.write('hello node');
    res.end();
});

server.listen(port, (error) => {
    if(error){
        console.error('something went wrong: ' + error);
    }else{
        console.log('Server is listening on port ' + port);
    }
});