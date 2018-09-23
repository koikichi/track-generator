// WEB SOCKET SERVER
// =============================================================================

//initialize the WebSocket server instance
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8181 });

var wsClientList = [];

function onWsMessage(msg) {
  console.log('client sent message : ', msg);
}
function connection(ws) {
  console.log('got a connection');
  //   console.log('clients are : ', wss.clients);
  ws.on('message', onWsMessage);

  wsClientList.push(ws);
}

// wss.on(
//   'connection',
//   connection() //function connection(ws) {
//   //   ws.on('message', function incoming(message) {
//   //     console.log('received: %s', message);
//   //   });

//   //   ws.send('something');
//   // });
// );

// wss.on('connection', function connection(ws) {
//   console.log('got a connection');
// });

wss.on('connection', connection);

// BASE SETUP
// =============================================================================
// import TrackDataStore from './models/trackdata.js';
var TrackDataStore = require('./models/TrackDataStore.js');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};

app.use(allowCrossDomain);
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// to serve static files like images accessed like localhost:8000/images/track.png
// (public folder is ignored)
app.use(express.static('public'));

var port = 8000;

// ROUTES FOR OUR API
//=====================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/sendTrackData').get(function(req, res) {
  // TrackDataStore.generateTracks(10);
  res.json('tracks generated....sending over websocket....');
  setInterval(function() {
    TrackDataStore.generateTracks(1000);
    wsClientList[0].send(JSON.stringify(TrackDataStore.getTracks()));
  }, 500);
});
router.route('/getTracks').get(function(req, res) {
  TrackDataStore.generateTracks(2);
  var trackList = TrackDataStore.getTracks();
  res.json(trackList);
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

// TrackDataStore.generateTracks(2);
// var trackList = TrackDataStore.getTracks();
// console.log(trackList);
