import React from 'react';
import { BookOpen } from 'lucide-react';

const QuizMenu = ({ onSelectQuiz }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold mb-2">Postpartum & Newborn Care NCLEX Quiz</h1>
            <p className="text-gray-600">Comprehensive practice with 200 NCLEX-style questions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Part 1 Card */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                 onClick={() => onSelectQuiz('part1')}>
              <div className="text-center">
                <div className="bg-blue-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h2 className="text-xl font-bold mb-2">Part 1: Fundamentals</h2>
                <p className="text-gray-700 mb-4">100 questions covering core concepts</p>
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Start Part 1
                </button>
              </div>
            </div>

            {/* Part 2 Card */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                 onClick={() => onSelectQuiz('part2')}>
              <div className="text-center">
                <div className="bg-purple-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h2 className="text-xl font-bold mb-2">Part 2: Advanced Practice</h2>
                <p className="text-gray-700 mb-4">100 questions with complex scenarios</p>
                <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Start Part 2
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizMenu;

