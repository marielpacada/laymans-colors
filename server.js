const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const app = express();

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "./colors.json")));

const getMainColors = async (req, res, next) => {
    try {
        const colors = (function () {
            var colors = [];
            data.forEach(element => {
                colors.push(element.color);
            });
            return colors;
        })();
        res.send(colors);
    } catch (e) {
        next(e);
    }
};

const getSubcolors = async (req, res, next) => {
    try {
        const subcolors = data.find(color => color.color === req.params.color).subcolors;
        if (!subcolors) {
            const err = new Error('color not found');
            err.status = 404;
            throw err;
        }
        res.send(subcolors);
    } catch (e) {
        next(e);
    }
};

const getColorGroup = async (req, res, next) => {
    try {
        var colorGroup = [];
        for (const color of data) {
            if (color.subcolors.includes(req.params.subcolor)) {
                colorGroup.push(color.color);
                break;
            }
        }
        if (colorGroup.length === 0) {
            const err = new Error('subcolor not found');
            err.status = 404;
            throw err;
        }
        res.send(colorGroup);
    }
    catch (e) {
        next(e);
    }

};

app.route("/colors").get(getMainColors);
app.route("/colors/:color").get(getSubcolors);
app.route("/:subcolor").get(getColorGroup);

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
    console.log("Listening on PORT " + PORT);
});