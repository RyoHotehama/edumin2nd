import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {useState} from 'react';

const Header = () => {
  const [state, setState] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event: any) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar
      position='static'
      elevation={0}
      style={{color: '#ffffff', backgroundColor: '#000000'}}
    >
      <Container maxWidth='lg'>
        <Toolbar disableGutters>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setState(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor='left'
            open={state}
            onClose={() => setState(false)}
          >
            <List>
              <ListItem>
                <ListItemButton>
                  <Link href={{pathname: '/'}} passHref>
                    <ListItemText primary='Quiz' />
                  </Link>
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
          <Link href={{pathname: '/'}} passHref>
            <Image
              src={'/logo.png'}
              alt='ロゴ画像'
              width={180}
              height={50}
              objectFit='contain'
            />
          </Link>
          <Box sx={{marginLeft: 'auto'}}>
            <IconButton onClick={handleOpenUserMenu}>
              <Avatar alt="" src="" />
            </IconButton>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Link href={{pathname: '/'}} passHref>
                  <Typography textAlign="center">
                    Profile
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Link href={{pathname: '/'}} passHref>
                  <Typography textAlign="center">
                    Logout
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default Header;
