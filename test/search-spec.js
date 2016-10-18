var config = require('./config');
var request = require('supertest')(config.baseUrl);
var cheerio = require('cheerio');

describe('Search Page', function () {
    it('Default Page', function (done) {
        request.get('/search')
            .expect(200)
            .expect(function (res) {
                var $ = cheerio.load(res.text);
                if ($("input").toArray().length < 1) throw new Error('There is not input_text!');
                if (!$("button")) throw new Error('There is not search_button!');
            })
            .end(done);
    });

    it('Search article', function (done) {
        request.post('/search')
            .send({'searchContent': '1'})
            .expect(200)
            .expect(function (res) {
                var $ = cheerio.load(res.text);
                if ($("#article tbody tr td").eq(0).text().length < 1) {
                    throw new Error("article title must exist.");
                }
            })
            .end(done);
    })
});