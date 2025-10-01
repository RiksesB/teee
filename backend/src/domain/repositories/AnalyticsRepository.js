/**
 * Interface: AnalyticsRepository
 * Define los métodos para guardar y recuperar datos analíticos
 */
export class AnalyticsRepository {
  async saveUserSession(sessionData) {
    throw new Error('Method not implemented');
  }

  async saveQuizResponse(phoneNumber, moduleId, responses) {
    throw new Error('Method not implemented');
  }

  async saveSurveyResponse(phoneNumber, surveyResponses, moduleResults) {
    throw new Error('Method not implemented');
  }

  async getUserAnalytics(phoneNumber) {
    throw new Error('Method not implemented');
  }

  async getModuleAnalytics(moduleId) {
    throw new Error('Method not implemented');
  }

  async getGlobalAnalytics() {
    throw new Error('Method not implemented');
  }

  async getCompletionRates() {
    throw new Error('Method not implemented');
  }

  async getAverageScores() {
    throw new Error('Method not implemented');
  }

  async getSurveyResults() {
    throw new Error('Method not implemented');
  }

  async getUsageStatistics(startDate, endDate) {
    throw new Error('Method not implemented');
  }
}