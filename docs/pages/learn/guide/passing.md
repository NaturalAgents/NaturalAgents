# Passing

Powerful workflows can be built when multiple macros are put together.

## Combining macro rules

Macros are combined using indents. This acts as a "waterfall". Consider the following macros

```
<generate macro 1>: write a 1000 word essay about dogs
    <generate macro 2>: summarize the essay, prioritize quality or quantity
```

This is a description of how inputs and outputs were handled

- `<generate macro 1>`

  - input: []
  - instruction: write a 1000 word essay about dogs
  - output: "essay from llm"

- `<generate macro 2>`
  - input: [write a 1000 word essay about dogs, "essay from lmm"]
  - instruction: summarize the essay, prioritize quality or quantity
  - output: "summarized essay"

`<generate macro 2>` uses the input and output of `<generate macro 1>` as context.
