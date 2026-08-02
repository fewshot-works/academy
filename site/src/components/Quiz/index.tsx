import type {ReactNode} from 'react';
import {useEffect, useState} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type QuizProps = {
  chapterId: string;
  questions: QuizQuestion[];
};

type StoredResult = {
  answers: number[];
  score: number;
};

function storageKey(chapterId: string): string {
  return `zta-quiz-${chapterId}`;
}

function isValidResult(value: unknown, questions: QuizQuestion[]): value is StoredResult {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  const {answers, score} = candidate;
  if (!Array.isArray(answers) || answers.length !== questions.length) {
    return false;
  }
  const answersValid = answers.every(
    (answer, i) => typeof answer === 'number' && answer >= 0 && answer < questions[i].options.length,
  );
  if (!answersValid) {
    return false;
  }
  return typeof score === 'number' && score >= 0 && score <= questions.length;
}

export default function Quiz({chapterId, questions}: QuizProps): ReactNode {
  const [answers, setAnswers] = useState<Array<number | null>>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey(chapterId));
    if (!stored) {
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (isValidResult(parsed, questions)) {
        setAnswers(parsed.answers);
        setScore(parsed.score);
        setSubmitted(true);
      }
    } catch {
      // Corrupted localStorage value, ignore and show a fresh quiz.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  function selectAnswer(questionIndex: number, optionIndex: number) {
    if (submitted) {
      return;
    }
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  }

  function submit() {
    const finalAnswers = answers.map((answer) => answer ?? -1);
    const finalScore = questions.reduce(
      (total, q, i) => total + (finalAnswers[i] === q.correctIndex ? 1 : 0),
      0,
    );
    localStorage.setItem(
      storageKey(chapterId),
      JSON.stringify({answers: finalAnswers, score: finalScore}),
    );
    setScore(finalScore);
    setSubmitted(true);
  }

  const allAnswered = answers.every((answer) => answer !== null);

  return (
    <div className={styles.quiz}>
      {submitted && (
        <p className={styles.score} role="status" aria-live="polite">
          You scored {score} / {questions.length}
        </p>
      )}
      {questions.map((q, qIndex) => {
        const picked = answers[qIndex];
        const isCorrect = submitted && picked === q.correctIndex;
        const isWrong = submitted && picked !== q.correctIndex;
        return (
          <fieldset key={qIndex} className={styles.question}>
            <legend className={styles.questionText}>
              {qIndex + 1}. {q.question}
            </legend>
            <div className={styles.options}>
              {q.options.map((option, optIndex) => {
                const isPicked = picked === optIndex;
                const isRightAnswer = submitted && optIndex === q.correctIndex;
                return (
                  <label
                    key={optIndex}
                    className={clsx(styles.option, {
                      [styles.optionCorrect]: submitted && isRightAnswer,
                      [styles.optionWrong]: submitted && isPicked && !isRightAnswer,
                    })}
                  >
                    <input
                      type="radio"
                      name={`${chapterId}-q${qIndex}`}
                      checked={isPicked}
                      disabled={submitted}
                      onChange={() => selectAnswer(qIndex, optIndex)}
                    />
                    {option}
                  </label>
                );
              })}
            </div>
            {isCorrect && (
              <p className={styles.feedbackCorrect} role="status">
                Correct!
              </p>
            )}
            {isWrong && (
              <p className={styles.feedbackWrong} role="status">
                Not quite. The right answer is "{q.options[q.correctIndex]}." {q.explanation}
              </p>
            )}
          </fieldset>
        );
      })}
      {!submitted && (
        <button
          type="button"
          className={styles.submit}
          onClick={submit}
          disabled={!allAnswered}
        >
          Submit
        </button>
      )}
    </div>
  );
}
