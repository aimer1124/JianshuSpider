var config = require('./config');
var request = require('supertest')(config.baseUrl);
var cheerio = require('cheerio');


describe('Article List Page',function () {
    it('Verify page content',function (done) {
        request.get('/jianshu')
            .expect(200)
            .expect(function (res) {
                var $ = cheerio.load(res.text);

                if ($("#article tbody tr td").eq(0).text().length < 1) {
                    throw new Error("article title must exist.");
                }
                if (!($("#article tbody tr").toArray().length == 20)) throw new Error("There is not 20 articles.");
            })
            .end(done);
    });
});
