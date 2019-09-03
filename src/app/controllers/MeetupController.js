import { isBefore, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {
    // TODO Adicionar para listar somente algumas propriedades
    const meetups = await Meetup.findAll({
      where: {
        host_id: req.userId,
      },
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const { title, description, location, date } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res.status(401).json({ error: 'Past dates are not allowed' });
    }

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

    const { date } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res.status(401).json({ error: 'Past dates are not allowed' });
    }

    // Caso o meetup já aconteceu, não pode alterar nad
    if (meetup.past) {
      return res.status(401).json({ error: 'Meetup already happened' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }
}

export default new MeetupController();
