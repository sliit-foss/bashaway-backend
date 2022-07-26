require('dotenv/config');

module.exports = {
    mongodb: {
        url: process.env.MONGO_URI,
        options: {
            maxPoolSize: 1000,
            minPoolSize: 100,
            socketTimeoutMS: 30000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            keepAlive: true,
            keepAliveInitialDelay: 300000,
        },
    },
    migrationsDir: 'src/database/migrations',
    changelogCollectionName: 'migrations',
    migrationFileExtension: '.js',
    useFileHash: false,
    moduleSystem: 'commonjs',
};
