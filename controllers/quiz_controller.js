  var models = require('../models/models.js');

  // Autoload - factoriza el código si ruta incluye :quizId
 exports.load = function(req, res, next, quizId) {
   models.Quiz.find(quizId).then(
     function(quiz) {
         if (quiz) {
         req.quiz = quiz;
         next();
       } else { next(new Error('No existe quizId=' + quizId)); }
     }
   ).catch(function(error) { next(error);});
 };

  //GET /quizes
  //****Modificado para Busqueda de las preguntas************
  exports.index = function(req,res){
    //miro si se envia la query en la operación GET
    if (req.query.search) { //realizamos la búsqueda
      models.Quiz.findAll({where:
                  ["pregunta like ?","%"+req.query.search.replace(/ /g,"%")+"%"],
                  order: 'pregunta ASC'}).then(function(quizes) {
                        res.render('quizes/index.ejs', { quizes: quizes, errors: []});
                      }).catch(function(error) { next(error);});
    } else {
      //si no hay busqueda de preguntas, todas se envían a la página todas las preguntas disponibles
      models.Quiz.findAll().then(function (quizes){
        res.render('quizes/index.ejs',{ quizes: quizes, errors: []});
        }
      ).catch(function(error) { next(error);});
    }
  } ;


  //GET /quizes/:id
  exports.show = function(req,res){
  //  models.Quiz.find(req.params.quizId).then(function (quiz){
      res.render('quizes/show',{ quiz: req.quiz, errors: []});
  //  })
  };

  //GET /quizes/:id/answer
  exports.answer = function(req, res) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
      }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado,errors: []});
  };

  //GET /quizes/autor
  exports.autor = function(req,res){
      res.render('autor', {errors: []});
    };

  //GET /quizes/new
  exports.new = function(req,res){
      var quiz = models.Quiz.build( { pregunta: "Pregunta",
                                      respuesta: "Respuesta",
                                      tema: "Otros"});  // crea objeto quiz
      res.render('quizes/new', {quiz: quiz, errors: []});
  };

  //POST /quizes/create
  exports.create = function(req,res) {
      var quiz = models.Quiz.build( req.body.quiz );
      //crea una pregunta con los datos recogidos en la página web
      //quiz.validate() es null por lo que no se puede obtener .then()
      var errors = quiz.validate();
      if (errors){
        //convierto errors en Array con la propiedad message para compatibilizarlo con layout
        var i=0;
        var errores = new Array();
        for (var prop in errors) errores[i++]={message: errors[prop]};
        res.render('quizes/new', {quiz: quiz, errors: errores});
        //Se renderiza la página quizes/new con la variable errors como array
      }else{ //No hay errores
        quiz // guarda en la DB los campos pregunta y respuesta de quiz
        .save({fields:["pregunta","respuesta","tema"]})
        .then(function(){ res.redirect('/quizes')})
      }
    };

  //GET /quizes/:id/edit
  exports.edit = function(req, res) {
    var quiz = req.quiz; //autoload de instancia de quiz
    res.render('quizes/edit', {quiz: quiz, errors: []});
  };

  //PUT /quizes/:id
  exports.update = function (req, res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;
    //hago la validación como en POST, de forma diferente a las transparencias
    var errors = req.quiz.validate();
    if (errors){
      var i=0;
      var errores = new Array();
      for (var prop in errors) errores[i++]={message: errors[prop]};
        res.render('quizes/edit', {quiz: req.quiz, errors: errores});
    } else{
          req.quiz  //save: guarda campos pregunta y respuesta en DB
          .save ({fields: ["pregunta", "respuesta","tema"]})
          .then ( function (){ res.redirect('/quizes');});
    } // Redirección HTTP a la lista de preguntas (URL realtivo)
  };

  //DELETE /quizes/:id
  exports.destroy = function (req, res) {
    req.quiz.destroy().then(function(){
      res.redirect('/quizes');
    }).catch(function(error){next(error)});
  };
