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

  async update(req, res) {
    const { id } = req.params;

    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      return res.status(401).json({ error: `Meetup ${id} not found.` });
    }

    // Caso o usuário não seja o dono do Meetup, não irá permitir alterar
    if (meetup.host_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Only the host can edit the meeetup.' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }
}

export default new MeetupController();
