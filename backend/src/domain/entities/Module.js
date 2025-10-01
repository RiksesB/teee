/**
 * Entity: Module
 * Representa un módulo educativo del curso
 */
export class Module {
  constructor({
    id,
    title,
    description,
    videoUrl,
    questions = [],
    order,
    isActive = true
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.videoUrl = videoUrl;
    this.questions = questions;
    this.order = order;
    this.isActive = isActive;
  }

  // Business logic methods
  addQuestion(question) {
    this.questions.push(question);
  }

  getQuestionById(questionId) {
    return this.questions.find(q => q.id === questionId);
  }

  getTotalQuestions() {
    return this.questions.length;
  }

  isComplete(answers) {
    return answers.length === this.questions.length;
  }

  calculateScore(answers) {
    const correctAnswers = answers.filter((answer, index) => 
      this.questions[index].isCorrectAnswer(answer.selectedOption)
    );
    return {
      correct: correctAnswers.length,
      total: this.questions.length,
      percentage: (correctAnswers.length / this.questions.length) * 100
    };
  }

  validate() {
    return this.id && this.title && this.questions.length > 0;
  }
}