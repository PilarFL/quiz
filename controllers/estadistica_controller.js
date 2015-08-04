var models = require('../models/models.js');

//Debemos consultar tanto la tabla de preguntas, Quiz, como la de comentarios, Comment.

//GET /quizes/estadisticas
exports.estadistico = function(req,res,next){

  // Defino un objeto para guardar los estadísticos solicitados por la página:
  // npreg:   Número de preguntas
  // n_com:   Numero de comentarios totales
  // media:   Numero medio de comentarios por pregunta
  // npre_sc: Numero de preguntas sin comentario
  // npre_cc: Numero de preguntas con comentario
  var estadistico = { npreg: 0, n_com: 0, media: 0, npre_sc: 0, npre_cc: 0};

  // Consultas a las tablas de la DB y cálculos
  models.Quiz.count().then( function(cont) {
      if (cont)  estadistico.npreg = cont;  //número de preguntas de la tabla Quiz
      models.Comment.count().then(function(cont){
    			if (cont)  estadistico.n_com = cont; //número de comentarios en total
          models.sequelize.query('SELECT count(distinct "QuizId") AS c FROM "Comments"').then(function(cont){
        			if (cont)  estadistico.npre_cc = cont[0].c; //número de preguntas con comentario
              estadistico.npre_sc = estadistico.npreg - estadistico.npre_cc;
              // Calculos:
              //Se halla la media siempre que haya datos. Se redondea los resultados a dos decimales
              estadistico.media = ((estadistico.npreg == 0) ? 0 : estadistico.n_com/estadistico.npreg).toFixed(2);
              //Datos a renderizar en la vista correspondiente
            	res.render('quizes/estadisticas',{estadistico: estadistico, errors: []});
          });
      });
  });
} ;
