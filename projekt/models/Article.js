const { DataTypes, Model } = require("sequelize");

const db = require("../config/database");

class Article extends Model {}

Article.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      field: "content", 
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "userId",
      references: {
        model: "users_p5", 
        key: "id",  
      },
    },
  },
  {
    sequelize: db,
    modelName: "Article",
    tableName: "articles_p5",
    timestamps: false,
  }
);

module.exports = Article;