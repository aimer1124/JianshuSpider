var config = require('./config');
var request = require('supertest')(config.baseUrl);
var cheerio = require('cheerio');

describe('Home Page',function () {
    it('Verify page content',function (done) {
        request.get('')
            .expect(200)
            .expect(function (res) {
                var $ = cheerio.load(res.text);
                if ($("#myInfo tbody tr td").eq(0).text().indexOf("2016")) throw new Error("MyInfo date is lost, because date is not 201*Year");
                if ($("#myArticle tbody tr td").eq(1).text().indexOf("2016")) throw new Error("MyArticle is lost, because publish-date is not 201*Year");

            })
            .end(done);
    });
});
