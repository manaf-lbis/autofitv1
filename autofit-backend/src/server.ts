import http from "http";
import app from "./app";

const server = http.createServer(app);



// const PORT = Number(process.env.PORT) || 3000;

// server.listen(PORT, '192.168.60.242', () => {
//   console.log(`Server running on http://192.168.60.242:${PORT}`);
// });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});