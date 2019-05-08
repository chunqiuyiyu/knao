# Knao 
[![Travis (.org)](https://img.shields.io/travis/chunqiuyiyu/knao.svg?style=flat-square)](https://travis-ci.org/chunqiuyiyu/knao)
> Place output of your previous command into the clipboard.

![Preview](/preview.gif)

# Installation
```bash
npm install -g knao
```

## Get started
1. Install Knao globally with npm or yarn.
2. Use `knao config` to configure your Unix shell, only support bash, zsh, and fish.
3. Run `knao` after executing some commands. 

That's all! If there is no error, previous command output has been copied to clipboard.

**Note: you should execute `knao config` when your Unix shell is changed.**

## Why
Some times, we need output of shell to share with other people or search on the Internet(Google, StackOverflow, GitHub and etc). You can use mouse Of course, but that way is slow and easy to make mistakes. With the help of Knao, I improve the efficiency of debugging and coding.

## How it works
To be honest, Knao is very simple. It will detect your bash history file and find your previous command, then re-execute command, finally copy output of the command to clipboard via pipe operator(`|`). For the above reasons, Knao is not suitable for recording complex and asynchronous (interactive) command.

## License
[MIT](/LICENSE)
