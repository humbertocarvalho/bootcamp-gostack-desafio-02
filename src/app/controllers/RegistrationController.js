import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import Registration from '../models/Registration';
import User from '../models/User';
import File from '../models/File';

import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';

class RegistrationController {
  async index(req, res) {
    let registrations = await Registration.findAll({
      where: {
        participant_id: req.userId,
      },
      attributes: ['id', 'meetup_id', 'participant_id'],
      include: [
        {
          model: Meetup,
          as: 'meetup',
          attributes: [
            'id',
            'title',
            'description',
            'location',
            'date',
            'past',
          ],
          order: ['date'],
          include: [
            { model: User, as: 'host', attributes: ['id', 'name', 'email'] },
            { model: File, as: 'banner', attributes: ['id', 'path', 'url'] },
          ],
        },
      ],
    });

    registrations = registrations.filter(registration => {
      return !registration.meetup.past;
    });

    return res.json(registrations);
  }

  async store(req, res) {
    const { meetupId } = req.params;

    const meetup = await Meetup.findByPk(meetupId);

    if (!meetup) {
      return res
        .status(401)
        .json({ error: `Meetup ${meetupId} não encontrado.` });
    }

    // Caso o meetup já aconteceu, não pode alterar nem cancelar o mesmo
    if (meetup.past) {
      return res.status(401).json({ error: 'Meetup já aconteceu' });
    }

    // Quem está hosteando o evento não pode se inscrever
    if (meetup.host_id === req.userId) {
      return res.status(401).json({
        error: 'Usuários não podem se registrar para meetups que organizam!',
      });
    }

    const alreadyRegistered = await Registration.count({
      where: {
        meetup_id: meetupId,
        participant_id: req.userId,
      },
    });

    if (alreadyRegistered) {
      return res
        .status(401)
        .json({ error: 'Usuário já registrado para esse meetup.' });
    }

    // Return if user have been already register to a meetup, that is happening in the same time
    const registrations = await Registration.count({
      where: {
        meetup_id: {
          [Op.ne]: meetupId,
        },
        participant_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          attributes: ['id', 'date'],
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (registrations) {
      return res.status(401).json({
        error: 'Usuário já registrado em um evento ',
      });
    }

    const registration = await Registration.create({
      meetup_id: meetupId,
      participant_id: req.userId,
    });

    const registrationComplete = await Registration.findByPk(registration.id, {
      include: [
        {
          model: User,
          as: 'participant',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Meetup,
          as: 'meetup',
          attributes: ['id', 'date'],
          include: [
            {
              model: User,
              as: 'host',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    await Queue.add(RegistrationMail.key, {
      registration: registrationComplete,
    });

    return res.json(registration);
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    await registration.destroy();

    return res.send();
  }
}

export default new RegistrationController();
