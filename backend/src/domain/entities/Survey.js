/**
 * Entity: Survey
 * Representa una encuesta de satisfacción
 */
export class Survey {
  constructor({
    id,
    title,
    description,
    questions = [],
    isActive = true,
    createdAt = new Date()
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.questions = questions;
    this.isActive = isActive;
    this.createdAt = createdAt;
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

  isComplete(responses) {
    return responses.length === this.questions.length;
  }

  validate() {
    return this.id && this.title && this.questions.length > 0;
  }
}

/**
 * Entity: SurveyQuestion
 * Representa una pregunta de encuesta
 */
export class SurveyQuestion {
  constructor({
    id,
    surveyId,
    number,
    text,
    type = 'multiple_choice', // 'multiple_choice', 'rating', 'text', 'yes_no'
    options = [],
    isRequired = true,
    metadata = {}
  }) {
    this.id = id;
    this.surveyId = surveyId;
    this.number = number;
    this.text = text;
    this.type = type;
    this.options = options;
    this.isRequired = isRequired;
    this.metadata = metadata;
  }

  // Business logic methods
  validateResponse(response) {
    if (this.isRequired && (!response || response.trim() === '')) {
      return false;
    }

    switch (this.type) {
      case 'multiple_choice':
        return this.options.some(option => option.id === response);
      case 'rating':
        const rating = parseInt(response);
        return !isNaN(rating) && rating >= 1 && rating <= 5;
      case 'yes_no':
        return ['yes', 'no', 'si', 'no'].includes(response.toLowerCase());
      case 'text':
        return true;
      default:
        return false;
    }
  }

  formatForWhatsApp() {
    let message = `${this.text}\n\n`;
    
    if (this.type === 'multiple_choice') {
      this.options.forEach((option) => {
        message += `${option.text}\n`;
      });
    }
    
    return message;
  }

  createWhatsAppButtons() {
    if (this.type !== 'multiple_choice' || this.options.length > 3) {
      return null;
    }

    return this.options.map((option, index) => ({
      type: "reply",
      reply: {
        id: option.id,
        title: `Opción ${index + 1}`,
      },
    }));
  }
}