/**
 * Entity: User
 * Representa un usuario del sistema que realiza el curso
 */
export class User {
  constructor({
    phoneNumber,
    createdAt = new Date(),
    lastInteraction = new Date(),
    completedModules = [],
    currentModule = 1,
    totalScore = 0,
    status = 'active'
  }) {
    this.phoneNumber = phoneNumber;
    this.createdAt = createdAt;
    this.lastInteraction = lastInteraction;
    this.completedModules = completedModules;
    this.currentModule = currentModule;
    this.totalScore = totalScore;
    this.status = status;
  }

  // Business logic methods
  updateLastInteraction() {
    this.lastInteraction = new Date();
  }

  completeModule(moduleResult) {
    this.completedModules.push(moduleResult);
    this.currentModule++;
    this.totalScore += moduleResult.score;
    this.updateLastInteraction();
  }

  hasCompletedCourse() {
    return this.completedModules.length >= 6;
  }

  getCurrentProgress() {
    return {
      completedModules: this.completedModules.length,
      totalModules: 6,
      percentage: (this.completedModules.length / 6) * 100,
      currentModule: this.currentModule
    };
  }

  getAverageScore() {
    if (this.completedModules.length === 0) return 0;
    const totalScore = this.completedModules.reduce((sum, module) => sum + module.percentage, 0);
    return totalScore / this.completedModules.length;
  }

  isValidPhoneNumber() {
    return this.phoneNumber && typeof this.phoneNumber === 'string' && this.phoneNumber.length > 0;
  }
}