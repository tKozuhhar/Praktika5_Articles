const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

class Comment extends Model {}
Comment.init(
  {
    content: { 
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users_p5",
        key: "id",
      },
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "articles_p5",
        key: "id",
      },
    },
  },
  {
    sequelize: db,
    modelName: "Comment",
    tableName: "comments_p5",
    timestamps: true,
  }
);

module.exports = Comment;