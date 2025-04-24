import UserDTO from '../dtos/UserDTO.js';

export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getById(id) {
    const user = await this.dao.getById(id);
    return new UserDTO(user);
  }
}
