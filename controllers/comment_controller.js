var models = require('../models/models.js');

//Controladores de comentarios asociados a las acciones create y new
//new : asociado a la formulario de visualización de un nuevo comentario.
//create: asociado a la formulario de creación de un nuevo comentario.

//GET /quizes/:quizId(\\d+)/comments/new
exports.new = function(req,res){
  res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

//POST /quizes/:quizId(\\d+)/comments
exports.create = function(req,res) {
    var comment = models.Comment.build({ texto: req.body.comment.texto,
                              QuizId: req.params.quizId});
    var errors = comment.validate();
    if (errors){
      var i=0;
      var errores = new Array();
      for (var prop in errors) errores[i++]={message: errors[prop]};
      res.render('comments/new.ejs',{ comment: comment,
        quizid: req.params.quizId, errors: errores })
    }else{ //save: guarda en DB campo texto de comment
      console.log('GUARDAMOS EN LA DB  :   '+comment);
      comment.save().then( function(){res.redirect('/quizes/'+req.params.quizId)})
    } //res.redirect: Redirección HTTP a la lista de preguntas
  };
