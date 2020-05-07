import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import MeetingRoom from '@material-ui/icons/MeetingRoom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const StyledMenu = withStyles({
  paper: {
   
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function WorkspaceMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handleClose} >
          <ListItemIcon>
            <SupervisorAccountIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Manage Users" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose}>
          <ListItemIcon>
            <MeetingRoom fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Leave Workspace" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}