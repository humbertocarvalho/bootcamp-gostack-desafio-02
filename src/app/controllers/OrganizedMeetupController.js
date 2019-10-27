import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class OrganizedMeetup {
  async index(req, res) {
    const page = req.query.page || 1;
    const amountPerPage = 10;

    const meetups = await Meetup.findAndCountAll({
      where: {
        host_id: req.userId,
      },
      limit: amountPerPage,
      offset: (page - 1) * amountPerPage,
      include: [
        { model: User, as: 'host', attributes: ['id', 'name', 'email'] },
        { model: File, as: 'banner', attributes: ['id', 'path', 'url'] },
      ],
      order: ['date'],
    });

    const totalPages = Math.ceil(meetups.count / amountPerPage);

    return res.json({ ...meetups, totalPages });
  }
}

export default new OrganizedMeetup();
