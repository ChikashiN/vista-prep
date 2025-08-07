import { QuestionImporter } from '@/components/QuestionImporter';
import { Header } from '@/components/Header';

export default function ImportQuestions() {
  return (
    <div className="min-h-screen bg-background">
      <Header streak={5} totalScore={1250} currentXP={250} level={3} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Import Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Import your Google Docs questions into the database
          </p>
        </div>

        <QuestionImporter />
      </main>
    </div>
  );
} 