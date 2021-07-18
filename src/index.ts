import { group, stringify, readWordsOfSameLength } from "./anagram";

(async () => {
    const [filename] = process.argv.slice(2, 3);
    for await (const words of readWordsOfSameLength(filename)) {
        process.stdout.write(stringify(group(words)));
    }
})();
