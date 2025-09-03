import { createServer } from 'http';
import { Server } from 'socket.io';
import  express from 'express';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado:', socket.id);
    });
})

export { io, httpServer,app };