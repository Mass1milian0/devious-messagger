require('dotenv').config();
const fs = require('fs');
const Sequelize = require('sequelize');
const verboseLog = require('./logger.js');

// Initialize Sequelize connection
const connection = new Sequelize(process.env.SQL_DATABASE, process.env.SQL_USER, process.env.SQL_PASSWORD, {
    host: process.env.SQL_HOST,
    dialect: 'mariadb',
    logging: process.env.NODE_ENV === 'development' ? verboseLog : false,
});

const models = {};
let references = {};

async function loadModels() {
    try {
        const files = fs.readdirSync('./models');
        for (const file of files) {
            if (file.endsWith('.js')) {
                const { init, references: modelReferences } = require(`../models/${file}`);
                const modelName = file.replace('.js', '');
                models[modelName] = init(connection, Sequelize);
                if (modelReferences) {
                    references[modelName] = modelReferences;
                }
            }
        }
    } catch (err) {
        verboseLog('Error loading models:', err);
        throw err;
    }
}

function setupAssociations() {
    for (const [modelName, modelRefs] of Object.entries(references)) {
        if (Object.keys(modelRefs).length === 0) continue;
        for (const refs of Object.values(modelRefs)) {
            for (const ref of Object.values(refs)) {
                const model = models[modelName];
                const relatedModel = models[ref.schema];
                switch (ref.relation) {
                    case 'belongsToMany':
                        model.belongsToMany(relatedModel, {
                            through: {
                                model: models[ref.throughModel],
                                unique: false
                            },
                            foreignKey: ref.foreignKey,
                            otherKey: ref.otherKey
                        });
                        break;
                    case 'hasMany':
                        model.hasMany(relatedModel, {
                            foreignKey: ref.foreignKey
                        });
                        break;
                    case 'belongsTo':
                        model.belongsTo(relatedModel, {
                            foreignKey: ref.foreignKey
                        });
                        break;
                    case 'hasOne':
                        model.hasOne(relatedModel, {
                            foreignKey: ref.foreignKey
                        });
                        break;
                    default:
                        throw new Error(`Unknown relation type: ${ref.relation}`);
                }
            }
        }
    }
}

async function initializeDatabase() {
    if (!connection.modelsLoaded) {
        await loadModels();
        setupAssociations();
        connection.modelsLoaded = true;     
    }

    try {
        await connection.sync({ force: true });
        verboseLog('Database & tables created!');
    } catch (err) {
        verboseLog('Error syncing database:', err);
        throw err;
    }
}


initializeDatabase().catch(err => {
    verboseLog(err);
    process.exit(1);
});

module.exports = models;