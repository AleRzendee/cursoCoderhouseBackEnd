import UserDAO from './UserDAO.js';

export default class FactoryDAO {
  static getUserDAO() {
    return new UserDAO();
  }
}
