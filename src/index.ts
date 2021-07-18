import { groupByAnagram, stringify, readWordsOfSameLength } from "./anagram";

(async () => {
    const [filename] = process.argv.slice(2, 3);
    for await (const wordsOfSameLength of readWordsOfSameLength(filename)) {
        process.stdout.write(stringify(groupByAnagram(wordsOfSameLength)));
    }
})();
