var config = require('./config');
var request = require('supertest')(config.baseUrl);

describe('Home Page',function () {
    it('Verify Content',function (done) {
        request.get('')
            .expect(200)
            .end(done);
    });
});
