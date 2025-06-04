const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

class User extends Model {}
User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Почты или юзеры должны быть уникальными 
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Admin", "User"), 
      defaultValue: "User", // Если роль не назначена, то автоматически назначается роль "User" 
    },
  },
  {
    sequelize: db,
    modelName: "User",
    tableName: "users_p5",
    timestamps: true,
  }
);

module.exports = User;
