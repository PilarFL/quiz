//Definición del modelo de dato asociado a Quiz
module.exports = function(sequelize, DataTypes){
  return sequelize.define('Quiz',
            { pregunta: DataTypes.STRING,
              respuesta: DataTypes.STRING,
            });
}
