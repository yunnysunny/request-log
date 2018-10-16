const app = require('../express/src/app-with-mongodb');

const request = require('supertest');
const {expect} = require('chai');
const rand = Math.random();
const reqUrl = '/?rand='+rand;
const {requestLogModel} = require('../express/src/config');
describe('mongodb test:',function() {
    it('sucess when request / ok',function(done) {
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
});