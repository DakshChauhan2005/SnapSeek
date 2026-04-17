import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import dotenv from 'dotenv';
dotenv.config();
const { default: app } = await import("./src/app.js");


import http from 'http';
import { initSocket } from './socket/server.socket.js';
const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
})