import { group, print} from "./anagram";

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

