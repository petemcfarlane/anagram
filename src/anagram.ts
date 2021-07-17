import fs from 'fs';
import readline from 'readline';

const sortWord = (word: string) => word.split('').sort().join('')

export async function readWordsOfSameLength(path: string) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(path).on('error', reject);
    const rl = readline.createInterface({ input });

    let wordsOfSameLength: Array<string> = [];
    let currentLength: number;

    const listener = (line: string) => {
      const wordLength = line.length;

      if (typeof currentLength === 'undefined') {
        console.log('undef');
        currentLength = wordLength
        wordsOfSameLength.push(line);
        return;
      }

      if (currentLength === wordLength) {
        console.log('same');

        wordsOfSameLength.push(line);
        return;
      }

      if (currentLength < wordLength) {
        console.log('lessthan');
        resolve(wordsOfSameLength);
        rl.close();
        rl.removeListener('line', listener);
      }
    }

    rl.addListener('line', listener);
  });

}

export const group = (words: Array<string>) =>
  words.reduce((acc: Record<string, Array<string>>, word) => {
    const sortedWord = sortWord(word);
    return {
      ...acc,
      [sortedWord]: [...(acc[sortedWord] ?? []), word]
    };
  }, {});

export const print = (groupedWords: Record<string, Array<string>>) =>
  Object.entries(groupedWords).reduce((acc: string, [_k, words]) => acc + words.join() + "\n", '');
