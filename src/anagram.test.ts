import { group, print, readWordsOfSameLength } from "./anagram";

test("groups words by their sorted characters (anagram)", () => {
  const words = ['abc', 'foo', 'bca', 'oof', 'cba'];

  expect(group(words)).toStrictEqual({
    'abc': ['abc', 'bca', 'cba'],
    'foo': ['foo', 'oof']
  });
});

test("outputting grouped words, joined by a comma", () => {
  const groupedWords = {
    'abc': ['abc', 'bca', 'cba'],
    'foo': ['foo', 'oof']
  };

  expect(print(groupedWords)).toStrictEqual(`abc,bca,cba
foo,oof
`);
});

test("reads lines from file input, until reaches longer length line", async () => {
  const wordsOfSameLength = await readWordsOfSameLength('./Data/example1.txt');
  expect(wordsOfSameLength).toEqual(['abc', 'fun', 'bac', 'fun', 'cba', 'unf']);
});
