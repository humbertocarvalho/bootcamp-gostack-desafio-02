import { Model } from 'sequelize';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id', as: 'meetup' });
    this.belongsTo(models.User, {
      foreignKey: 'participant_id',
      as: 'participant',
    });
  }
}

export default Registration;
