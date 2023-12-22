const references = {}
function init(connection, Sequelize) {
    const Servers = connection.define('Servers', {
        server_id: {
            type: Sequelize.DataTypes.STRING(36), // Using STRING to represent BINARY
            allowNull: false,
            primaryKey: true
        },
        server_name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        server_ip: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        server_amp_id: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false // Assuming you don't want the createdAt and updatedAt columns
    });

    return Servers;
}

module.exports = {init, references};