# EJS Language Support #

Syntax highlighting for EJS, Javascript, and HTML tags. Includes javascript autocompletion.

Please rate this and provide feedback for 2 reasons:

1. It helps me know what I need to improve. *Can't fix what I don't know*
2. It will help other know that this version is out there and that it is a newer version of the top ranked EJS language file. *Old one has not had an update in 7 years (as of 2018)*

If there is anything that I missed or features you would like this to include. [Let me know](https://github.com/Digitalbrainstem/ejs-grammar/issues)

*NOTE: This is in early development; however, it does provide greater functionality than the other ejs language supports.*

## EJS docs ##

If you need documention on how to use EJS:

[EJS Github](https://github.com/mde/ejs)
[EJS Website](http://ejs.co/)

## For Devs ##

If you need the tmLanguage file please visit my repo. It is located in syntaxes.

If you want to see support on other platforms let me know.

### Resources ###

I know Textmate/tmLanguage documention is not well recorded. If anyone reading this needs some good reading material on how to write one, these are the resources I used to help me write this. 

+ [sublime Text](https://www.sublimetext.com/docs/3/scope_naming.html)
+ [Lessons Learned](https://www.apeth.com/nonblog/stories/textmatebundle.html)
+ [Textmate Manual](http://manual.macromates.com/en/language_grammars#language_grammars)
+ [Textmate Blog](http://blog.macromates.com/2005/language-grammars/)
+ [Atom Discussion 1](https://discuss.atom.io/t/first-steps-to-build-a-language-highlight/12047/5)
+ [Atom Discussion 2](https://discuss.atom.io/t/syntax-theme-nested-elements-recursivity-for-pattern/36536/5)

#### History ####

I wanted to start by utilizing other tmLanguage files that did things close to what EJS did. I tried starting with razor and PHP tmLanguage files from vscode. However, this ended up being more problimatic, as it would not do the things I wanted it to do. So I just started to write it from scratch to get it to work properly. The one thing I knew I did not want to do is have to write the others grammars definitions in this if I did not have to. I wanted to be able to utilize each of the embedded languages that were already created. This is more of a pain because you have to really have to think about the order things run and how regex and the tags work together. ALso recursion is huge to make it work properly. I am still learning, so if anyone has tips and tricks either let me know on twitter or github. I would love to here others that utilize this.

## TO DO ##

+ Create helpers to auto format code
+ Add other tags from EJS
+ Create routines for special instances of EJS.
+ Add support for EJS inside of double quotes in html tags.

## Contributors ##

[@meesfrensel](https://github.com/meesfrensel)

## Contact ##

Twitter: [@digibrainstem](https://twitter.com/digibrainstem)

[github](https://github.com/DigitalBrainstem/ejs-grammar)