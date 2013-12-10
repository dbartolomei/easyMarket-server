
var express = require('express')
  , http = require('http')
  , path = require('path')
  , config = require('./utilities/config')
  , passport = require('passport');


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.secret}));
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(allowCrossDomain);

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./utilities/routes.js')(app, express);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
