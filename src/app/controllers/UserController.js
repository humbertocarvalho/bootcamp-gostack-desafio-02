import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    // Validação se o corpo da requisição está no formato correto
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .matches(
          /^(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{7,30}$/
        )
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = User.findOne({ where: { email: req.body.email } });
    if (!userExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    return res.json({ message: 'Ok' });
  }
}

export default new UserController();
