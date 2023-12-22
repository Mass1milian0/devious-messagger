const references = {
    Whitelist: [
        {
            schema: 'users',
            table: 'users',
            column: 'user_uuid',
            relation: 'belongsTo',
            foreignKey: 'user_uuid'
        },
        {
            schema: 'servers',
            table: 'servers',
            column: 'server_id',
            relation: 'belongsTo',
            foreignKey: 'server_id'
        }
    ]
}
function init(connection, Sequelize) {
    const Whitelist = connection.define('Whitelist', {
        whitelist_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        whitelist_user_uuid: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false //refers to the user_uuid in the users table
        },
        whitelist_server_id: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false //refers to the server_id in the servers table
        }
    }, {
        timestamps: false // Assuming you don't want the createdAt and updatedAt columns
    });

    return Whitelist;
}

module.exports = {init, references};