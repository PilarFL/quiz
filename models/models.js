var path = require('path');
//Cargar Modelo ORM
var Sequelize =require('sequelize');
//Usar BBDDSQLite:
var sequelize = new Sequelize(null,null,null,
                        {dialect: "sqlite", storage: "quiz.sqlite"}
                      );
//Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz; //exportar definición de la tabla Quiz
//sequelize.sync() crea e inicializa tabla de preguntas en BD
sequelize.sync().success(function(){
  // sucess(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().success(function (count){
    if (count === 0){//La tabla se inicializa solo si está vacía
      Quiz.create({ pregunta:'Capital de Italia',
                    respuesta:'Roma'
                  })
      .success(function(){console.log('Base de datos inicializada')});
    };
  });
});
