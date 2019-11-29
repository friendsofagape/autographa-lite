import React, { useState } from 'react';
import AutographaStore from "./AutographaStore";
import Snackbar from '@material-ui/core/Snackbar';


export default function SnackBar({ show, msg }) {
    const [Snackupdate, setSnackupdate] = useState(show)
    setTimeout(() => {
        setSnackupdate(false)
    }, 2000);


    return (
        <div>
            <Snackbar
                open={Snackupdate}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{msg}</span>}
            />
            <Snackbar
                open={AutographaStore.openEditBook}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{msg}</span>}
            />
        </div>
    );
}