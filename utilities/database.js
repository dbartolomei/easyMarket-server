var config = require('./config');
var pg = require('pg'); 

var client = new pg.Client(config.db);

client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  else{
    console.log('DB Connected');
  }
});
	
exports.client = client;  