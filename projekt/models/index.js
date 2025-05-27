const Article = require("./Article");
const User = require("./User");
const Comment = require("./Comment");

// Указываем связи между таблицами (как они связаны друг с другом)
// Это нужно, чтобы Sequelize знал, как доставать данные из разных таблиц вместе

Article.belongsTo(User, {foreignKey: "userId"});
Article.hasMany(Comment, {foreignKey: "articleId"});

User.hasMany(Article, {foreignKey: "userId"});
User.hasMany(Comment, {foreignKey: "userId"});

Comment.belongsTo(User, {foreignKey: "userId"});
Comment.belongsTo(Article, {foreignKey: "articleId"});

module.exports = { Article, User, Comment };