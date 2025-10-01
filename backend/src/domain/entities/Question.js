/**
 * Entity: Question
 * Representa una pregunta dentro de un módulo
 */
export class Question {
  constructor({
    id,
    moduleId,
    number,
    text,
    options = [],
    correctAnswer,
    feedback = {},
    difficulty = 'medium',
    category = 'general'
  }) {
    this.id = id;
    this.moduleId = moduleId;
    this.number = number;
    this.text = text;
    this.options = options; // Array de strings ['a) option1', 'b) option2', 'c) option3']
    this.correctAnswer = correctAnswer; // 'A', 'B', 'C'
    this.feedback = feedback; // {A: 'feedback for A', B: 'feedback for B', C: 'feedback for C'}
    this.difficulty = difficulty;
    this.category = category;
  }

  // Business logic methods
  isCorrectAnswer(selectedOption) {
    return selectedOption.toUpperCase() === this.correctAnswer.toUpperCase();
  }

  getFeedback(selectedOption) {
    return this.feedback[selectedOption.toUpperCase()] || 'No hay retroalimentación disponible.';
  }

  getOptionLetter(index) {
    return String.fromCharCode(65 + index); // A, B, C, D...
  }

  validateStructure() {
    return (
      this.id &&
      this.text &&
      this.options.length >= 2 &&
      this.correctAnswer &&
      this.options.length <= 4
    );
  }

  formatForWhatsApp() {
    let message = `🟡 Pregunta ${this.number}:\n${this.text}\n\n`;
    
    this.options.forEach((option) => {
      message += `${option}\n`;
    });
    
    message += `\n💡 Selecciona tu respuesta:`;
    
    return message;
  }

  createWhatsAppButtons() {
    return this.options.map((_, index) => ({
      type: "reply",
      reply: {
        id: `respuesta_${this.getOptionLetter(index).toLowerCase()}_${this.number}`,
        title: this.getOptionLetter(index),
      },
    }));
  }
}