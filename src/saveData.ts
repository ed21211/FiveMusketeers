import fs from 'fs';
import { getData, Timer } from './dataStore';

export const save = () => {
  const data = getData();
  const timerArray: Timer[] = [] as Timer[];
  const savedData = {
    users: data.users,
    quizzes: data.quizzes,
    tokens: data.tokens,
    sessions: data.sessions,
    sessionTimers: timerArray,
  };
  fs.writeFileSync('./database.json', JSON.stringify(savedData));
};

