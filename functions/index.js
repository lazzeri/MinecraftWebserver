const cors = require('cors');
const path = require('path');
const { app, httpServer, database } = require('./controllers/database');
const express = require('express');
const { environment } = require('./controllers/secrets');

require('console-stamp')(console, '[HH:MM:ss.l]');

app.use(busboyBodyParser());
app.use(busboyBodyParser({ limit: '5mb' }));
// cache set to 4 hours age
app.use(express.static(__dirname + '/public', { maxAge: '14400000' }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
httpServer.listen('3003', () => console.log('app is running'));

console.log('ENV: ', environment);
console.log('Connection has been established successfully.');
