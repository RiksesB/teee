/**
 * Interface: UserRepository
 * Define los métodos para persistir y recuperar usuarios
 */
export class UserRepository {
  async save(user) {
    throw new Error('Method not implemented');
  }

  async findByPhoneNumber(phoneNumber) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async update(phoneNumber, updateData) {
    throw new Error('Method not implemented');
  }

  async delete(phoneNumber) {
    throw new Error('Method not implemented');
  }

  async findByCompletionStatus(isCompleted) {
    throw new Error('Method not implemented');
  }

  async getUserStatistics() {
    throw new Error('Method not implemented');
  }
}