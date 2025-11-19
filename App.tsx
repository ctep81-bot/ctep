import React, { useState, useEffect, useCallback } from 'react';
import { Difficulty, GameState, GameSession, Question } from './types';
import { generateQuestions } from './services/geminiService';
import Menu from './components/Menu';
import Game from './components/Game';
import GameOver from './components/GameOver';
import Loading from './components/Loading';

const INITIAL_LIVES = 3;
const BATCH_SIZE = 5;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [session, setSession] = useState<GameSession>({
    score: 0,
    currentQuestionIndex: 0,
    streak: 0,
    lives: INITIAL_LIVES,
    difficulty: Difficulty.MEDIUM,
    questions: [],
    userAnswers: []
  });
  
  // Queue to manage fetching questions in background
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = async (difficulty: Difficulty) => {
    setGameState(GameState.LOADING);
    setError(null);
    try {
      // Initial load: pass empty array for previous questions
      const questions = await generateQuestions(BATCH_SIZE, difficulty, []);
      setSession({
        score: 0,
        currentQuestionIndex: 0,
        streak: 0,
        lives: INITIAL_LIVES,
        difficulty,
        questions,
        userAnswers: []
      });
      setGameState(GameState.PLAYING);
    } catch (err) {
      console.error(err);
      setError("无法生成题目，请检查网络或稍后再试。");
      setGameState(GameState.MENU); // In a real app, show error modal
    }
  };

  const fetchMoreQuestions = useCallback(async () => {
    if (isLoadingQuestions) return;
    setIsLoadingQuestions(true);
    try {
      // Pass list of current question texts to avoid duplicates
      const existingTexts = session.questions.map(q => q.text);
      const newQuestions = await generateQuestions(BATCH_SIZE, session.difficulty, existingTexts);
      
      setSession(prev => ({
        ...prev,
        questions: [...prev.questions, ...newQuestions]
      }));
    } catch (err) {
      console.error("Background fetch failed", err);
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [session.difficulty, isLoadingQuestions, session.questions]);

  // Fetch more questions when getting close to the end
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
        const remainingQuestions = session.questions.length - session.currentQuestionIndex;
        if (remainingQuestions <= 2 && !isLoadingQuestions) {
            fetchMoreQuestions();
        }
    }
  }, [gameState, session.questions.length, session.currentQuestionIndex, fetchMoreQuestions, isLoadingQuestions]);

  const handleAnswer = (isCorrect: boolean, points: number) => {
    setSession(prev => {
      const newLives = isCorrect ? prev.lives : prev.lives - 1;
      
      return {
        ...prev,
        score: prev.score + points,
        streak: isCorrect ? prev.streak + 1 : 0,
        lives: newLives,
        userAnswers: [
            ...prev.userAnswers, 
            { questionId: prev.questions[prev.currentQuestionIndex].id, isCorrect }
        ]
      };
    });
  };

  const handleNextQuestion = () => {
    if (session.lives <= 0) {
        setGameState(GameState.GAME_OVER);
        return;
    }

    setSession(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
    }));
  };

  // Check for game over due to lives
  useEffect(() => {
      if (session.lives <= 0 && gameState === GameState.PLAYING) {
          // Note: We don't immediately go to Game Over screen, 
          // we wait for user to click "Next" on the Game screen to see the explanation of the failed question.
          // The logic is handled in handleNextQuestion.
      }
  }, [session.lives, gameState]);


  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100">
      {gameState === GameState.MENU && (
        <Menu onStart={startGame} />
      )}

      {gameState === GameState.LOADING && (
        <Loading />
      )}

      {gameState === GameState.PLAYING && (
        <Game 
          session={session} 
          onAnswer={handleAnswer}
          onGameOver={() => setGameState(GameState.GAME_OVER)}
          onNextQuestion={handleNextQuestion}
          isLoadingNext={isLoadingQuestions && (session.currentQuestionIndex >= session.questions.length - 1)}
        />
      )}

      {gameState === GameState.GAME_OVER && (
        <GameOver 
          session={session}
          onRestart={() => startGame(session.difficulty)}
          onHome={() => setGameState(GameState.MENU)}
        />
      )}

      {/* Simple Error Toast */}
      {error && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
              {error}
          </div>
      )}
    </div>
  );
};

export default App;