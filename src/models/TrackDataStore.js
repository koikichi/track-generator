//doesnt work, NODE.js does not support ES6 yet
// export default class TrackDataStore {
//   constructor() {
//     this.tracks = new Map();
//   }

//   generateTracks(numTracks) {
//     for (var i = 0; i < numTracks; i++) {
//       var trackdata = {
//         id: i,
//         latitude: -35,
//         longitude: 138
//       };
//       this.tracks.set(i);
//     }
//   }

//   getTracks() {
//     for (track in this.tracks) {
//       console.log('track : ', track);
//     }
//   }
// }

var faker = require('faker');
// console.log(faker.address.latitude());
// console.log(faker.address.longitude());

var trackStore = new Map();

module.exports = {
  generateTracks: function(numTracks) {
    for (var i = 0; i < numTracks; i++) {
      var trackData = {
        id: i,
        latitude: parseFloat(faker.address.latitude()),
        longitude: parseFloat(faker.address.longitude())
      };
      trackStore.set(i, trackData);
    }
  },
  getTracks: function() {
    var trackList = [];
    for (var i = 0; i < trackStore.size; i++) {
      trackList.push(trackStore.get(i));
    }

    return trackList;
  }
};
