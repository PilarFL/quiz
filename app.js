var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
//var tiempo = new Date().getTime();

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz-2015-pfl'));
app.use(session());

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Helpers dinámicos:
app.use(function(req, res, next){

  //TRANSACCION DE SESIÓN: guardar path en session.redir para despues de login
  // No se guardará el path que se recibe, depende del método usado
  if(!req.path.match(/\/login|\/logout/)) {
    if ((req.path == "/quizes/create") || (req.path.match(/\/quizes\/(\d+)/)!=null)) {
           req.session.redir = "/quizes";
        } else { // en otro caso se guarda el path que se recibe
          req.session.redir = req.path;
        }
    //SESIÓN REGISTRADA, contabilizo el tiempo para compararlo con el inicial
    if (req.session.user)  req.session.tiempo = new Date().getTime();
  }

  //INICIO DE SESIÓN: guardar el tiempo en el objeto req al iniciar la session
  if(req.path.match(/login/)) {
    //almacenamos el tiempo en milisegundos desde enero de 1070. ¡Toma ya!
    req.session.tiempoIni = new Date().getTime();
    req.session.timeout = false;
  };

  //Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors:[]
    });
});


module.exports = app;
