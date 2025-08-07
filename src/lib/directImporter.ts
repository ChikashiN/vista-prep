import { supabase } from './supabase';

export interface ParsedQuestion {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  passage: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
}

export class DirectImporter {
  static async importFromYourFormat(
    text: string,
    domainName: string,
    subunitName: string
  ): Promise<{ success: number; errors: string[] }> {
    const questions = this.parseQuestions(text);
    return this.importToSupabase(questions, domainName, subunitName);
  }

  private static parseQuestions(text: string): ParsedQuestion[] {
    const questions: ParsedQuestion[] = [];
    const lines = text.split('\n');
    
    let currentDifficulty: 'Easy' | 'Medium' | 'Hard' ;
    let currentBlock = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for difficulty headers
      if (line === 'Easy:' || line === 'Medium:' || line === 'Hard:') {
        currentDifficulty = line.replace(':', '') as 'Easy' | 'Medium' | 'Hard';
        continue;
      }
      
      // Check for question start (Q1, Q2, etc.)
      if (line.match(/^Q\d+:/)) {
        // If we have a previous block, parse it
        if (currentBlock.trim()) {
          const question = this.parseQuestionBlock(currentBlock, currentDifficulty);
          if (question) {
            questions.push(question);
          }
        }
        // Start new block
        currentBlock = line + '\n';
      } else {
        // Add line to current block
        currentBlock += line + '\n';
      }
    }
    
    // Parse the last block
    if (currentBlock.trim()) {
      const question = this.parseQuestionBlock(currentBlock, currentDifficulty);
      if (question) {
        questions.push(question);
      }
    }
    
    return questions;
  }

  private static parseQuestionBlock(block: string, difficulty: 'Easy' | 'Medium' | 'Hard'): ParsedQuestion | null {
    const lines = block.split('\n').filter(line => line.trim());
    if (lines.length < 8) return null; // Need at least question, choices, answer, explanation
    
    let passage = '';
    let question = '';
    let choices: string[] = [];
    let correctAnswer = '';
    let explanation = '';
    
    let i = 0;
    
    // Skip question number (Q1:, Q2:, etc.)
    if (lines[i].match(/^Q\d+:/)) {
      i++;
    }
    
    // First non-empty line is usually the passage
    if (i < lines.length && lines[i].trim() && !lines[i].includes('Choose 1 answer:')) {
      passage = lines[i].trim();
      i++;
    }
    
    // Find the question (before "Choose 1 answer:")
    while (i < lines.length && !lines[i].includes('Choose 1 answer:')) {
      if (lines[i].trim()) {
        question += (question ? ' ' : '') + lines[i].trim();
      }
      i++;
    }
    
    // Skip "Choose 1 answer:"
    if (i < lines.length && lines[i].includes('Choose 1 answer:')) {
      i++;
    }
    
    // Parse choices (A, B, C, D)
    while (i < lines.length && (lines[i].startsWith('A.') || lines[i].startsWith('B.') || lines[i].startsWith('C.') || lines[i].startsWith('D.'))) {
      choices.push(lines[i].trim());
      i++;
    }
    
    // Find correct answer
    while (i < lines.length && !lines[i].includes('Correct Answer:')) {
      i++;
    }
    if (i < lines.length && lines[i].includes('Correct Answer:')) {
      correctAnswer = lines[i].split('Correct Answer:')[1].trim();
      i++;
    }
    
    // Find explanation
    while (i < lines.length && !lines[i].includes('Explanation:')) {
      i++;
    }
    if (i < lines.length && lines[i].includes('Explanation:')) {
      explanation = lines[i].split('Explanation:')[1].trim();
      i++;
      
      // Continue reading explanation if it spans multiple lines
      while (i < lines.length && lines[i].trim() && !lines[i].match(/^[A-D]\./)) {
        explanation += ' ' + lines[i].trim();
        i++;
      }
    }
    
    if (!question || choices.length === 0 || !correctAnswer) {
      return null;
    }
    
    return {
      difficulty,
      passage: passage || 'No passage provided',
      question: question.trim(),
      choices,
      correctAnswer: correctAnswer.trim(),
      explanation: explanation.trim()
    };
  }

  private static async importToSupabase(
    questions: ParsedQuestion[],
    domainName: string,
    subunitName: string
  ): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let successCount = 0;
    
    // Get domain and subunit IDs
    const { data: domainData, error: domainError } = await supabase
      .from('domains')
      .select('id')
      .eq('name', domainName)
      .single();
    
    if (domainError || !domainData) {
      errors.push(`Domain "${domainName}" not found`);
      return { success: 0, errors };
    }
    
    const { data: subunitData, error: subunitError } = await supabase
      .from('subunits')
      .select('id')
      .eq('name', subunitName)
      .eq('domain_id', domainData.id)
      .single();
    
    if (subunitError || !subunitData) {
      errors.push(`Subunit "${subunitName}" not found in domain "${domainName}"`);
      return { success: 0, errors };
    }
    
    // Import each question
    for (const question of questions) {
      try {
        // Convert answer letter to index (A=0, B=1, C=2, D=3)
        const answerIndex = question.correctAnswer.charCodeAt(0) - 65; // A=65 in ASCII
        
        const { error } = await supabase
          .from('questions')
          .insert({
            domain_id: domainData.id,
            subunit_id: subunitData.id,
            difficulty: question.difficulty.toLowerCase(),
            passage: question.passage,
            question: question.question,
            choices: question.choices,
            correct_answer: answerIndex,
            explanation: question.explanation
          });
        
        if (error) {
          errors.push(`Failed to import question: ${error.message}`);
        } else {
          successCount++;
        }
      } catch (err) {
        errors.push(`Error importing question: ${err}`);
      }
    }
    
    return { success: successCount, errors };
  }
} 