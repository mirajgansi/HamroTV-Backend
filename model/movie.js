const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db"); // Import Sequelize instance

const Movie = sequelize.define("Movie", {
    movie_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    movie_name: { type: DataTypes.STRING, allowNull: false },
    movie_description: { type: DataTypes.TEXT, allowNull: true },
    youtube_link: { type: DataTypes.STRING, allowNull: true },
    release_year: { type: DataTypes.INTEGER, allowNull: false },
    genre: { type: DataTypes.STRING, allowNull: false },
    director: { type: DataTypes.STRING, allowNull: false },
    rating: { type: DataTypes.FLOAT, allowNull: true },
    thumbnailupload:{  type: DataTypes.STRING,allowNull: true,
}, 
    
});

module.exports = Movie;
