import fs from 'fs';
import readline from 'readline';

export const sortWord = (word: string): string =>
  Array.from(word)
    .sort((a, b) => a.localeCompare(b))
    .join('');

export const groupByAnagram = (words: Array<string>): Record<string, string[]> =>
  words.reduce((acc: Record<string, Array<string>>, word) => {
    const sortedWord = sortWord(word);
    if (acc.hasOwnProperty(sortedWord)) {
      acc[sortedWord].push(word);
    } else {
      acc[sortedWord] = [word];
    }
    return acc;
  }, {});

export const stringify = (groupedWords: Record<string, Array<string>>): string =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(groupedWords).reduce((acc: string, [_k, words]) => acc + words.join() + '\n', '');

export async function* readWordsOfSameLength(path: string): AsyncGenerator<string[], void, unknown> {
  const input = fs.createReadStream(path);
  const rl = readline.createInterface({ input });

  let wordsOfSameLength: Array<string> = [];
  let currentLength: number | undefined;

  for await (const line of rl) {
    const wordLength = line.length;
    if (typeof currentLength === 'undefined') {
      currentLength = wordLength;
    }

    if (currentLength === wordLength) {
      wordsOfSameLength.push(line);
    }

    if (wordLength > currentLength) {
      const wordsToYield = wordsOfSameLength;
      wordsOfSameLength = [line];
      currentLength = wordLength;
      yield wordsToYield;
    }
  }
  yield wordsOfSameLength;
}
