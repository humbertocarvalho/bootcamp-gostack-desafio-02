import Sequelize from 'sequelize';

import databaseconfig from '../config/database';

class Database {
  init() {
    this.connection = new Sequelize(databaseconfig);
  }
}

export default new Database();
