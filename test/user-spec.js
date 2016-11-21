var config = require('./support/config');
var request = require('supertest')(config.baseUrl);
var cheerio = require('cheerio');

describe('User Page',function () {
    it('Get page content',function (done) {
        request.get('/user')
            .expect(200)
            .expect(function (res) {
                var $ = cheerio.load(res.text);

                if (!($("#user tbody tr td").eq(2).text() > 0)) {
                    throw new Error("The follower is smaller than 0 ????");
                }
                if (!($("#user tbody tr").toArray().length == 20)) {
                    throw new Error("There is not 20 users.");
                }
            })
            .end(done);
    });
});
