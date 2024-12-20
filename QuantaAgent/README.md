# About Quanta Agent 

Quanta Agent is a Python-based deamon that runs in the background and will monitor a file system folder for changes, notice files that have AI prompts in them, and then answer those prompts by inserting the answers directly into your project files in realtime. For example, you could go into one of your files and type these lines (below), and the answer (Paris) would `automagically` appear below the question itself, after a second or two! All you have to do is save the file, and the answer will then be saved into it a few seconds later. 

```txt
ok hal
What's the capital of France?
?
```

Note that the "ok hal" text is what designates that there's a question for the AI to answer. We call this the `ok hal` line, in the docs, but you can make it use any other string you want by setting the 'ok_hal' config property in the config.yaml file. Another good choice is simply the '>' because it's faster to type. Whatever `ok hal` string you use just needs to be something that will never appear on a line all by itself in any of your project files, of course.

If you're asking questions about the rest of your code base, or want to do refactoring on your project, you can still ask the question from within any file, but in that case when you use the `file(), folder(), or block()` syntax the Agent knows it's free to refactor any of your files to perform the changes you've requested by mentioning those files, folders, or Named Blocks. 

[Learn more about the 'file, folder, block' prompting syntax](https://github.com/Clay-Ferguson/quantizr/blob/main/docs/user-guide/index.md#using-the-coding-agent)


# Tool Features

This is a command line-only AI Agent Deamon. To run it you only need this folder (QuantaAgent), as well as the `common` folder that's adjacent to it, in the GitHub `quantizr` project. The rest of the folders in the Quantizr monorepo can be omitted. 

Quant Agent is a tool to automate querying AIs (LLMs) about your codebase, which can also automatically refactor your actual project files, from high level human language instructions of what changes you'd like to make. You can ask the tool anything about your project, ask for any kind of refactoring you'd like to do in your project, or even ask the tool to create entirely new projects all on it's own.

## Basic Capabilities/Features

* Answers questions about software projects
* Refactor files or entire projects 
* Answers questions specifically about named blocks, or specific files and folders of your code
* Create new Software Projects based on a description/prompt.
* Answers questions in your code by putting the answers directly in the code. See "Ok Hal" section, below.

# Project Summary

* Written 100% in Python
* Open Source Python (MIT License)
* Uses Python Langchain giving you flexibility in which LLM you use, including either locally hosted LLMs or Cloud AI Services.

*Note: Current codebase only includes OpenAI ChatGPT, and Anthropic Claud connectivity, but with Langchain it's easy to add support for the other Cloud AIs or Local LLMS.*

# Prompting Syntax

If you're a software developer and you want to be able to ask AI (like OpenAI's ChatGPT for example) questions about your code, this tool helps do that. This tool can also implement entire complex features in your code base, by updating existing entire files, or by updating only specific labeled `Named Blocks` to add code to specific locations in specific files as directed by you. 

The `Block Syntax` as well as `File and Folder Syntax` in the following document are describing features of Quanta, in the following link, but those syntaxes also apply to this Daemon Agent app, so read this for more info:

https://github.com/Clay-Ferguson/quantizr/blob/main/docs/user-guide/index.md#using-the-coding-agent


# To Run the App

    ./run_agent.sh

## Configuration

To use this tool, follow these steps:

1) Edit the `config.yaml` to make it point to a software project folder you want to analyze.
2) Put your `OpenAI API Key` in the `config.yaml` (or command line, or env var)
3) Create an empty `data` folder where your output files will go (also in `config.yaml`)
4) Run with `./run_agent.sh`

*Tip: When requesting project refactorings, it's best to be in a clean project version, so that if you don't like the changes the tool made to your code you can roll them back easily, using `git`.


# Comparison to other AI Coding Assistants

* Q: How does `Quanta Agent` compare to other `AI Coding Assistants` like Devin, Pythagora (GPT Pilot), and MetaGPT?
* A: `Quanta Agent` allows a more targeted and specific analysis on your software project than the other tools, which results in less API token consumption and therefore lowers Cloud API costs. This is because `Quanta Agent` will only be able to see the parts of your code that you're referencing in your prompt, and it will only try to make modifications in those areas of the code. So not only is `Quanta Agent` very cheap due to using fewer API tokens, but you will also get the best possible results from LLMs by keeping your prompts down to where they contain only the relevant parts of your codebase. That is, smaller shorter prompts always give the best results. 


# Background and Inspiration

There are other coding assistants like Github's Copilot for example, which let you ask arbitrary questions about your codebase, and those tools are very useful. However `Quanta Agent` lets you ask AI questions (i.e. build prompts) in a more flexible, targeted, specific, and repeatable way. `Quanta Agent` can solve more complex and difficult questions, in a repeatable way that doesn't require lots of developer time spent in building the same (or similar) prompts over and over again, by cutting and pasting code into prompts.

For example, let's say you have some SQL in your project and some Java Entity beans that go along with your database tables. You might want to alter or add SQL tables and/or automatically create the associated Java Entity beans. To get the tool to do this for you, in a way that "fits into" your specific application's architecture perfectly, you would want to create prompts that show examples of how you're doing each of these types of artifacts (the SQL and the Java), by wrapping an example in a `Named Block`, and then ask the AI to generate new code following that pattern. 

