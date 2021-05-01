const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const getColors = async (req, res, next) => {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, "./colors.json")));
        const colors = () => {
            var colors = [];
            for (const obj in data) {
                colors.push(obj.color);
            }
            return colors;
        };
        res.JSON(colors);
    } catch (e) {
        next(e);
    }
};

router.route("/api/colors").get(getColors);








module.exports = router;