const http = require('http');

const todos = [
  { id: 1, text: 'Todo One' },
  { id: 2, text: 'Todo two' },
  { id: 3, text: 'Todo Three' },
];

const server = http.createServer((req, res) => {
  let body = [];

  req
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();

      let status = res.statusCode;
      let response = {
        success: false,
        data: null,
      };

      if (req.method === 'GET' && req.url === '/') {
        status = 200;
        response.success = true;
        response.data = todos;
      } else if (req.method === 'POST' && req.url === '/') {
        status = 201;
        response.success = true;

        if (!body.id || !body.text) {
          status = 400;
          response.success = false;
          response.data = null;
        } else {
          todos.push(JSON.parse(body));
          response.data = todos;
        }
      }
      res.writeHead(status, { 'Content-Type': 'application/json' });

      res.end(JSON.stringify(response));
    });
});

server.listen(5000, () =>
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on port ${process.env.PORT}...`
  )
);
