//MW de autoriación de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
  if(req.session.user){ //sesion de usuario registrado
    req.session.timeout = false;
    next();
  }else{  //usuario no registrado
    res.redirect('/login');
  }
};


//MW de auto-logout. Si durante 30sg no se ha realizado ninguna transacción en
// una sesión registrada, se destruirá la sesión
exports.autoLogout = function(req,res,next){
  if(req.session.user){ //sesion de usuario registrado
    var tiempo = req.session.tiempo - req.session.tiempoIni;
    //los tiempos se han definido en los Helpers automáticos de app.js

    if(tiempo > 20000){// para probarlo pongo 10sg, no pongo2 minutos, 120000msg
      req.session.timeout = true;
      res.redirect('/logout'); //han transcurrido mas de 30sg, cierro la sesión
    } else { //cambio el tiempo de inicio al actual
      req.session.tiempoIni = req.session.tiempo;
      //req.session.timeout = false;
      next();
    }
  }else{  //sesión no registrada, no se controla el tiempo
    next();
  }
}


//GET /login   -->Formulario del login
exports.new = function(req, res){
  var errors= req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

//POST /login  -->Crear la sesión
exports.create =function (req, res){

  var login  =  req.body.login;
  var password  =  req.body.password;

  var userController = require ('./user_controller');
  userController.autenticar(login, password, function(error, user){

    if(error){  //Si hay error retornamos mensajes de error de sesión
      req.session.errors = [{"message": 'Se ha producido un error.  '+error}];
      res.redirect("/login");
      return;
      }
    //Crear req.session.user y guardar campos id y username
    //La sesión se define por la existencia de req.session.user
    req.session.user = {id:user.id, username: user.username};

    res.redirect(req.session.redir.toString());//redireccion y path anterior a login
  });
};

//DELETE /logout  -->Destruir session
exports.destroy = function(req, res){
  delete req.session.user;
  // delete req.session.timeout;
  res.redirect(req.session.redir.toString()); //redirect a path anterior tras el login
};
