var http = require("https");



// var start = 40.8534229,-73.9793236
// var end = 40.7466059,-73.9885128
const getRoute = (start,end, cb)=>{
      // start.toString();
      // end.toString();
      var options = {
            "method": "GET",
            "hostname": "maps.googleapis.com",
            "port": null,
            "path": "/maps/api/directions/json?origin=" + start + "&destination=" + end + "&mode=walking&key=AIzaSyDPR_rluVMdgqvM4JBorRSJa3Q2Mo_rUXU",
            "headers": {
              "cache-control": "no-cache",
              "postman-token": "2a345e43-8982-8909-5e33-b51770a63de2"
            }
          };
      var req = http.request(options, function (res) {
        var chunks = [];
        var body = "";

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function () {
          body += Buffer.concat(chunks);
          // console.log(body.toString());
          var result = [];
          var json = JSON.parse(body);
          result.push({
            latitude: json.routes[0].legs[0].start_location.lat,
            longitude: json.routes[0].legs[0].start_location.lng
          });
          // json.routes[0].legs[0].start_location
          json.routes[0].legs[0].steps.forEach(function(step){
            result.push({
              latitude: step.end_location.lat,
              longitude: step.end_location.lng
            })
          })
          // console.log(json.routes[0].legs[0]);
          //console.log(result);
          cb(result);
        });
      });

  //  req.write("{\n    \"userId\": 1,\n    \"data\": {\n        \"routes\": \"[1,2,3]\"\n    }\n}");
    req.end();
}
module.exports = getRoute;
