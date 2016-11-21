var config = require('./support/config');
var request = require('supertest')(config.baseUrl);
var cheerio = require('cheerio');


describe('Article Page',function () {
    it('Verify page content',function (done) {
        request.get('/article')
            .expect(200)
            .expect(function (res) {
                var $ = cheerio.load(res.text);
                if ($("#article tbody tr td").eq(0).text().length < 1) {
                    throw new Error("article title don't exist.");
                }
                if (!($("#article tbody tr").toArray().length == 20)) throw new Error("There is not 20 articles.");
            })
            .end(done);
    });
});
