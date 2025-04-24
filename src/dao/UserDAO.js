export default class UserDAO {
  async getById(id) {
    return { _id: id, name: 'Test User', email: 'user@example.com', role: 'user' };
  }
}
