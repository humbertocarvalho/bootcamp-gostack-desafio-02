import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class OrganizedMeetup {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        host_id: req.userId,
      },
      include: [
        { model: User, as: 'host', attributes: ['id', 'name', 'email'] },
        { model: File, as: 'banner', attributes: ['id', 'path', 'url'] },
      ],
      order: ['date'],
    });

    return res.json(meetups);
  }
}

export default new OrganizedMeetup();
