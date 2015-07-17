var express = require('express');
var router = express.Router();

/*Importar quiz_controller.js*/
var quizController =require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/*Definición de rutas de /quizes*/
router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);

router.get('/autor', quizController.autor);

/*nuevas rutas
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
router.get('/autor', quizController.autor);*/

module.exports = router;
