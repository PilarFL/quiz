var express = require('express');
var router = express.Router();

/*Importar quiz_controller.js*/
var quizController =require('../controllers/quiz_controller');
var commentController =require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* Página de entrada --> GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: []});
});

//Autoload de comandos con :quidId
router.param('quizId', quizController.load);  // autoload :quizId

//Definicion de rutas de sesion
router.get('/login',sessionController.new);       // formulario login
router.post('/login',sessionController.create);   // crear sesión
router.get('/logout',sessionController.destroy);  // destruir sesión

/*Definición de rutas de /quizes*/
router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
router.get('/autor',                        quizController.autor);
router.get('/quizes/new',                   quizController.new);
router.post('/quizes/create',               quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',    quizController.edit);
router.put('/quizes/:quizId(\\d+)',         quizController.update);
router.delete('/quizes/:quizId(\\d+)',      quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new',   commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',   commentController.create);

module.exports = router;
