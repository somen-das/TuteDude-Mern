const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

function serveFile(filePath, res, statusCode = 200, contentType = "text/html") {
  fs.readFile(filePath, (err, data) => {
    console.log('test:===>',{filePath, data, err});
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error 500");
      return;
    }
    res.writeHead(statusCode, { "Content-Type": contentType });
    res.end(data);
  });
};

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === "/" || url === "/home") {
    fs.readFile(path.join(__dirname, "pages", "home.html"), (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error 500");
      return;
    }
    res.writeHead(200, { "Content-Type": 'text/html' });
    res.end(data);
  });

  } else if (url === "/about") {
    serveFile(
      path.join(__dirname, "pages", "about.html"),
      res,
      200
    );
  } else if (url === "/contact") {
    serveFile(
      path.join(__dirname, "pages", "contact.html"),
      res,
      200
    );
  }else {
    serveFile(
      path.join(__dirname, "pages", "404.html"),
      res,
      404
    );
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});