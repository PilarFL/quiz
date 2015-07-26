//Definición con validación del modelo de dato asociado a la tabla de Comentarios.
module.exports = function(sequelize, DataTypes){
  return sequelize.define('Comment',
            { texto: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "-> Falta Comentario"}}
                }
            }
  );
}
