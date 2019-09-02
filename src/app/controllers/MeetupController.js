import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const { title, description, location, date } = req.body;
    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      host_id: req.userId,
    });
    return res.json(meetup);
  }
}

export default new MeetupController();
