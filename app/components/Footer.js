import React from 'react';
import ReactDOM from 'react-dom';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import { observer } from "mobx-react";
import TodoStore from "./TodoStore";
import { FormattedMessage } from 'react-intl';
const Constant = require("../util/constants");
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();



@observer
class Footer extends React.Component {
    constructor(props){
        super(props);
        this.fontChange = this.fontChange.bind(this);
        this.state = {
            onSave: props.onSave
        }       
    }

    handleChange(key) {
        // console.log(key);
        TodoStore.layout = key;
        TodoStore.layoutContent = key;
        TodoStore.aId = key;
        let chapter = TodoStore.chapterId;
        refDb.get('targetReferenceLayout').then(function(doc) {
            refDb.put({
                _id: 'targetReferenceLayout',
                layout: key,
                _rev: doc._rev
            })
        }).catch(function(err) {
            refDb.put({
                _id: 'targetReferenceLayout',
                layout: key
            }).catch(function(err) {
            });
        });
    }

    fontChange(multiplier) {
        var elements = (document.getElementsByClassName("col-ref").length - 1)
        let fontSize = TodoStore.fontMin;
        if (document.getElementsByClassName("col-ref")[0].style.fontSize == "") {
            document.getElementsByClassName("col-ref")[0].style.fontSize = "14px";
        }else{
            fontSize = parseInt(document.getElementsByClassName("col-ref")[0].style.fontSize)
        }
        if(multiplier < 0){
            if((multiplier+fontSize) <= TodoStore.fontMin ){
                fontSize = TodoStore.fontMin
            }else{
                fontSize = multiplier + fontSize
            }
        }else{
            if((multiplier+fontSize) >= TodoStore.fontMax ){
                fontSize = TodoStore.fontMax
            }else{
                fontSize = multiplier + fontSize
            }
        }
        TodoStore.currentFontValue = fontSize
        for (var i = 0; i <= elements; i++) {
            document.getElementsByClassName("col-ref")[i].style.fontSize = fontSize + "px";
        };
        
    }
    sliderFontChange(obj){
        var elements = (document.getElementsByClassName("col-ref").length - 1)
        console.log(elements);
        for (var i = 0; i <= elements; i++) {
        document.getElementsByClassName("col-ref")[i].style.fontSize = obj.target.value + "px";
        }
    }

    render() {
        console.log(TodoStore.layout)
        return (
        <nav className="navbar navbar-default navbar-fixed-bottom">
            <div className="container-fluid">
                 <div className="collapse navbar-collapse">
                        <div style={{float:"left"}} className="btn-group navbar-btn verse-diff-on" role="group" aria-label="...">
                            <span>
                            <FormattedMessage id="tooltip-minus-font-size" >
                            {(message) =>
                                <a className="btn btn-default font-button minus" data-toggle="tooltip" data-placement="top" title={message} onClick= {this.fontChange.bind(this, (-2))}>A-</a>
                            }
                            </FormattedMessage>
                            </span>
                                <ReactBootstrapSlider
                                    change={this.sliderFontChange.bind(this)}
                                    value={TodoStore.currentFontValue}
                                    step={TodoStore.fontStep}
                                    max={TodoStore.fontMax}
                                    min={TodoStore.fontMin}
                                    orientation="horizontal"
                                />
                            <span>
                            <FormattedMessage id="tooltip-plus-font-size" >
                            {(message) =>
                                <a className="btn btn-default font-button plus" data-toggle="tooltip" data-placement="top" title={message} onClick= {this.fontChange.bind(this, (+2))}>A+</a>
                            }
                            </FormattedMessage>
                            </span>
                        </div>
                    <div className="nav navbar-nav navbar-center verse-diff-on">
                        <div className="btn-group navbar-btn layout" role="group" aria-label="...">
                            <FormattedMessage id="tooltip-2-column">
                                { (message) =>
                                  <a className={`btn btn-primary btn-default ${TodoStore.layout == 1 ? "active" : ""}`} id="btn-2x" onClick = {this.handleChange.bind(this,1)} href="#" data-output="2x" role="multi-window-btn" data-toggle="tooltip" data-placement="top" title={message} >2x &nbsp;<i className="fa fa-columns fa-lg"></i>
                                  </a>
                                }
                            </FormattedMessage>
                            <FormattedMessage id="tooltip-3-column">
                                { (message) =>
                                <a className={`btn btn-primary btn-default ${TodoStore.layout == 2 ? "active" : ""}`} id="btn-3x" onClick = {this.handleChange.bind(this,2)} href="#" data-output="3x" role="multi-window-btn" data-toggle="tooltip" data-placement="top" title={message}>3x &nbsp;<i className="fa fa-columns fa-lg"></i>
                                </a>
                                }
                            </FormattedMessage>
                            <FormattedMessage id="tooltip-4-column">
                                { (message) =>                            
                                <a className={`btn btn-primary btn-default ${TodoStore.layout == 3 ? "active" : ""}`} id="btn-4x" onClick = {this.handleChange.bind(this,3)} href="#" data-output="4x" role="multi-window-btn" data-toggle="tooltip" data-placement="top" title={message}>4x &nbsp;<i className="fa fa-columns fa-lg"></i>
                                </a>
                            }
                            </FormattedMessage>
                        </div>
                    </div>
                    <span id="tooltip-btn-save"></span>
                        <ul style={{marginRight: "30px", float: "right"}} className="nav navbar-nav navbar-right">
                            <li>
                                <FormattedMessage id="btn-save" >
                                {(message) =>
                                <a id="save-btn" data-toggle="tooltip" data-placement="top" title={message} className="btn btn-success btn-save navbar-btn navbar-right" href="#" role="button" onClick={this.state.onSave}><FormattedMessage id="btn-save" /></a>}
                                </FormattedMessage>
                            </li>
                        </ul>
                </div>
            </div>
        </nav> )
    }
}

module.exports = Footer;