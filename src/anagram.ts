const sortWord = (word: string) => word.split('').sort().join('')

export const group = (words: Array<string>) =>
  words.reduce((acc: Record<string, Array<string>>, word) => {
    const sortedWord = sortWord(word);
    return {
      ...acc,
      [sortedWord]: [...(acc[sortedWord] ?? []), word]
    };
  }, {});

export const print = (groupedWords: Record<string, Array<string>>) =>
  Object.entries(groupedWords).reduce((acc: string, [_k, words]) => acc + words.join() + "\n", '')