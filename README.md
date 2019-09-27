# Autographa Lite
React re-write of an [earlier version](https://github.com/Bridgeconn/autographa-lite) of the app. All further development will be done here.

This is a standalone desktop application which hopes to aid and be a friendly companion of the Bible Translator. In essence it is a basic [USFM](http://paratext.org/about/usfm) editor which is capable of import and export of USFM files. It has handy features like color-coded diffs across imported texts for comparison between revisions, search and replace and export to formatted HTML.

## Developer Setup
It is relatively easy to setup the application locally for development.

### Prerequisites
[Node JS 12.6.0](https://nodejs.org/download/release/v12.6.0/)
[npm 6.9.0](https://www.npmjs.com/get-npm)    
[Python 2](https://www.python.org/downloads/release/python-2715/) (One of our build tools [breaks under Python 3](https://github.com/nodejs/node-gyp/issues/1337).)

### Build and run
1. Fork and clone this repository
2. Set environment variable ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES=true
3. Install dependencies with ```npm install```
4. Start the application with ```npm start```

#### Mac and *nix (tested on MacOS Sierra 10.14 and Ubuntu 19.04)  
In Bash-like shell:

```
export ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES=true
cd autographa-lite && npm install
npm start
```

#### Windows (tested on Windows 10)  
In Command Prompt:

```
cd autographa-lite
set ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES=true
npm install
npm start
```

## Contributing
If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.
Please read the [CONTRIBUTE](https://github.com/Bridgeconn/autographa-lite/blob/master/CONTRIBUTE.md) page for details on our code of conduct, and the process for submitting pull requests.

We really value our contributors weather they helped fix a bug, build a feature, tested out the app or made some meaningful impact. Look up our [contributors](https://github.com/friendsofagape/autographa-lite/graphs/contributors).

## License
This project is licensed under the liberal MIT License. See [LICENSE](https://github.com/Bridgeconn/autographa-lite/blob/master/LICENSE) for more details.

## Contact
Let us know if face any bugs/problems by opening an issue in GitHub. We'll do our best to be prompt in our response.

## Acknowledgments
* [Friends of Agape](http://friendsofagape.org/), for their support and contributions.
* [Bridge Connectivity Solutions](http://bridgeconn.com), for technical resources
