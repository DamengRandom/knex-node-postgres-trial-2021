const personService = require('../service/person');

class PersonController {
  async createPerson(req, res) {
    try {
      const id = await personService.createPerson(req.body);
      res.status(201).json(id);
    } catch (error) {
      console.error(error);
      res.status(500).json('Oops, cannot create a new person data record, please try again later ..');
    }
  }
}

module.exports = new PersonController();
