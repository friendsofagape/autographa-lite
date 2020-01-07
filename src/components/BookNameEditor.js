import React, { useState } from 'react';
import AutographaStore from "./AutographaStore"
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { TextField, RaisedButton } from 'material-ui';
import RestoreIcon from '@material-ui/icons/Restore';
import { FormattedMessage } from "react-intl";
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton, Zoom } from '@material-ui/core';
const constants = require("../util/constants");
const { Modal } = require("react-bootstrap/lib");
let db = require(`${__dirname}/../util/data-provider`).targetDb();

const useStyles = makeStyles({
    root: {
        width: 500,
    },
    tooltip: {
        color: "lightblue",
        backgroundColor: "green"
    }
});


export default function BookNameEditor({ show }) {
    const classes = useStyles();
    const [updatedValue, setUpdatedValue] = useState("")
    const handleClose = () => {
        AutographaStore.openBookNameEditor = false
        AutographaStore.bookNameEditorPopup = false
        setUpdatedValue("")

    };
    const onChange = (event, value) => {
        setUpdatedValue(event.target.value)
    }

    const updateBooks = () => {
        if (updatedValue !== "") {
            AutographaStore.updatedTranslatedBookNames = updatedValue;
            db.get('translatedBookNames', function (err, doc) {
                if (err) {
                    return console.log(err);
                } else {
                    doc.books.splice(AutographaStore.RequiredIndex, 1, AutographaStore.updatedTranslatedBookNames)
                }
                db.put(doc).then((response) => {
                    db.get('translatedBookNames', function (err, doc) {
                        if (err) {
                            return console.log(err);
                        } else {
                            AutographaStore.translatedBookNames = doc.books
                        }
                    });
                })
            });
            AutographaStore.openBookNameEditor = false
            AutographaStore.bookNameEditorPopup = false
            setUpdatedValue("")
        }
    }
    const resetToDefault = () => {
        let BookName = constants.booksList[parseInt(AutographaStore.RequiredIndex, 10)]
        setUpdatedValue(BookName)
    }

    return (
        <div>
            <Modal
                show={show}
                style={{ "top": "52px", "left": "154px", "height": "643px", "position": "fixed" }}
            >
                <Modal.Header className="head" >
                    <Modal.Title>
                    <FormattedMessage id="modal-translate-book-name" />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ "height": "150px" }}>
                    <span>
                        <TextField
                            style={{ marginRight: "10px" }}
                            value={AutographaStore.bookName}
                            name="defaultValue"
                            id="defaultValue"
                        />
                        <ArrowRightAltIcon />
                        <FormattedMessage id="modal-translate-book-name">
                        {message => (
                        <TextField
                            hintText={message}
                            onChange={onChange}
                            required
                            value={updatedValue || ""}
                            name="updatedValue"
                            id="updatedValue"
                            maxLength={20}
                        />
                        )}
                        </FormattedMessage>
                        <FormattedMessage id="icon-button-reset">
                        {message => (
                        <Tooltip TransitionComponent={Zoom} placement="top" title={message}>
                            <IconButton onClick={resetToDefault} style={{ float: "right", marginTop: "-45px", cursor: 'pointer' }}>
                                <RestoreIcon />
                            </IconButton>
                        </Tooltip>
                        )}
                        </FormattedMessage>
                    </span>
                    <RaisedButton
                        style={{ marginTop: "35px", float: "right" }}
                        primary={true}
                        onClick={updateBooks}>
                        <FormattedMessage id="btn-save" />
                    </RaisedButton>
                    <RaisedButton
                        style={{ marginTop: "35px", float: "right", marginRight: "10px" }}
                        onClick={handleClose}>
                        <FormattedMessage id="btn-cancel" />
                </RaisedButton>
                </Modal.Body>
            </Modal >
        </div>

    )
}