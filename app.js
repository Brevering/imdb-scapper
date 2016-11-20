/* globals console require Promise */
"use strict";


const constants = require("./config/constants");
const simpleMovieScrapper = require("./functionalities/simple-movie-scrapping-functionality");

require("./config/mongoose")(constants.connectionString);

simpleMovieScrapper.scrap();