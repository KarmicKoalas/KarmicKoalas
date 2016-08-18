var request = require('request');
var expect = require('chai').expect;

var localhost = "http://localhost:8000";

describe('/', () => {
  it('should respond to GET request with a 200 status code', (done) => {
    request(localhost + "/", (err, res, body) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
});

describe('/getRouteFromGoogle', () => {
  it('should send back an array of lat and lon objects', (done) => {
    request({
      method: "POST",
      url: localhost + "/getRouteFromGoogle",
      json: {
        start: "40.8534229,-73.9793236",
        end: "40.7466059,-73.9885128"
      }
    }, (err, res, body) => {
      expect(body).to.be.an('array');
      body.forEach(geolocation => {
        expect(Object.keys(geolocation).length).to.equal(2);
        expect(geolocation.latitude).not.to.be.NaN;
        expect(geolocation.longitude).not.to.be.NaN;
      });
      done();
    });
  });
});

describe('/searchKeywords', () => {
  it('should send back a message if keywords not found', (done) => {
    request({
      method: "POST",
      url: localhost + "/searchKeywords",
      json: {
        keywords: ["expectingNotFoundMessage"]
      }
    }, (err, res, body) => {
      expect(body).to.be.an('object');
      expect(body.message).to.equal("We don't have any routes for those keywords");
      done();
    });
  });

  it('should send back an array of routes', (done) => {
    request({
      method: "POST",
      url: localhost + "/searchKeywords",
      json: {
        keywords: ["run"]
      }
    }, (err, res, body) => {
      expect(body).to.be.an('array');
      done();
    });
  });
});

describe('/getRouteById', () => {
  it('should send back a route object', (done) => {
    request({
      method: "POST",
      url: localhost + "/getRouteById",
      json: {
        event_id: 126
      }
    }, (err, res, body) => {
      expect(body).to.be.an('object');
      // TODO why is body.title stringified?
      expect(JSON.parse(body.title)).to.equal("New York walk");
      done();
    });
  });
});
describe('/getMyEvents', () => {
  it('should send back an array of events', (done) => {
    request({
      method: "POST",
      url: localhost + "/getMyEvents",
      json: {
        user_id: 33
      }
    }, (err, res, body) => {
      expect(body).to.be.an('array');
      done();
    });
  });
});
describe('/getAllUsers', () => {
  it('should send back an array of users', (done) => {
    request(localhost + "/getAllUsers", (err, res, body) => {
      var users = JSON.parse(body);
      expect(users).to.be.an('array');
      done();
    });
  });
});
describe('/signup', () => {
  var User = require('../server/db/models/user');
  it("should create a new user", (done) => {
    request({
      method: "POST",
      url: localhost + "/signup",
      json: {
        name: "test",
        username: "test",
        email: "test@test.com",
        password: "test"
      }
    }, (err, res, body) => {
      expect(body).to.be.an("object");
      var userId = body.userId;
      expect(userId).not.to.be.NaN;
      request(localhost + "/getAllUsers", (err, res, body) => {
        var users = JSON.parse(body);
        var found = false;
        users.forEach(user => {
          if(user.user_id === userId) found = true;
        });
        expect(found).to.equal(true);
        new User({
          id: userId
        }).destroy().then(user => {
          request(localhost + "/getAllUsers", (err, res, body) => {
            var users = JSON.parse(body);
            var found = false;
            users.forEach(user => {
              if(user.user_id === userId) found = true;
            });
            expect(found).to.equal(false);
            done();
          });
        });
      });
    });
  });
});

describe('/createRoute', () => {
  it("should create a new Route", (done) => {
    //{title:'bike in Central Park', keywords:['New York', 'Central Park', 'bike', 'bicycle'],start:'{latitude: 37.33756603, longitude: -122.02681114}', end:{latitude: 37.34756603, longitude: -122.02581114}, routeObject: '[{latitude: 37.33756603, longitude: -122.02681114}, {latitude: 37.34756603, longitude: -122.02581114}]'}
    request({
      method: "POST",
      url: localhost + "/createRoute",
      json: {
        title: "test",
        keywords: ["test"],
        start: {
          latitude: 37.33756603,
          longitude: -122.02681114
        },
        end: {
          latitude: 37.34756603,
          longitude: -122.02581114
        },
        routeObject: [
          {latitude: 37.33756603, longitude: -122.02681114},
          {latitude: 37.34756603, longitude: -122.02581114}
        ]
      }
    }, (err, res, body) => {
      // TODO
      done();
    })
  });
});

describe('/createEvent', () => {

});
