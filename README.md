# Anagram Assignment Technical Challenge
## [📧Pete McFarlane](mailto:pete.mcfarlane@icloud.com)

I chose to write this anagram parser in [TypeScript](https://www.typescriptlang.org), the popular, typed language which compiles down to JavaScript. JavaScript is ubiquitous, it is a very useful tool for many applications - it is rapid to prototype with, available in a multitude of environments and near infinitely scalable with the power of cloud computing. TypeScript offers an extra layer of helpful static typing on top of JavaScript, which is helpful for development, for debugging and reducing unexpected run-time errors.

The CLI application can be executed on any environment that has NodeJS installed. I've also included a `Dockerfile` so it can also be built and ran in an environment without installing NodeJS, provided it can build and run a container.
## How to run
If you have NodeJS available on your environment:
- First install dependencies with
```
npm install
```

- Then compile the TypeScript to regular javascript
```
npm run build
```

- Then run the CLI application
```
npm start <path_to_file>
```

## Run without NodeJS (with Docker)
- Build the container
```
docker build -t anagram .
```

- Run the container
```
docker run anagram <path_to_file>
```
where `path_to_file` is a file that is relative to the current directory. By default, any example file in the `./Data` directory will be copied to the container. You may mount a different volume at run time should you wish, e.g.
```
docker run -v $(pwd)/other_dir:/usr/src/app/Data anagram other_dir/example_file.txt
```

## Performance/Big O analysis
I did come across some performance issues when running on large files with my initial prototype. My original `groupByAnagram()` function looked like this:
```ts
words.reduce((acc: Record<string, Array<string>>, word) => {
  const sortedWord = sortWord(word);
  return {
    ...acc,
    [sortedWord]: [...(acc[sortedWord] ?? []), word]
  }
}, {});
```
but when I tested this on a relatively large input file it was plain to see that the performance was terrible, even for just a few hundred words. By debugging the application I was able to pin it down to this spread operator in the `reduce` call. I found [several](https://prateeksurana.me/blog/why-using-object-spread-with-reduce-bad-idea/) [references](https://twitter.com/fildon_dev/status/1396252890721918979?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1396252890721918979%7Ctwgr%5E%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fprateeksurana.me%2Fblog%2Fwhy-using-object-spread-with-reduce-bad-idea%2F) [online](https://stackoverflow.com/questions/55843097/does-spread-operator-affect-performance) that helped me work out that using spread (`...`) inside a `reduce` operation leads to O(n<sup>2</sup>) performance, which is not ideal especially for working with large data sets. This is because every time we iterate through the `words` we have to create a new object, and then copy each of the existing properties from the previous object.


## Data structures

The assignment said to assume we could fit all words of the same length into memory at once, and all the words would be in increasing length in the input file. This was necessary for working out which words are anagrams.
The definition of an anagram is two words which share the same letters, and the simplest way to compare two words if they have the same letters is to sort the words by characters and compare the strings are equal. In pseudo code:
```
word1 = "dog"
word2 = "god"

word1Sorted = "dgo"
word2Sorted = "dgo"

as word1Sorted = word2Sorted we have an anagram
```

In our case, we are hunting for anagrams of multiple words. For this reason I chose to use an array to list all the words which are anagrams of each other, and to use the sorted word as a key for an object.
```
anagrams stored as an array, keyed by their sorted characters
{
    "dgo": ["dog", "god", ...],
    ...
}
In TypeScript, this structure can be represented by a
```
```typescript
Record<string, Array<string>>
```
Once I had this shape, I wrote a test and then a function to `stringify` this structure.

Now, to handle the input stream. I used the standard library `readline` and `fs` to iterate over each line in a file. If the lines were the same length as the previous line, I appended this to a buffer array of `wordsOfTheSameLength: Array<string>`. As soon as I hit a line that was a different length, I was able to `yield` or flush the current buffer to the consumer in the form of an `async iterator` (or generator) and start consuming lines (/words) again. This also meant that the garbage collector could free memory after each iteration of words of the same length - we don't have to read the entire file/stream into memory all at once. When we get to the end of the file I just yield whatever is remaining in the buffer as the final value.

I then created a separate `src/index.ts` file which contains one function which acts as an entry-point and composes the smaller functions together. It parses the CLI arguments for a filename, then passes that to create a generator that we can then iterate over and pass the output of each group of `wordsOfTheSameLength` through the anagram function before printing to the `stdout`.
We wrap this in a simple try/catch and log any errors that might be thrown e.g. if the filename isn't set, or is passed a directory, or the file cannot be read.
## What you would do given more time
- Handling command line arguments, we could use [`yargs`](https://github.com/yargs/yargs) or alternative package, but as it's just a filename, this seemed the simplest approach.
- Experiment with performance of data structures - what if we always appended a string into the object, rather than just appending the word to an array, then later joining it together?
- Does the `readline` work just as well with a stream, rather than a file? What's needed to make this work?
- Option to change the destination of the anagrams - currently just prints to the `stdout`, but could pipe it to a file or another stream elsewhere?
- The order of the groups isn't necessarily determined because we're using a JavaScript object. If we need to preserve the order of the first words I think we could use a `Map` instead.
- What happens with words that aren't regular utf8 characters, how does it handle emoji and other scripts? 🤔

## Assumptions:
- Most of the errors are thrown when we try to read the filename, or open the file stream. I've tested this with not passing any args or passing a file that doesn't exist or isn't readable and I think the error message supplied from the standard library was useful enough to just send back to the CLI so I haven't added any extra behaviour around that. If it was used by someone less technical perhaps some extra feedback, examples or links to documentation would be useful.
- The Docker build copies the example files from the `Data` directory to the container. I assume any additional files that need to be run would be inside of there, but I've left a note above how to volume mount a different path if required.