import { DataTypes } from 'sequelize';
export default (sequelize) => {
  const ProducType = sequelize.define('ProductType', { //Definir el modelo de la tabla accounts
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Validar que el email no sea nulo
      unique: true, // Validar que el email sea único
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false, // Validar que la contraseña no sea nula
    },
  }, {
    tableName: 'producTypes',
    timestamps: false,
  });
  return ProducType;
};
