const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

//  User model
const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

sequelize.sync();

module.exports = { User };
