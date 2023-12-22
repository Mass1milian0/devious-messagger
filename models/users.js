let references = {}

function init(connection,Sequelize) {
    const Users = connection.define('Users', {
        user_uuid: {
            type: Sequelize.STRING(36),
            allowNull: false,
            primaryKey: true
        },
        user_coins: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },{timestamps: false
    });
    return Users;    
}

module.exports = {init, references};