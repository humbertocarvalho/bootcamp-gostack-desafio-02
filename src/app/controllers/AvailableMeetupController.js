import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class AvailableMeetupController {
  async index(req, res) {
    const recordsPerPage = 10;

    const { date, page = 1 } = req.query;

    if (!date) {
      return res.status(400).json({
        error: 'Data inválida',
      });
    }

    const parsedDate = parseISO(date);

    const meetups = await Meetup.findAndCountAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      attributes: ['id', 'title', 'description', 'location', 'date', 'host_id'],
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'name'],
        },
        { model: File, as: 'banner', attributes: ['id', 'path', 'url'] },
      ],
      limit: recordsPerPage,
      offset: (page - 1) * recordsPerPage,
    });

    const totalPages = Math.ceil(meetups.count / recordsPerPage);

    return res.json({ ...meetups, totalPages });
  }
}

export default new AvailableMeetupController();
