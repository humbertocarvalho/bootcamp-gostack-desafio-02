import { Op, startOfDay, endOfDay } from 'date-fns';
import Meetup from '../models/Meetup';

class AvailableMeetupController {
  async index(req, res) {
    const recordsPerPage = 10;

    const { date, page = 1 } = req.query;

    if (!date) {
      return res.status(400).json({
        error: 'Invalid date',
      });
    }
    const meetups = await Meetup.findAll({
      where: {
        host_id: req.userId,
        date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
      limit: recordsPerPage,
      offset: (page - 1) * recordsPerPage,
    });

    return res.json(meetups);
  }
}

export default new AvailableMeetupController();
