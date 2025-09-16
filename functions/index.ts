import cors from 'cors';
import path from 'path';
import { app, database, httpServer } from './controllers/database';
import express from 'express';
import { environment, YOUTUBE_CHANNEL_ID } from './controllers/secrets';
import pagesRouter from './routes/pages';
import authRouter from './routes/auth';
import { connectToVideo } from './controllers/youtubeMasterchatExample';

// Import console-stamp with require for side effects
require('console-stamp')(console, '[HH:MM:ss.l]');

// Static files with cache set to 4 hours age
app.use(express.static(__dirname + '/public', { maxAge: '14400000' }));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use('/', pagesRouter);
app.use('/auth', authRouter);

// Start server
httpServer.listen('3003', () => console.log('app is running'));

console.log('ENV: ', environment);
console.log('Connection has been established successfully.');

// Connect to video - if no videoId provided, it will search for live streams from the default channel
connectToVideo(YOUTUBE_CHANNEL_ID);
database.sendIoMessage('/newVideo', { videoId: YOUTUBE_CHANNEL_ID });
