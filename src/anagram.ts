import fs from 'fs';
import readline from 'readline';

const sortWord = (word: string) => Array.from(word).sort((a, b) => a.localeCompare(b)).join("");

export async function* readWordsOfSameLength(path: string) {
  const input = fs.createReadStream(path);
  const rl = readline.createInterface({ input });

  let wordsOfSameLength: Array<string> = [];
  let currentLength: number | undefined;

  for await (const line of rl) {
    const wordLength = line.length;
    if (typeof currentLength === 'undefined') {
      currentLength = wordLength
      wordsOfSameLength.push(line);
    } else if (currentLength === wordLength) {
      wordsOfSameLength.push(line);
    }

    if (currentLength < wordLength) {
      const wordsToSend = wordsOfSameLength;
      wordsOfSameLength = [line];
      currentLength = wordLength;
      yield wordsToSend;
    }
  }
  yield wordsOfSameLength;
}

export const group = (words: Array<string>) =>
  words.reduce((acc: Record<string, Array<string>>, word) => {
    const sortedWord = sortWord(word);
    if (acc.hasOwnProperty(sortedWord) ) {
      acc[sortedWord].push(word)
    } else {
      acc[sortedWord] = [word]
    }
    return acc;
  }, {});

export const print = (groupedWords: Record<string, Array<string>>) =>
  Object.entries(groupedWords)
    .reduce((acc: string, [_k, words]) => acc + words.join() + "\n", '');
