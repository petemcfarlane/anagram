import { groupByAnagram, stringify, readWordsOfSameLength, sortWord } from "./anagram";

test("sorting a string of letters alphabetically", () => {
  expect(sortWord("cba")).toEqual("abc");
  expect(sortWord("acb")).toEqual("abc");
  expect(sortWord("abc")).toEqual("abc");
})

test("groups words by their characters, sorted (anagram)", () => {
  const words = ['abc', 'foo', 'bca', 'oof', 'cba'];

  expect(groupByAnagram(words)).toStrictEqual({
    'abc': ['abc', 'bca', 'cba'],
    'foo': ['foo', 'oof']
  });
});

test("outputs grouped words, joined by a comma, groups separated by new line", () => {
  const groupedWords = {
    'abc': ['abc', 'bca', 'cba'],
    'foo': ['foo', 'oof']
  };

  expect(stringify(groupedWords)).toStrictEqual(`abc,bca,cba
foo,oof
`);
});

test("reads then yields lines of same length as an array", async () => {
  const wordsOfSameLength = readWordsOfSameLength('./Data/example3.txt');
  const groupedWords = [];
  for await (const words of wordsOfSameLength) {
    groupedWords.push(words);
  }
  expect(groupedWords).toEqual([
    ['of', 'ab', 'fo'],
    ['dog', 'god', 'fod'],
    ['food', 'good', 'oodf'],
  ])
});
