const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // Production / Deployment configured with Connection String
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Necessary for Render & Neon connections
      }
    },
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    }
  });
} else {
  // Local Development fallback using individual keys
  sequelize = new Sequelize(
    process.env.DB_NAME || 'perfumehub_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true,
      }
    }
  );
}

module.exports = sequelize;
