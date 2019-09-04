import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registration } = data;

    await Mail.sendMail({
      to: `${registration.meetup.host.name} <${registration.meetup.host.email}>`,
      subject: 'Mais um inscrito confirmado!',
      template: 'registration',
      context: {
        host: registration.meetup.host.name,
        participant: registration.participant.name,
      },
    });
  }
}

export default new RegistrationMail();
