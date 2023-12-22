const references = {}

function init(connection,Sequelize) {
    const Ranks = connection.define('Ranks', {
        rank_uuid: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        rank_name: {
            type: Sequelize.STRING(255)
        },
        rank_description: {
            type: Sequelize.TEXT
        }
    },{
        timestamps: false
    });
    return Ranks;
}

module.exports = {init, references};