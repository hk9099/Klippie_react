// CustomizedMenus.js
import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
            backgroundColor: theme.palette.mode === 'light' ? '#0D0E20' : "#0D0E20",
            color: '#FFFFFF', 
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: '#FFFFFF',
                marginRight: theme.spacing(1.5),
            },
            '&:hover': {
                backgroundColor: alpha(
                    '#FFF',
                    '#FFF',
                ),
            },
        },
    },
}));

const CustomizedMenus = ({ onMenuItemClick, index, className,setHide }) => {
    console.log('setHide', setHide);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        onMenuItemClick(null, index);
    };

    const handleMenuItemClick = (menuItem) => {
        onMenuItemClick(menuItem, index);
        handleClose();
    };

    return (
        <div className={`edit-button ${setHide === true ? 'hidden' : ''}`}>
            <Button
                id={`customized-button-${index}`}
                aria-controls={open ? `customized-menu-${index}` : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                style={{
                    minWidth: 'unset',
                    padding: 0,
                    borderRadius: "4px",
                    backgroundColor: 'transparent',
                    position: 'relative',
                    display: `${setHide ? 'none' : 'block'}`
                }}
            >
                <MoreVertOutlinedIcon />
            </Button>
            <StyledMenu
                id={`customized-menu-${index}`}
                MenuListProps={{
                    'aria-labelledby': `customized-button-${index}`,
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleMenuItemClick('edit')}
                className="custom-menu-item" 
                 disableRipple>
                    <EditIcon />
                    Edit
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('delete')} disableRipple>
                    <DeleteForeverIcon />
                    Archive
                </MenuItem>
            </StyledMenu>
        </div>
    );
};

export default CustomizedMenus;
