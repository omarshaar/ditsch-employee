import './mainHeader.css';
import { useState } from 'react';
// logo
import Logo from '../../assets/icons/logo.png';
// MUI
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useEffect } from 'react';

const MainHeader = () => {

    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }
    
    setState({ ...state, [anchor]: open });
    };

    useEffect(()=>{
      adminValidation();
    },[]);
    
    const list = (anchor) => (
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
    );

    
    function adminValidation() {
      window.addEventListener('message', (event) => {
        let admin = event.data == "admin";
        if (admin) {
          document.getElementById("mainheaderContainer").style.display = "none";
        }
      });
    }

    return (
        <div className="mainheaderContainer w-full  px-5 bg-main rounded-b-lg z-10" id='mainheaderContainer'>
            <div className='h-full page mx-auto flex justify-between items-center mainheaderBody'>
                <div className='header-logo-container w-max  h-9'>
                    <img src={Logo} alt="logo" className='h-full'/>
                </div>
                <div className='header-mobile-menu-container' data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" onClick={toggleDrawer("right", true)}>
                    <svg width="26" height="26" viewBox="0 0 24 24" strokeWidth="1.6" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
                </div>

                <Drawer
                    anchor={"right"}
                    open={state["right"]}
                    onClose={toggleDrawer("right", false)}
                >
                    <DrawerBody />
                </Drawer>


            </div>
        </div>
    );
}









const DrawerBody = ( ) => {

    const [data, setData] = useState("");

    useEffect(()=>{
        setData(JSON.parse(localStorage.getItem("userData")));

    },[]);


    function logOut() {
        try{
            localStorage.removeItem("user");
            localStorage.removeItem("userData");
        }finally{
            window.location.reload();
        }
    }


    

    return( 
        <div className='DrawerBody flex flex-col items-center'>
            <div className='py-8'>
                <img src={data.avatar} alt="avatar" className='h-28' />
            </div>
            <div className=''>
                <p className='text-2xl font-extrabold'> { data.userName } </p>
            </div>

            <div className='py-8'>
                <Button variant='contained' className='btn !p-2 !px-6' onClick={logOut}>
                    <span className='text-white mr-3'>ausloggen</span>
                    <svg className='' width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M7 12h14l-3 -3m0 6l3 -3" /></svg>
                </Button>
            </div>
        </div>
    )
}

export default MainHeader;