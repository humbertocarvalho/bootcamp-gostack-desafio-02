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

    const registrationExists = await Registration.findAll({
      where: {
        meetup_id: meetupId,
        participant_id: req.userId,
      },
    });

    if (registrationExists) {
      return res
        .status(401)
        .json({ error: 'User already registered to this event.' });
    }

    const registration = await Registration.create({
      meetup_id: meetupId,
      participant_id: req.userId,
    });

    return res.json(registration);
  }
}

export default new RegistrationController();