`Quanta Agent` helps you build these kinds of complex prompts, and keeps developers from having to construct these prompts manually, because you can simply surround the relevant pieces and parts of code related to a specific type of application artifact (like your Java Beans, your SQL, etc), and then write prompts that reference those sections by name. This is what `Named Blocks` are for.

Also since Quanta Agent is based on Langchain, it keeps you from being tied to or dependent upon any specific Cloud AI provider, and gives you the option to run local LLMs for it's use as well.


# Use Cases

## Code Generation

You can use `Named Blocks` to give specific examples of how your software project architecture does various different things, and then ask the AI to create new objects, code, features, SQL, or anything else that follows the examples from your own app, so it's much easier to get AI to generate code for you that's fine tuned just for your specific code base.

## Finding Bugs or Getting Recommendations

You can specify `Named Blocks` or entire files, in your prompt, and then ask the AI to simply make recommendations of improvements or find bugs.

## New Employee Training

If you annotate specific sections (or blocks) of your company's codebase with these kinds of named blocks, then you can write prompts that are constructed to ask questions about a set of `blocks` that will be super informative to new employees learning the codebase, and be able to get answers to questions about that code.

## Adding new Features or Refactoring Code

One very hard part about adding new features to most codebases is remembering all the different locations in the codebase that might need to be altered in order to get the new feature working. Because every app is a little bit different, a tool like this is really the only way to have prompts that are good enough to make complex changes, that would otherwise require a true AGI. 

For example, if you need to add a new feature, it might require a new Button on the GUI, new POJOs, new SQL, new API calls, etc. With a tool like `Quanta Agent` you can package up a prompt that grabs from all these various parts of a codebase to show the AI an example of how one feature is done, just including precisely only the relevant chunks of code, and then do a prompt like `"Using all the example code as your architectural example to follow, create a new feature that does ${feature_description}."` So the context for all the aforementioned example code would just be built using the code chunks from various snippets all around the codebase.

## Code Reviews

Developer teams can theoretically use a standard where (perhaps only temporarily) specific block names are required to be put in the code around all changes or specific types of changes. Then you can use AI to run various kinds of automated code reviews, security audits, code correctness audits; or even just get AI suggestions for improvement that specifically look at all the parts of the code involved in any bug fix or new feature that has been implemented and identified using `Named Blocks`.

# `Ok Hal` Feature

You can ask questions anywhere in your code using `ok hal...[prompt]...?` pattern. This is best demonstrated with a simple example. Let's say somewhere in your project files you have the following lines of text:

```txt
ok hal
Show in Python how to get current time and print it as a string.
?
```

Note that the `ok hal` is above the prompt and `?` is below the prompt. This is how the AI will find and answer the question in your code, by injecting the answer directly into the code below the question itself. Once you've saved the file you can click `Run HAL` button in the Coding Agent panel, and the AI will edit your file automatically and inject the answer directly below the question, so you'll end up with this:

```txt
-ok hal
Show in Python how to get current time and print it as a string.
?
import datetime

current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
print(current_time)
```

*Note that a dash was inserted in front of `ok hal` after the edit. This is so that once the answer is inserted if you accidentally run Hal again nothing will happen the second time.*

The prompt you put between `ok hal...?` can be as long as you want, with any number of lines of text. The Coding Agent will also understand what kind of file you're working in, and it will give appropriate answers. For example, if you're editing a Python file and ask for how to do something like `"Show me how to write to a text file`" the Agent will give you the correct anser for the Python language.


## `Ok Hal` For Refactoring

Read the above section `Ok Hal Feature` before reading this section. Once you understand the basic `Ok Hal` syntax you can optionally use this slightly more complex form of it which is specifically for `Refactoring` existing code blocks which works as follows: Instead of having your prompt be the only thing between the `ok hal` and the `?` you can use this new syntax (notice the `-` separating prompt from existing code) which simply adds in a line with a dash to break apart the designation of the prompt and the code you want refactored.

Before you run Hal:

```
ok hal
Show me how to iterate this array using 'forEach'
-
let array = ['a', 'b', 'c'];

for (let i = 0; i < array.length; i++) {
    console.log(array[i]);
}
?
```

After you run Hal:
```
-ok hal
Show me how to iterate this array using 'forEach'
-
let array = ['a', 'b', 'c'];

for (let i = 0; i < array.length; i++) {
    console.log(array[i]);
}
?
let array = ['a', 'b', 'c'];

array.forEach(function(element) {
    console.log(element);
});
```

## Why use the `ok hal` Feature

At first it may seem awkward that there are two or three new elements of syntax you have to remember to use this feature, and that might seem difficult compared to using other tools like `Microsoft/Github Copilot` which lets you hightlight blocks of text and then ask questions about the highlighted text, however in reality the `ok hal` approach in this app [arguably] has several benefits:

* By wrapping your existing code temporarily with `ok hal` and `?` and getting your ansers injected directly into the code in the location it belongs that actually saves steps and can be immediately DIFFed either using your code editor DIFF tool, or visually.

* Often your LLM instructions (prompt) is the same, or near same, as the documentation you'll be writing for new code so you can just leave it in place, where it already is in your code.

* Your focus never leaves the code you're working on. You never have to highlight code blocks, or click "accept" to inject them,because you can do all your editing right in place, and never have to deal with a chat window at all, just your code itself.

* However by far the most important reason this approach is good is that you're not locked into Microsoft's LLMs, or even any specific IDE either. We use LangChain so you can call into any LLM you want.

* This Agent is completely external to your IDE, so you can use it with any IDE.



