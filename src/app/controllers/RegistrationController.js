import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import Registration from '../models/Registration';

class RegistrationController {
  async store(req, res) {
    const { meetupId } = req.params;

    const meetup = await Meetup.findByPk(meetupId);

    if (!meetup) {
      return res.status(401).json({ error: `Meetup ${meetupId} not found.` });
    }

    // Caso o meetup já aconteceu, não pode alterar nem cancelar o mesmo
    if (meetup.past) {
      return res.status(401).json({ error: 'Meetup already happened' });
    }

    // Quem está hosteando o evento não pode se inscrever
    if (meetup.host_id === req.userId) {
      return res
        .status(401)
        .json({ error: "Users can't register for their own events" });
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
        .json({ error: 'User already registered to this event.' });
    }

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
        error: 'User have already registered to a event at the same date',
      });
    }

    const registration = await Registration.create({
      meetup_id: meetupId,
      participant_id: req.userId,
    });

    return res.json(registration);
  }
}

export default new RegistrationController();
