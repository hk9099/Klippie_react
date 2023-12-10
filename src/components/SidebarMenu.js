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
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
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
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

const CustomizedMenus = ({ onMenuItemClick, index, className }) => {
    console.log('CustomizedMenus', className);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (menuItem) => {
        onMenuItemClick(menuItem, index);
        handleClose();
    };

    return (
        <div className={`relative`}>
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
                    paddingBottom: 0,
                    paddingTop: 0,
                    borderRadius: 0,
                    backgroundColor: 'transparent',
                    position: 'relative',
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
                style={{
                    position: 'absolute',
                    top: '100px',
                    right: '0px',
                    marginTop: '10px',
                    marginLeft: '10px',
                    borderRadius: '6px',
                    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
                    '& .MuiMenu-list': {
                        padding: '4px 0',
                    },
                    '& .MuiMenuItem-root': {
                        '& .MuiSvgIcon-root': {
                            fontSize: 18,
                            color: '#374151',
                            marginRight: '12px',
                        },
                        '&:active': {
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        },
                    },
                }}
            >
                <MenuItem onClick={() => handleMenuItemClick('edit')} disableRipple>
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
