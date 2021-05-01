const express = require("express");
const logger = require("morgan");
const path = require("path");

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const app = express();

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(express.urlencoded());
app.use(express.json());
app.use(logger('tiny'));
app.use('/', require(path.join(__dirname, 'routes')));

app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} not found`);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});

app.listen(PORT, function () {
    console.log("Listening on PORT" + PORT);
});