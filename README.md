# Autographa Lite
React re-write of an [earlier version](https://github.com/Bridgeconn/autographa-lite) of the app. All further development will be done here.

This is a standalone desktop application which hopes to aid and be a friendly companion of the Bible Translator. In essence it is a basic [USFM](http://paratext.org/about/usfm) editor which is capable of import and export of USFM files. It has handy features like color-coded diffs across imported texts for comparison between revisions, search and replace and export to formatted HTML.

## Developer Setup
It is relatively easy to setup the application locally for development.

### Prerequisites
[Node JS 8.9.3](https://nodejs.org/download/release/v8.9.3/)    
[Yarn 1.9.4](https://yarnpkg.com/en/docs/install)    
[Python 2](https://www.python.org/downloads/release/python-2715/) (One of our build tools [breaks under Python 3](https://github.com/nodejs/node-gyp/issues/1337).)

### Build and run
1. Fork and clone this repository
2. Set environment variable ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES=true
3. Install dependencies with ```yarn install```
3. Start the application with ```yarn start```

#### Mac and *nix (tested on MacOS Sierra 10.14 and Ubuntu 18.04)  
In Bash-like shell:

```
export ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES=true    
cd autographa-live && yarn install    
yarn start
```

#### Windows (tested on Windows 10)  
In Command Prompt:

```
cd autographa-lite
set ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES=true
yarn install
yarn start
```

## Contributing
If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.
Please read the [CONTRIBUTE](https://github.com/Bridgeconn/autographa-lite/blob/master/CONTRIBUTE.md) page for details on our code of conduct, and the process for submitting pull requests.

We really value our contributors weather they helped fix a bug, build a feature, tested out the app or made some meaningful impact, here are our heros in alphabetical order of first name/username:
- [aunger](https://github.com/aunger)
- [joelthe1](https://github.com/joelthe1)
- [sandeeponrails](https://github.com/sandeeponrails)
- [Ashersam](https://github.com/Ashersam)

## License
This project is licensed under the liberal MIT License. See [LICENSE](https://github.com/Bridgeconn/autographa-lite/blob/master/LICENSE) for more details.

## Contact
Let us know if face any bugs/problems by opening an issue in GitHub. We'll do our best to be prompt in our response.

## Acknowledgments
* [Friends of Agape](http://friendsofagape.org/), for their support and contributions.
