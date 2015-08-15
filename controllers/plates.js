var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");

// View Today's Plates
router.get("/new", function(req, res){
        res.render('plates/new');
});

// View Trending Plates
router.get("/trending", function(req, res){
        res.render('plates/trending');
});

// View Plates From Favorited Chefs
router.get("/mychefs", function(req, res){
        res.render('plates/following');
});

// View Individual Plate -- This will not work until we pass information (params :id) in.
router.get("/:id/show", function(req, res){
        res.render('plates/show');
});

module.exports = router;