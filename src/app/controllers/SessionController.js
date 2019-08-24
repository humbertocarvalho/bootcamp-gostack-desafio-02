class SessionController {
  async store(req, res) {
    return res.json({ message: 'Ok funcionou' });
  }
}

export default new SessionController();
