import React, { useState } from 'react';
import { Home } from 'lucide-react';
import QuizMenu from './QuizMenu';
import PostpartumQuizPart1 from './PostpartumQuizPart1';
import PostpartumQuizPart2 from './PostpartumQuizPart2';

const PostpartumQuizApp = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Back to Menu button component
  const BackToMenu = () => (
    <button
      onClick={() => setSelectedQuiz(null)}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
    >
      <Home className="w-5 h-5" />
      Back to Menu
    </button>
  );

  // Render based on selection
  if (selectedQuiz === 'part1') {
    return (
      <div>
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <BackToMenu />
        </div>
        <PostpartumQuizPart1 />
      </div>
    );
  } else if (selectedQuiz === 'part2') {
    return (
      <div>
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <BackToMenu />
        </div>
        <PostpartumQuizPart2 />
      </div>
    );
  } else {
    return <QuizMenu onSelectQuiz={setSelectedQuiz} />;
  }
};

export default PostpartumQuizApp;
