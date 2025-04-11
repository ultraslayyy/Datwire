import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors'
import path from 'path';
import userRouter from './functions/getUsers';

dotenv.config();

const app: Express = express();
const PORT_REST = 5001;
const PORT_WS = 6001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const routes = {
    getServers: require('./functions/getServers').default,
    getUsers: require('./functions/getUsers').default
};

// Logging
app.use((req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
    if (req.query && Object.keys(req.query).length > 0) {
        console.log('Query Params:', JSON.stringify(req.query, null, 2));
    }

    const original = res.send;
    res.send = function (body) {
        console.log(`[${timestamp}] Response Status: ${res.statusCode}`);
        console.log('----------------------------------------');
        return original.call(this, body);
    };

    next();
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

Object.entries(routes).forEach(([name, route]) => {
    if (typeof route === 'function') {
        app.use(`/api/${name}`, route);
        console.log(`Using '/api/${name}' at '${route}'`);
    } else {
        throw new Error(`Invalid middleware in route: ${name}`);
    }
});

// Start REST API
const restServer = app.listen(PORT_REST, () => {
    console.log(`[REST API]: Server is running at http://localhost:${PORT_REST}`);
});

// Start Socket.io
const socket = http.createServer();
const io = new Server(socket, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: false
    },
    transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    socket.on('message-sent', (data) => {
        console.log('Received message:', data);

        socket.broadcast.emit('message-sent');
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] Disconnected: ${socket.id}`);
    });
})

socket.listen(PORT_WS, () => {
    console.log(`[Socket] Server is running at http://localhost:${PORT_WS}`);
});

export default app;