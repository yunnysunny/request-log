const app = require('../express/src/app-with-mongodb');

const request = require('supertest');
const {expect} = require('chai');
const rand = Math.random();
const reqUrl = '/?rand='+rand;
const {requestLogModel} = require('../express/src/config');
describe('mongodb test:',function() {
    it('sucess when request ' + reqUrl + ' ok',function(done) {
        request(app)
            .get(reqUrl)
            .expect(200)
            .end(function(err) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
    it('the lastest url is ' + reqUrl,function(done) {
        requestLogModel.findOne({},{original_url:1},{
            sort:{_id:-1},lean:true
        },function(err,item) {
            if (err) {
                return done(err);
            }
            if (!item) {
                return done('save to mongo failed');
            }
            expect(item.original_url).equal(reqUrl);
            done();
        });
    });
    it('success request when request /do-get-res-code',function(done) {
        request(app)
            .get('/do-get-res-code')
            .expect(200)
            .end(function(err) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
    it('the lastest url is /do-get-res-code and res_code is 1000',function(done) {
        requestLogModel.findOne({},{original_url:1,res_code:1},{
            sort:{_id:-1},lean:true
        },function(err,item) {
            if (err) {
                return done(err);
            }
            if (!item) {
                return done('save to mongo failed');
            }
            expect(item.original_url).equal('/do-get-res-code');
            expect(item.res_code).equal(1000);
            done();
        });
    });
});