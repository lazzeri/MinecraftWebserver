'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const cors_1 = __importDefault(require('cors'));
const path_1 = __importDefault(require('path'));
const database_1 = require('./controllers/database');
const express_1 = __importDefault(require('express'));
const secrets_1 = require('./controllers/secrets');
const pages_1 = __importDefault(require('./routes/pages'));
const auth_1 = __importDefault(require('./routes/auth'));
require('console-stamp')(console, '[HH:MM:ss.l]');
database_1.app.use(express_1.default.static(__dirname + '/public', { maxAge: '14400000' }));
database_1.app.set('views', path_1.default.join(__dirname, 'views'));
database_1.app.set('view engine', 'hbs');
database_1.app.use(express_1.default.urlencoded({ extended: true }));
database_1.app.use(express_1.default.json());
database_1.app.use((0, cors_1.default)());
database_1.app.use('/', pages_1.default);
database_1.app.use('/auth', auth_1.default);
database_1.httpServer.listen('3003', () => console.log('app is running'));
console.log('ENV: ', secrets_1.environment);
console.log('Connection has been established successfully.');
//# sourceMappingURL=index.js.map
