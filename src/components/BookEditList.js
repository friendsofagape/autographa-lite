import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import AutographaStore from "./AutographaStore"
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { TextField, RaisedButton } from 'material-ui';
import SnackBar from './SnackBar';
const { Modal } = require("react-bootstrap/lib");
let Constant = require("../util/constants");


export default function BookEditList({ show }) {

    const [updatedValue, setUpdatedValue] = useState("")
    const [snackupdate, setSnackupdate] = useState(false)
    const handleClose = () => {
        AutographaStore.openEditBook = false
        AutographaStore.editPopup = false
        setUpdatedValue("")
    };
    const onChange = (event, value) => {
        console.log(value, event.target.value)
        setUpdatedValue(event.target.value)
    }
    const updateBooks = () => {
        AutographaStore.UpdatedBookName = updatedValue;
        Constant.booksEditList.splice(AutographaStore.RequiredIndex, 1, AutographaStore.UpdatedBookName)
        AutographaStore.editBookData = Constant.booksEditList
        AutographaStore.openEditBook = false
        AutographaStore.editPopup = false
        setSnackupdate(true)
        setUpdatedValue("")
    }
    console.log("AutographaStore.editPopup1", show)

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
            <SnackBar show={snackupdate} msg="Saved Changes" />
        </div>

    )
}