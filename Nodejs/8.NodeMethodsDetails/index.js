const http = require("http");
const fs = require('fs');
const PORT = 3000;

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/test-post' && method === 'POST') {
    let body = '';

    req.on('data', (test) => {
      body += test.toString();
    });

    req.on('end', () => {
      try {
        const receivedPayload = JSON.parse(body); 

        fs.readFile('user-data.json', 'utf8', (err, data) => {
          let usersArray = []; 
          if (!err && data) {
             usersArray = JSON.parse(data);
          }

          usersArray.push(receivedPayload);

          // ৪. এই আপডেট করা পুরো Array-টাকে আবার ফাইলে Overwrite (writeFile) করে দিলাম!
          fs.writeFile('user-data.json', JSON.stringify(usersArray, null, 2), (writeErr) => {
            if (writeErr) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: "Error saving file" }));
              return;
            }

            // ৫. সব কাজ শেষ, এবার একটাই মাত্র রেসপন্স পাঠাব!
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                message: "Data successfully added/updated!", 
                totalUsers: usersArray.length 
            }));
          });
        });

      } catch (parseError) {
        // যদি ইউজার ভুলভাল JSON পাঠায়
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
      }
    });
    
  } else if(url === '/'){
    // res.write(`<h1>This is Home page</h1>`)
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.end('This is Home Page');
  } 
  // DELETE Request: নির্দিষ্ট কোনো ডেটা মুছে ফেলা
  else if (url.startsWith('/delete-user') && method === 'DELETE') {
    
    // ১. আগের মতোই লিংকের ভেতর থেকে id টাকে বের করে আনা
    // const parsedUrl = new URL(url, `http://${req.headers.host}`);
    const fullUrl = `http://${req.headers.host}${url}`
    const parsedUrl = new URL(fullUrl); 
    const targetId = parsedUrl.searchParams.get('id');
    console.log('testing==>', {fullUrl, parsedUrl, targetId});
    
    if (!targetId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Please provide an ID in the URL (e.g., ?id=1)" }));
      return;
    }

    // ২. কোনো body রিসিভ করার ঝামেলা নেই, সরাসরি পুরোনো ফাইলটা পড়ছি!
    fs.readFile('user-data.json', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "File not found!" }));
        return;
      }

      let usersArray = JSON.parse(data);
      const initialLength = usersArray.length; // ডিলিট করার আগে কতজন ছিল, সেটা গুনে রাখলাম

      // ৩. ম্যাজিক ট্রিক (filter): যে id-টা ডিলিট করতে চাই, তাকে বাদ দিয়ে বাকি সবাইকে নিয়ে নতুন অ্যারে বানালাম
      const filteredArray = usersArray.filter(user => user.id !== Number(targetId));

      // যদি ডিলিট করার আগে ও পরের সংখ্যা একই থাকে, তার মানে ওই id-এর কাউকে পাওয়াই যায়নি!
      if (initialLength === filteredArray.length) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "User not found with this ID!" }));
        return;
      }

      // ৪. ওই নির্দিষ্ট ইউজারকে বাদ দেওয়ার পর যে নতুন অ্যারেটা (filteredArray) পেলাম, সেটাকে ফাইলে Overwrite করে দিলাম
      fs.writeFile('user-data.json', JSON.stringify(filteredArray, null, 2), (writeErr) => {
        if (writeErr) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Error saving updated file" }));
          return;
        }

        // ৫. ব্রাউজারকে সাকসেস মেসেজ পাঠিয়ে দিলাম!
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "User deleted successfully!" }));
      });
    });
  } else{
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running... Port is ${PORT}`);
});