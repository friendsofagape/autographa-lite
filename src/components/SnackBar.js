import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';


export default function SnackBar({ show, msg }) {
    const [Snackupdate, setSnackupdate] = useState(show)
    setTimeout(() => {
        setSnackupdate(false)
    }, 4000);

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
        </div>
    );
}