import { isBefore, parseISO } from 'date-fns';
import * as Yup from 'yup';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async show(req, res) {
    const { id } = req.params;
    const meetup = await Meetup.findByPk(id, {
      include: [
        { model: User, as: 'host', attributes: ['id', 'name', 'email'] },
        { model: File, as: 'banner', attributes: ['id', 'path', 'url'] },
      ],
    });

    return res.json(meetup);
  }

  async index(req, res) {
    const page = req.query.page || 1;
    const amountPerPage = 10;

    const meetups = await Meetup.findAndCountAll({
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

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Verifique os campos enviados!' });
    }

    const { title, description, location, date, banner_id } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res
        .status(401)
        .json({ error: 'Datas passadas não são permitidas.' });
    }

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      banner_id,
      host_id: req.userId,
    });
    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Verifique os campos enviados!' });
    }
    const { id } = req.params;

    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      return res
        .status(401)
        .json({ error: `Meetup ${id} não foi encontrado.` });
    }

    // Caso o usuário não seja o dono do Meetup, não irá permitir alterar
    if (meetup.host_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Somente o organizador do Meetup pode alterar..' });
    }

    const { date } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res
        .status(401)
        .json({ error: 'Datas passadas não são permitidas.' });
    }

    // Caso o meetup já aconteceu, não pode alterar nad
    if (meetup.past) {
      return res.status(401).json({ error: 'Meetup já aconteceu!' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const { id } = req.params;

    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      return res.status(401).json({ error: `Meetup ${id} não encontrado` });
    }

    // Caso o meetup já aconteceu, não pode alterar nem cancelar o mesmo
    if (meetup.past) {
      return res.status(401).json({ error: 'Meetup já aconteceu!' });
    }

    await meetup.destroy();

    return res.json({ message: `O meetup ${id} foi deletado com sucesso` });
  }
}

export default new MeetupController();
