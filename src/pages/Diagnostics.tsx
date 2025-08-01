import { useLocation, useNavigate } from "react-router-dom";
import { DiagnosticsView } from "@/components/DiagnosticsView";

interface Question {
  id: number;
  question: string;
  choices: string[];
  correctAnswer: number;
  userAnswer: number | null;
  explanation: string;
  domain: string;
}

export default function Diagnostics() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions = [] } = location.state || {};

  const handleRetryIncorrect = () => {
    // Get incorrect questions and start a new practice session
    const incorrectQuestions = questions.filter((q: Question) => q.userAnswer !== q.correctAnswer);
    
    if (incorrectQuestions.length > 0) {
      navigate('/practice', {
        state: {
          questionCount: incorrectQuestions.length,
          retryMode: true,
          incorrectQuestions
        }
      });
    }
  };

  const handleMorePractice = () => {
    navigate('/practice');
  };

  // If no questions data, redirect to practice
  if (!questions || questions.length === 0) {
    navigate('/practice');
    return null;
  }

  return (
    <DiagnosticsView 
      questions={questions}
      onRetryIncorrected={handleRetryIncorrect}
      onMorePractice={handleMorePractice}
    />
  );
}