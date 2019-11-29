import React, { useState } from 'react';
import AutographaStore from "./AutographaStore"
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { TextField, RaisedButton } from 'material-ui';
const { Modal } = require("react-bootstrap/lib");
let db = require(`${__dirname}/../util/data-provider`).targetDb()


export default function BookEditList({ show }) {

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
                            style={{ marginLeft: "10px" }}
                            onChange={onChange}
                            required
                            value={updatedValue || ""}
                            name="updatedValue"
                            id="updatedValue"
                        />
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