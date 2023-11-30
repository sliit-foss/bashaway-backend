import { join } from 'path';

require('@babel/register');
require('dotenv/config');

const app = require(join(process.cwd(), 'api/app.js')).default;

module.exports = app;
