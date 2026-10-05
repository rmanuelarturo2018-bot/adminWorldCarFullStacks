import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import AccountModel from './accounts.model.js';
import BrandModel from './brands.model.js';
import ProductTypeModel from './producTypes.model.js';
import ProductsModel from './products.model.js';
import ClientsModel from './clients.model.js';
import RoleModel from './roles.model.js';




dotenv.config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres', // <-- Set dialect to 'postgres'
    port: process.env.DB_PORT || 5432, // Optional: set port for PostgreSQL
    logging: true, // Optional: disable SQL logging
  }
);
const Account = AccountModel(sequelize, Sequelize);
const Brand = BrandModel(sequelize, Sequelize);
const ProductType = ProductTypeModel(sequelize, Sequelize);
const Products = ProductsModel(sequelize, Sequelize);
const Client = ClientsModel(sequelize, Sequelize);
const Role = RoleModel(sequelize, Sequelize);

// Define associations
Brand.hasMany(Products, { foreignKey: 'brandId' });
Products.belongsTo(Brand, { foreignKey: 'brandId' });

ProductType.hasMany(Products, { foreignKey: 'typeId' });
Products.belongsTo(ProductType, { foreignKey: 'typeId' });
// Define associations

Account.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(Account, { foreignKey: 'roleId' });

// Sync parent tables first, then child tables, to avoid FK constraint errors
async function syncDatabase() {
  const options = { alter: true };
  try {
    // 1. Tables with no foreign keys
    await Role.sync(options);
    await Brand.sync(options);
    await ProductType.sync(options);
    await Client.sync(options);
    // 2. Tables that depend on the above
    await Account.sync(options);
    await Products.sync(options);
    console.log('Database & tables synced successfully!');
  } catch (err) {
    console.error('Error syncing database:', err);
  }
}
//syncDatabase();

 
export { Account,
          Brand, 
          ProductType, 
          Products, 
          Client,
          Role,
    sequelize};