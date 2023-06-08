import * as dotenv from "dotenv";
dotenv.config({ path: '../../.env' });

import express, {
  Express,
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";

// import cookieParser from 'cookie-parser';
// import ExpressSession from 'express-session';

import accountRouter from  './routers/accountRouter';
import dataRouter from './routers/dataRouter';
import endpointRouter from './routers/endpointRouter';

// Socket.io implementation
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";


const PORT = 3500;

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Continued Socket.io implementation
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

// Handle socket.io events and logic in here
io.on("connection", (socket) => {
  // logic here
  console.log(`Hello from server.ts. User Connected: ${socket.id}`);

  // listening for an event front the front end
  socket.on("send_message", (data) => {
    // this will broadcast back into the terminal
    console.log(`typeof: ${typeof(data)}`)
    console.log(`This is data from the FE: ${JSON.stringify(data.message)}`)

    // this is broadcast to every except the sender
    socket.broadcast.emit("receive_message", data)
  })
});

httpServer.listen(3501);

// declare module "express-session" {
//   interface Session {
//     isAuth: boolean,
//     userId: number,
//     userEmail: string
//   }
// }

// const oneDay: number = 1000 * 60 * 60 * 24;
// app.use(ExpressSession({
//   secret: process.env.SESSION_SECRET || '',
//   saveUninitialized: false,
//   cookie: { maxAge: oneDay },
//   resave: false
// }));

// app.use(cookieParser());

app.use('/api/account', accountRouter);
app.use('/api/data', dataRouter);
app.use('/api/endpoint', endpointRouter);


app.use((req: Request, res: Response) =>
  res.status(404).send("This is not the page you're looking for...")
);




app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred.' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => 
  console.log(`Currently listening on port: ${PORT}`)
);

module.exports = app;