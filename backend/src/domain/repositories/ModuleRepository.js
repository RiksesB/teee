/**
 * Interface: ModuleRepository
 * Define los métodos para gestionar módulos educativos
 */
export class ModuleRepository {
  async save(module) {
    throw new Error('Method not implemented');
  }

  async findById(moduleId) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async findByOrder(order) {
    throw new Error('Method not implemented');
  }

  async update(moduleId, updateData) {
    throw new Error('Method not implemented');
  }

  async delete(moduleId) {
    throw new Error('Method not implemented');
  }

  async findActiveModules() {
    throw new Error('Method not implemented');
  }

  async getModuleStatistics(moduleId) {
    throw new Error('Method not implemented');
  }
}