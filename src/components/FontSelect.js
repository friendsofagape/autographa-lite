import React, {useState,useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
const getSystemFonts = require('get-system-fonts');

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  }
}));

export default function FontSelect() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [options,setOption] = useState([
    "Select Font"
  ]);

  const handleClickListItem = event => {
    setAnchorEl(event.currentTarget);
    const files = getSystemFonts([]);
    // console.log("fonts",files);
    files.then(function(val) { 
        console.log(val); 
        setOption(val);
    });
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

//   useEffect(()=>{
//     const files = getSystemFonts([]);
//     // console.log("fonts",files);
//     files.then(function(val) { 
//         // console.log(val); 
//         setOption(val);
//     });
//   })

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="Device settings">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          onClick={handleClickListItem}
        >
          <ListItemText primary={options[selectedIndex]} />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
      <p style = {{fontFamily: "Liberation Sans Narrow"}}>Autographa AUTOGRAPHA</p>
    </div>
  );
}
