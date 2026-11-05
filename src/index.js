import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

const prisma = new PrismaClient();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure Express Session with Prisma Session Store
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    },
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000, // Clean up expired sessions every 2 minutes
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    ),
  })
);

// Initialize Passport and tell it to use express-session
app.use(passport.initialize());
app.use(passport.session());

// Your routes and passport strategies go here...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
