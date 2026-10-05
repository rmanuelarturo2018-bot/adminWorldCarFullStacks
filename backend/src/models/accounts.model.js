import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

/**
 * Helper: detect if a value is already a bcrypt hash.
 * Bcrypt hashes always start with "$2a$", "$2b$", or "$2y$" and are 60 chars long.
 */
function isAlreadyHashed(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value) && value.length === 60;
}

export default (sequelize) => {
  const Account = sequelize.define('Account', { //Definir el modelo de la tabla accounts
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // Validar que el email no sea nulo
      unique: true, // Validar que el email sea único
      validate: {
        isEmail: true, // Validar que el email sea válido
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Validar que la contraseña no sea nula
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false, //validar que el nombre no sea nulo
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false, //
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    isActived: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Campo virtual: nombre completo combinado (no se guarda en DB)
    name: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName || ''} ${this.lastName || ''}`.trim();
      }
    },
  }, {
    tableName: 'accounts',
    timestamps: false,
     hooks: {
      async beforeCreate(account) {
        // Solo hashear si NO es ya un hash bcrypt (evita doble encriptación)
        if (account.password && !isAlreadyHashed(account.password)) {
          console.debug(`[accounts.model] beforeCreate: hashing password for email=${account.email || 'unknown'}`);
          const hashed = await bcrypt.hash(account.password, 10);
          account.password = hashed;
          console.debug(`[accounts.model] beforeCreate: stored hash length=${hashed.length}`);
        }
      },
      async beforeUpdate(account) {
        // Doble protección: (1) el campo cambió, (2) el nuevo valor no es ya un hash
        if (account.changed('password') && account.password && !isAlreadyHashed(account.password)) {
          console.debug(`[accounts.model] beforeUpdate: hashing new password for email=${account.email || 'unknown'}`);
          const hashed = await bcrypt.hash(account.password, 10);
          account.password = hashed;
          console.debug(`[accounts.model] beforeUpdate: stored hash length=${hashed.length}`);
        }
      },
    }, 
    
  });
  Account.prototype.validatePassword = async function (password) {
    // Protecciones para evitar errores de bcrypt cuando alguno de los dos valores no es string
    try {
      if (password == null || this.password == null) {
        console.warn('validatePassword: password or stored hash is null/undefined');
        return false;
      }
      // Asegurar que sean strings
      const plaintext = typeof password === 'string' ? password : String(password);
      const hash = typeof this.password === 'string' ? this.password : String(this.password);
      console.debug(`[accounts.model] validatePassword: comparing for email=${this.email || 'unknown'}; storedHashLen=${hash.length}`);
      const res = await bcrypt.compare(plaintext, hash);
      console.debug(`[accounts.model] validatePassword: compare result for email=${this.email || 'unknown'} -> ${res}`);
      return res;
    } catch (err) {
      console.error('Error comparing password:', err);
      return false;
    }
  }
  return Account;
};
