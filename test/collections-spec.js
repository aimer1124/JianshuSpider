var config = require('./config');
var request = require('supertest')(config.baseUrl);
var cheerio = require('cheerio');


describe('Collection Page',function () {
    it('Verify page content',function (done) {
        request.get('/collections')
            .expect(200)
            .expect(function (res) {
                var $ = cheerio.load(res.text);
                if ($("#collections tbody tr td").eq(0).text().length < 1) {
                    throw new Error("Collections title don't exist.");
                }
                if (!($("#collections tbody tr").toArray().length == 20)) throw new Error("There is not 20 collections.");
            })
            .end(done);
    });
});
