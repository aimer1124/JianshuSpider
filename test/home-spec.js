var config = require('./config');
var request = require('supertest')(config.baseUrl);
var cheerio = require('cheerio');

describe('Home Page',function () {
    it('Verify page content',function (done) {
        request.get('')
            .expect(200)
            .expect(function (res) {
                var $ = cheerio.load(res.text);

                //myinfo
                if (!($("#myInfo tbody tr td").eq(0).text().split('-')[0] == "2016")) {
                    throw new Error("MyInfo date is lost, because date is not 201*Year");
                }
                if (!($("#myInfo tbody tr").toArray().length == 7)) {
                    throw new Error("There is not 7 information.");
                }

                //charts

                if(!$(".highcharts-subtitle").eq(0).text().indexOf("数据来源")) throw new Error("Chart source is mistake.");
                if(!$(".highcharts-xaxis-labels").text().indexOf("2016")) throw new Error("XAxis is lost.");


                //my_articles
                if ($("#myArticle tbody tr").toArray().length != 9) {
                    throw new Error("There is not 9 articles.");
                }
                if (!($("#myArticle tbody tr td").eq(1).text().split('-')[0] == "2016")) {
                    throw new Error("MyArticle is lost, because publish-date is not 201*Year");
                }

            })
            .end(done);
    });
});
