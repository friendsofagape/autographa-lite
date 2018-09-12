import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
const bootstrap = require('react-bootstrap');
const Modal = require('react-bootstrap/lib/Modal');
const Button = require('react-bootstrap/lib/Button');
const Col = require('react-bootstrap/lib/Col');
const Tabs = require('react-bootstrap/lib/Tabs');
const Tab = require('react-bootstrap/lib/Tab');
const Constant = require("../util/constants");
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
const session =  require('electron').remote.session;
import { dialog, remote } from 'electron';
import { observer } from "mobx-react"
import AutographaStore from "./AutographaStore"
import Reference from "./Reference"
import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'

import Prism from 'prismjs'
import fs from 'fs';
import path from 'path';


;Prism.languages.markdown=Prism.languages.extend("markup",{}),Prism.languages.insertBefore("markdown","prolog",{blockquote:{pattern:/^>(?:[\t ]*>)*/m,alias:"punctuation"},code:[{pattern:/^(?: {4}|\t).+/m,alias:"keyword"},{pattern:/``.+?``|`[^`\n]+`/,alias:"keyword"}],title:[{pattern:/\w+.*(?:\r?\n|\r)(?:==+|--+)/,alias:"important",inside:{punctuation:/==+$|--+$/}},{pattern:/(^\s*)#+.+/m,lookbehind:!0,alias:"important",inside:{punctuation:/^#+|#+$/}}],hr:{pattern:/(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,lookbehind:!0,alias:"punctuation"},list:{pattern:/(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,lookbehind:!0,alias:"punctuation"},"url-reference":{pattern:/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,inside:{variable:{pattern:/^(!?\[)[^\]]+/,lookbehind:!0},string:/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,punctuation:/^[\[\]!:]|[<>]/},alias:"url"},bold:{pattern:/(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^\*\*|^__|\*\*$|__$/}},italic:{pattern:/(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^[*_]|[*_]$/}},url:{pattern:/!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,inside:{variable:{pattern:/(!?\[)[^\]]+(?=\]$)/,lookbehind:!0},string:{pattern:/"(?:\\.|[^"\\])*"(?=\)$)/}}}}),Prism.languages.markdown.bold.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.italic.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.bold.inside.italic=Prism.util.clone(Prism.languages.markdown.italic),Prism.languages.markdown.italic.inside.bold=Prism.util.clone(Prism.languages.markdown.bold); // prettier-ignore


@observer
class ReferencePanel extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = { verses: [], refContent: '', refList: [], scriptDir: "LTR" ,
        value: Plain.deserialize(
            'Slate is flexible enough to add **decorations** that can format text based on its content. For example, this editor has **Markdown** preview decorations on it, to make it _dead_ simple to make an editor with built-in Markdown previewing.\n## Try it out!\nTry it out for yourself!'
          ),
        }
        session.defaultSession.cookies.get({ url: 'http://refs.autographa.com' }, (error, refCookie) => {
            if(refCookie.length > 0){
                AutographaStore.refId = refCookie[0].value;
            }
        });
        session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, bookCookie) => {
            if(bookCookie.length > 0){
                AutographaStore.bookId = bookCookie[0].value;
            }
        });
        session.defaultSession.cookies.get({ url: 'http://chapter.autographa.com' }, (error, chapterCookie) => {
            if(chapterCookie.length > 0){
                AutographaStore.chapterId = chapterCookie[0].value;
            }
        });
    }
    componentDidMount(){
        let data = ""
        let that = this;
        fs.readFile(path.resolve(__dirname, 'sample.md'), 'utf8',  function (err,data) {
            if(err) {
                console.log(err)
                return
            }
            console.log
            that.setState({value: Plain.deserialize(data)})
        })
    }
    render (){
        const layout = AutographaStore.layout;
        const {tIns, tDel} = this.props;
        return (        
            <div className="container-fluid">
                <div className="row row-col-fixed rmvflex" style={{display: 'flex'}}>
                    <div className="col-sm-12 col-fixed" id="section-0">
                        <Editor
                            placeholder="Write some markdown..."
                            value={this.state.value}
                            onChange={this.onChange}
                            renderMark={this.renderMark}
                            decorateNode={this.decorateNode}
                            readOnly = {false}
                        />
                    </div>
                </div>
            </div>
        ) 
    }

    renderMark = props => {
        const { children, mark, attributes } = props
    
        switch (mark.type) {
          case 'bold':
            return <strong {...attributes}>{children}</strong>
          case 'code':
            return <code {...attributes}>{children}</code>
          case 'italic':
            return <em {...attributes}>{children}</em>
          case 'underlined':
            return <u {...attributes}>{children}</u>
          case 'title': {
            return (
              <span
                {...attributes}
                style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  margin: '20px 0 10px 0',
                  display: 'inline-block',
                }}
              >
                {children}
              </span>
            )
          }
          case 'punctuation': {
            return (
              <span {...attributes} style={{ opacity: 0.2 }}>
                {children}
              </span>
            )
          }
          case 'list': {
            return (
              <span
                {...attributes}
                style={{
                  paddingLeft: '10px',
                  lineHeight: '10px',
                  fontSize: '20px',
                }}
              >
                {children}
              </span>
            )
          }
          case 'hr': {
            return (
              <span
                {...attributes}
                style={{
                  borderBottom: '2px solid #000',
                  display: 'block',
                  opacity: 0.2,
                }}
              >
                {children}
              </span>
            )
          }
        }
      }
    
      /**
       * On change.
       *
       * @param {Change} change
       */
    
      onChange = ({ value }) => {
        this.setState({ value })
      }
    
      /**
       * Define a decorator for markdown styles.
       *
       * @param {Node} node
       * @return {Array}
       */
    
      decorateNode(node) {
        if (node.object != 'block') return
    
        const string = node.text
        const texts = node.getTexts().toArray()
        const grammar = Prism.languages.markdown
        const tokens = Prism.tokenize(string, grammar)
        const decorations = []
        let startText = texts.shift()
        let endText = startText
        let startOffset = 0
        let endOffset = 0
        let start = 0
    
        function getLength(token) {
          if (typeof token == 'string') {
            return token.length
          } else if (typeof token.content == 'string') {
            return token.content.length
          } else {
            return token.content.reduce((l, t) => l + getLength(t), 0)
          }
        }
    
        for (const token of tokens) {
          startText = endText
          startOffset = endOffset
    
          const length = getLength(token)
          const end = start + length
    
          let available = startText.text.length - startOffset
          let remaining = length
    
          endOffset = startOffset + remaining
    
          while (available < remaining) {
            endText = texts.shift()
            remaining = length - available
            available = endText.text.length
            endOffset = remaining
          }
    
          if (typeof token != 'string') {
            const dec = {
              anchor: {
                key: startText.key,
                offset: startOffset,
              },
              focus: {
                key: endText.key,
                offset: endOffset,
              },
              mark: {
                type: token.type,
              },
            }
    
            decorations.push(dec)
          }
    
          start = end
        }
    
        return decorations
    }
    
    
}
module.exports = ReferencePanel