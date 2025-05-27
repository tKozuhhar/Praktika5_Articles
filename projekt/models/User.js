const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

class User extends Model {}
User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // E-posti aadressid peavad olema unikaalsed
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Admin", "User"), 
      defaultValue: "User", // Kui rolli ei ole määratud, saab kasutajast automaatselt "User"
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