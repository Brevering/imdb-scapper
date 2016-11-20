/* globals require module */
"use strict";

const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

let DetailedMovieSchema = new Schema({
    poster: {
        type: String,
        required: true
    },
    trailer: {
        type: String,
        required: true
    }
});



let DetailedMovie;
DetailedMovieSchema.statics.getDetailedMovieByUrl =
    function(url) {
        return new DetailedMovie({ poster: "something", trailer: "something" });
    };

mongoose.model("DetailedMovie", DetailedMovieSchema);
DetailedMovie = mongoose.model("DetailedMovie");
module.exports = DetailedMovie;