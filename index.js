'user strict';

const http = require('http');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const bodyParserJsonError = require('express-body-parser-json-error');
const config = require('./config/config.js');
const authentificator = require('./middleware/authentificator');

let app = express();
let router = require('./router.js');

app.use((req, res, next) => {
    let oneof = false;
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }

    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type, Accept, Origin');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if (oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    if (req.method == 'OPTIONS') {
        res.status(200).send();
    } else {
        next();
    }
});

app.use((req, res, next) => {
    authentificator.auth(req, res, next);
});

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(bodyParserJsonError());
app.use(compress());

app.use('/', router);

http.createServer(app).listen(config.port);