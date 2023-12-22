let references = {
    User_Ranks: [
        {
            schema: 'users',
            table: 'users',
            column: 'user_uuid',
            relation: 'belongsTo',
            foreignKey: 'user_uuid'
        },
        {
            schema: 'ranks',
            table: 'ranks',
            column: 'rank_uuid',
            relation: 'belongsTo',
            foreignKey: 'rank_uuid'
        }
    ]
};

function init(connection, Sequelize) {
    const User_Ranks = connection.define('User_Ranks', {
        id:{
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_uuid: {
            type: Sequelize.STRING(36),
            allowNull: false,
            unique: false
        },
        rank_uuid: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: false
        }
    },{timestamps: false
    });
    return User_Ranks;
}

module.exports = { init, references };
