var express = require('express');
var router = express.Router();

/*Importar quiz_controller.js*/
var quizController =require('../controllers/quiz_controller');
var commentController =require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var estadisticaController = require('../controllers/estadistica_controller');

/* Página de entrada --> GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: []});
});

//Autoload de comandos con :quidId
router.param('quizId', quizController.load);  // autoload :quizId
router.param('commentId', commentController.load); //autoload :commentId

//Definicion de rutas de sesion
router.get('/login',sessionController.new);       // formulario login
router.post('/login',sessionController.create);   // crear sesión
router.get('/logout',sessionController.destroy);  // destruir sesión

/*Definición de rutas de /quizes*/
router.get('/quizes',                       sessionController.autoLogout, quizController.index);
router.get('/quizes/:quizId(\\d+)',         sessionController.autoLogout, quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  sessionController.autoLogout, quizController.answer);
router.get('/autor',                        sessionController.autoLogout, quizController.autor);
router.get('/quizes/new',                   sessionController.loginRequired,  sessionController.autoLogout, quizController.new);
router.post('/quizes/create',               sessionController.loginRequired,  sessionController.autoLogout, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',    sessionController.loginRequired,  sessionController.autoLogout, quizController.edit);
router.put('/quizes/:quizId(\\d+)',         sessionController.loginRequired,  sessionController.autoLogout, quizController.update);
router.delete('/quizes/:quizId(\\d+)',      sessionController.loginRequired,  sessionController.autoLogout, quizController.destroy);

//Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', sessionController.autoLogout, commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',    sessionController.autoLogout, commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
              sessionController.loginRequired, sessionController.autoLogout, commentController.publish);

//Definicion de ruta de las estadisticas
router.get('/quizes/estadisticas',          sessionController.autoLogout, estadisticaController.estadistico);

module.exports = router;
