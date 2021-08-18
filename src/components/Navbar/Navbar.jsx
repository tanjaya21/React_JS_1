import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenutItem, Menu, Typography } from '@material-ui/core';
import {ShoppingCart} from '@material-ui/icons';
import {Link, useLocation } from 'react-router-dom';
import logo from '../../assets/commerce.png';
import useStyles from './navbarStyles';


const Navbar = ({totalItems}) => {
    const classes = useStyles();

    // the location need specific property which is path name
    const location = useLocation(); 

    return (
        <>
            <AppBar position='fixed' className={classes.appBar} color="inherit">
                <Toolbar>
                    <Typography component={Link} to="/" variant='h6' className={classes.title} color='inherit'>
                        <img src={logo} alt="Commerce.js" height="25px" className={classes.image} />
                        Logo
                    </Typography>
                    <div className={classes.grow} />
                    {/* to create the property, if we are currently on the home Route then it will show the button, if not it will not show anything */}
                    {location.pathname == '/' && (
                    <div className={classes.button}>
                        {/* the usuall thing we still using */}
                        {/* <Link to='/cart'> go to cart </Link> */}
                        {/* we can put the component in the IconButton and link it to the specific Route */}
                        <IconButton component={Link} to="/cart" aria-label='Show cart items' color='inherit'>
                            <Badge badgeContent={totalItems} color="secondary">
                                <ShoppingCart />
                            </Badge>
                        </IconButton> 
                    </div>)}
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Navbar;
