const app = require('../express/src/app-no-console');

const request = require('supertest');
describe('no console test:',function() {
    it('sucess when request / ok',function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(function(err: any) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});