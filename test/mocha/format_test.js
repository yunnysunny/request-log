const app = require('../express/src/app-with-format');

const request = require('supertest');
const {expect} = require('chai');
let rand = '';
let reqUrl = '';
const {
    requestLogModel,
    CUSTOM_HEADER_KEY_MY_ID,
    TO_FORMAT_FIELD,
    FORMAT_SUFFIX
} = require('../express/src/config');
const MY_ID = Math.random() + '';
const MY_PARAM = 'MY_PARAM:ABC';
describe('format test:',function() {
    before(function() {
        rand = Math.random();
        reqUrl = '/?rand='+rand;
    });
    it('sucess when request ' + reqUrl + ' ok',function(done) {
        request(app)
            .get(reqUrl)
            .query({[TO_FORMAT_FIELD]: MY_PARAM})
            .set(CUSTOM_HEADER_KEY_MY_ID, MY_ID)
            .expect(200)
            .end(function(err) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
    it('the ' + TO_FORMAT_FIELD + ' will be format to ' + MY_PARAM + FORMAT_SUFFIX,function(done) {
        requestLogModel.findOne({},{custom_headers: 1,req_data:1},{
            sort:{_id:-1},lean:true
        },function(err,item) {
            if (err) {
                return done(err);
            }
            if (!item) {
                return done('save to mongo failed');
            }
            expect(item.custom_headers).to.have.property(CUSTOM_HEADER_KEY_MY_ID).and.equal(MY_ID);
            expect(item.req_data).to.have.property(TO_FORMAT_FIELD).and.equals(MY_PARAM + FORMAT_SUFFIX);
            done();
        });
    });
    
});