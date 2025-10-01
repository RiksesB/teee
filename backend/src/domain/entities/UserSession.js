/**
 * Entity: UserSession
 * Representa una sesión activa de un usuario
 */
export class UserSession {
  constructor({
    phoneNumber,
    state = 'idle',
    currentModule = 1,
    currentQuestion = 0,
    answers = [],
    startedAt = new Date(),
    lastActivity = new Date(),
    moduleResults = [],
    surveyResponses = [],
    metadata = {}
  }) {
    this.phoneNumber = phoneNumber;
    this.state = state; // 'idle', 'watching_video', 'answering_quiz', 'in_survey', 'completed'
    this.currentModule = currentModule;
    this.currentQuestion = currentQuestion;
    this.answers = answers;
    this.startedAt = startedAt;
    this.lastActivity = lastActivity;
    this.moduleResults = moduleResults;
    this.surveyResponses = surveyResponses;
    this.metadata = metadata;
  }

  // Business logic methods
  updateActivity() {
    this.lastActivity = new Date();
  }

  setState(newState) {
    this.state = newState;
    this.updateActivity();
  }

  addAnswer(questionNumber, selectedOption, isCorrect) {
    const answer = {
      questionNumber,
      selectedOption,
      isCorrect,
      answeredAt: new Date()
    };
    
    this.answers.push(answer);
    this.updateActivity();
    
    return answer;
  }

  completeModule(moduleResult) {
    this.moduleResults.push(moduleResult);
    this.currentModule++;
    this.currentQuestion = 0;
    this.answers = []; // Reset answers for next module
    this.updateActivity();
  }

  nextQuestion() {
    this.currentQuestion++;
    this.updateActivity();
  }

  addSurveyResponse(questionId, response) {
    this.surveyResponses.push({
      questionId,
      response,
      answeredAt: new Date()
    });
    this.updateActivity();
  }

  getCurrentModuleScore() {
    const correctAnswers = this.answers.filter(answer => answer.isCorrect).length;
    return {
      correct: correctAnswers,
      total: this.answers.length,
      percentage: this.answers.length > 0 ? (correctAnswers / this.answers.length) * 100 : 0
    };
  }

  isExpired(timeoutMinutes = 30) {
    const now = new Date();
    const diffMinutes = (now - this.lastActivity) / (1000 * 60);
    return diffMinutes > timeoutMinutes;
  }

  hasCompletedAllModules() {
    return this.moduleResults.length >= 6;
  }

  getTotalScore() {
    if (this.moduleResults.length === 0) return 0;
    
    const totalScore = this.moduleResults.reduce((sum, result) => sum + result.percentage, 0);
    return totalScore / this.moduleResults.length;
  }

  generateProgressSummary() {
    return {
      phoneNumber: this.phoneNumber,
      completedModules: this.moduleResults.length,
      totalModules: 6,
      currentModule: this.currentModule,
      averageScore: this.getTotalScore(),
      state: this.state,
      startedAt: this.startedAt,
      lastActivity: this.lastActivity,
      results: this.moduleResults.map(result => ({
        module: result.module,
        score: result.percentage,
        completedAt: result.completedAt
      }))
    };
  }

  reset() {
    this.state = 'idle';
    this.currentModule = 1;
    this.currentQuestion = 0;
    this.answers = [];
    this.moduleResults = [];
    this.surveyResponses = [];
    this.updateActivity();
  }
}