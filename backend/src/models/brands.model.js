import { DataTypes } from 'sequelize';
export default (sequelize) => {
  const Brand = sequelize.define('Brand', { //Definir el modelo de la tabla accounts
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Validar que el email no sea nulo
      unique: true, // Validar que el email sea único
    }
  }, {
    tableName: 'brands',
    timestamps: false,
    //createdAt
    //updatedAt
  });
  return Brand;
};
