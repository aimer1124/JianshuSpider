var request = require('supertest')('http://localhost:3000/');

describe('Home Page',function () {
    it('Verify Content',function (done) {
        request.get('')
            .expect(200)
            .end(done);
    });
});
