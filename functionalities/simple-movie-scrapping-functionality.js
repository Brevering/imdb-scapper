/* globals console require Promise */
"use strict";

const httpRequester = require("../utils/http-requester");
const htmlParser = require("../utils/html-parser");
const queuesFactory = require("../data-structures/queue");
const modelsFactory = require("../models");
const wait = require("../utils/wait");

const constants = require("../config/constants");


module.exports = {
    scrap() {
        let urlsQueue = queuesFactory.getQueue();

        constants.genres.forEach(genre => {
            for (let i = 0; i < constants.pagesCount; i += 1) {
                let url = `http://www.imdb.com/search/title?genres=${genre}&title_type=feature&0sort=moviemeter,asc&page=${i + 1}&view=simple&ref_=adv_nxt`;
                urlsQueue.push(url);
            }
        });

        function extractGenreFromUrl(url) {
            let index = url.indexOf("&title");
            return url.substring("http://www.imdb.com/search/title?genres=".length, index);
        }

        function getMoviesFromUrl(url) {
            console.log(`Working with genre ${extractGenreFromUrl(url)}`);
            httpRequester.get(url)
                .then((result) => {
                    const selector = ".col-title span[title] a";
                    const html = result.body;
                    return htmlParser.parseSimpleMovie(selector, html);
                })
                .then(movies => {
                    let dbMovies = movies.map(movie => {
                        return modelsFactory.getSimpleMovie(movie.title, movie.url);
                    });

                    modelsFactory.insertManySimpleMovies(dbMovies);

                    return wait(1000);
                })
                .then(() => {
                    if (urlsQueue.isEmpty()) {
                        return;
                    }

                    getMoviesFromUrl(urlsQueue.pop());
                })
                .catch((err) => {
                    console.dir(err, { colors: true });
                });
        }

        const asyncPagesCount = 15;

        Array.from({ length: asyncPagesCount })
            .forEach(() => getMoviesFromUrl(urlsQueue.pop()));
    }
};