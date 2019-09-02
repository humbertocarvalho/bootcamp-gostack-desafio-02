import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    return res.json({ message: 'ok' });
  }
}

export default new MeetupController();
