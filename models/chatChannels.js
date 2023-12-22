const references = {
    ChatChannels: [
        {
            relation: 'belongsTo',
            schema: 'servers', // Name of the model to associate
            foreignKey: 'server_id', // Foreign key in this model
            otherKey: 'server_id' // Key in the associated model
        }
    ]
}

function init(connection, Sequelize) {
    const ChatChannels = connection.define('ChatChannels', {
        channel_id: {
            type: Sequelize.DataTypes.STRING(36), // Using STRING to represent BINARY
            allowNull: false,
            primaryKey: true
        },
        channel_name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        server_id: {
            type: Sequelize.DataTypes.STRING(36), // Using STRING to represent BINARY
            allowNull: true
        }
    }, {
        timestamps: false
    });

    return ChatChannels;
}

module.exports = {init, references};