var request = require('request');
var expect = require('chai').expect;


describe('/', function(){
  it('should respond to GET request with a 200 status code', function(done){
    request('http://localhost:8000/', function(err, res, body){
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
});

describe('/getRouteFromGoogle', function(){
  it('should send back an array of lat and lon objects', function(done){
    request({
      method: "POST",
      url: "http://localhost:8000/getRouteFromGoogle",
      json: {
        start: "40.8534229,-73.9793236",
        end: "40.7466059,-73.9885128"
      }
    }, function(err, res, body){
      expect(body).to.be.an('array');
      body.forEach(function(geolocation){
        expect(Object.keys(geolocation).length).to.equal(2);
        expect(geolocation.latitude).not.to.be.NaN;
        expect(geolocation.longitude).not.to.be.NaN;
      })
      done();
    });
  });
});

describe('/searchKeywords', function(){
  it('should send back a message if keywords not found', function(done){
    request({
      method: "POST",
      url: "http://localhost:8000/searchKeywords",
      json: {keywords: ["expectingNotFoundMessage"]}
    }, function(err, res, body){
      expect(body).to.be.an('object');
      expect(body.message).to.equal("We don't have any routes for those keywords");
      done();
    });
  });

  it('should send back an array of routes', function(done){
    request({
      method: "POST",
      url: "http://localhost:8000/searchKeywords",
      json: {keywords: ["run"]}
    }, function(err, res, body){
      expect(body).to.be.an('array');
      done();
    });
  });
});

describe('/getRouteById', function(){

});
describe('/getMyEvents', function(){

});
describe('/getAllUsers', function(){

});
describe('/signup', function(){

});
describe('/createRoute', function(){

});
describe('/createEvent', function(){

});
