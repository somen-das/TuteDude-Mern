// // const http = require('http');

// // const PORT = 8000;
// // http.createServer((req,res)=>{
// //     if(req.url === '/'){
// //         res.write('test')
// //     }
// // }).listen(PORT,()=>{
// //     console.log(`server start from PORT: ${PORT}`)
// // })

// const http = require("http");
// const fs = require("fs");
// const path = require("path");

// const PORT = 3000;
// // JSON ফাইলের লোকেশন বের করা
// const dataPath = path.join(__dirname, "todos.json");

// const server = http.createServer((req, res) => {
//   // যেহেতু আমরা API বানাচ্ছি, তাই Content-Type হবে JSON
//   res.setHeader("Content-Type", "application/json");
//   // ব্রাউজারের CORS এরর এড়াতে (যাতে ফ্রন্টএন্ড থেকে কল করা যায়)
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   // ১. GET Request: সব To-Do দেখা
//   if (req.url === "/todos" && req.method === "GET") {
//     fs.readFile(dataPath, "utf8", (err, data) => {
//       if (err) {
//         res.writeHead(500);
//         res.end(JSON.stringify({ error: "Server Error!" }));
//         return;
//       }
//       res.writeHead(200);
//       res.end(data); // JSON ডেটা ব্রাউজারে পাঠিয়ে দিলাম
//     });
//   }

//   // অন্যান্য রিকোয়েস্টের জন্য জায়গা ফাঁকা রাখলাম (POST, PUT, DELETE)
//   else if (req.url === "/todos" && req.method === "POST") {
//     res.writeHead(200);
//     res.end(JSON.stringify({ message: "POST route is ready for the next step!" }));
//   }

//   // ভুল লিংকে গেলে 404
//   else {
//     res.writeHead(404);
//     res.end(JSON.stringify({ error: "Route not found!" }));
//   }
// });

// server.listen(PORT, () => {
//   console.log(`To-Do API is running at http://localhost:${PORT}`);
// });








// const http = require("http");
// const fs = require("fs");
// const path = require("path");
// const PORT = 3000;

// const todosData = [
//   { task: "create file", id: 1 },
//   { task: "create file 2", id: 2 },
//   { task: "create file 3", id: 3 },
// ];

// const helperFunction = (method, fileName, callBackFun, statusCode=200, )=>{
//     fs.method("somen", JSON.stringify(todosData, null, 2), (err)=>{

//     })
// }

// const server = http.createServer((req, res) => {
//   const url = req.url;
//   if (url === "/create-file") {
//     helperFunction(writeFile, 'todos.json', )
//     fs.writeFile("todos.json", JSON.stringify(todosData, null, 2), (err) => {
//       if (err) {
//         res.writeHead(500, { "Content-Type": "text/plain" });
//         res.end("error state is pass so");
//       } 
//         res.writeHead(200, { "Content-Type": "text/plain" });
//         res.end();
//     });
//   } else if (url === "/create-file-delete") {
//     fs.unlink("todos.json", (err) => {
//       if (err) {
//         res.writeHead(500, { "Content-Type": "text/plain" });
//         res.end();
//         return;
//       }
//       res.writeHead(200, { "Content-Type": "text/plain" });
//       res.end();
//     });
//   } else if (url === "/create-file-rename") {
//     fs.rename("todo-manjson", "todo-man.json", (err) => {
//       console.log("err -----==>>.", err);
//       res.writeHead(200, { "Content-Type": "text/plain" });
//       res.end();
//     });
//   } else if (url === "/create-file-read") {
//     fs.readFile("todo-man.json", "utf8", (err, data) => {
//       if (err) {
//         console.log(err);
//         res.end("Error: Could not read file!");
//         return;
//       }
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(data);
//     });
//   }
// });



// server.listen(PORT, () => {
//   console.log(`my server running Port is: http://localhost:${PORT}`);
// });



const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 3000;

const todosData = [
  { task: "create file", id: 1 },
  { task: "create file 2", id: 2 },
  { task: "create file 3", id: 3 },
];

// জাদুকরী Helper Function
// এটি fs এর যেকোনো মেথড (Create, Read, Delete, Rename) একাই হ্যান্ডেল করতে পারবে!
const fileOperationsHelper = (methodName, argsArray, res, successMessage) => {
  
  // fs[methodName] ডাইনামিকভাবে fs.writeFile বা fs.readFile এ পরিণত হবে
  // ...argsArray ভেতরের সব ডেটাকে কমা দিয়ে আলাদা করে মেথডের ভেতর বসিয়ে দেবে
  fs[methodName](...argsArray, (err, data) => {
    if (err) {
      console.log(`Error in ${methodName}:`, err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Server Error! Operation failed.");
      return;
    }

    // যদি ফাইল রিড করা হয়, তাহলে JSON ডেটা পাঠাবো, নাহলে সাধারণ মেসেজ
    if (methodName === "readFile") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(successMessage);
    }
  });
};

const server = http.createServer((req, res) => {
  const url = req.url;

  // ১. Create File
  if (url === "/create-file") {
    fileOperationsHelper(
      "writeFile", 
      ["todos.json", JSON.stringify(todosData, null, 2)], 
      res, 
      "Success: File created!"
    );
  } 
  
  // ২. Delete File
  else if (url === "/create-file-delete") {
    fileOperationsHelper(
      "unlink", 
      ["todos.json"], 
      res, 
      "Success: File deleted!"
    );
  } 
  
  // ৩. Rename File
  else if (url === "/create-file-rename") {
    fileOperationsHelper(
      "rename", 
      ["todos.json", "todo-man.json"], 
      res, 
      "Success: File renamed!"
    );
  } 
  
  // ৪. Read File
  else if (url === "/create-file-read") {
    fileOperationsHelper(
      "readFile", 
      ["todo-man.json", "utf8"], 
      res, 
      null // রিড করার সময় ডেটা ব্রাউজারে যাবে, তাই মেসেজ null রাখলাম
    );
  } 
  
  // ৫. Not Found
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route not found!");
  }
});

server.listen(PORT, () => {
  console.log(`My server running Port is: http://localhost:${PORT}`);
});