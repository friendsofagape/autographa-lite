import React, { useState } from 'react';
import AutographaStore from "./AutographaStore"
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { TextField, RaisedButton } from 'material-ui';
import RestoreIcon from '@material-ui/icons/Restore';
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


export default function BookEditList({ show }) {
    const classes = useStyles();
    const [updatedValue, setUpdatedValue] = useState("")
    const handleClose = () => {
        AutographaStore.openEditBook = false
        AutographaStore.editPopup = false
        setUpdatedValue("")

    };
    const onChange = (event, value) => {
        setUpdatedValue(event.target.value)
    }

    const updateBooks = () => {
        if (updatedValue !== "") {
            AutographaStore.UpdatedBookName = updatedValue;
            db.get('001', function (err, doc) {
                if (err) {
                    return console.log(err);
                } else {
                    doc.books.splice(AutographaStore.RequiredIndex, 1, AutographaStore.UpdatedBookName)
                }
                db.put(doc).then((response) => {
                    console.log("updated", response)
                    db.get('001', function (err, doc) {
                        if (err) {
                            return console.log(err);
                        } else {
                            AutographaStore.editBookData = doc.books
                        }
                    });
                })
            });
            AutographaStore.openEditBook = false
            AutographaStore.editPopup = false
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
                    <Modal.Title>UpdateBookNames</Modal.Title>
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
                        <TextField
                            hintText="Translate BookName"
                            onChange={onChange}
                            required
                            value={updatedValue || ""}
                            name="updatedValue"
                            id="updatedValue"
                            maxLength={20}
                        />
                        <Tooltip TransitionComponent={Zoom} placement="top" title="Reset">
                            <IconButton onClick={resetToDefault} style={{ float: "right", marginTop: "-45px", cursor: 'pointer' }}>
                                <RestoreIcon />
                            </IconButton>
                        </Tooltip>
                    </span>
                    <RaisedButton
                        style={{ marginTop: "35px", float: "right" }}
                        primary
                        onClick={updateBooks}>
                        Save
                </RaisedButton>
                    <RaisedButton
                        style={{ marginTop: "35px", float: "right", marginRight: "10px" }}
                        onClick={handleClose}>
                        Cancel
                </RaisedButton>
                </Modal.Body>
            </Modal >
        </div>

    )
}