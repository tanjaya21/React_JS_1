import React from 'react';
import {Grid}  from '@material-ui/core';

import Product from './Product/Product';
import useStyles from './productsStyles';

// const products = [
//     { id: 1, name: 'Shoe', description: 'Running Shoe', price:'$5', image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'},
//     { id: 2, name: 'Laptop', description: 'Apple Macbook', price:'$10', image:'https://cdn.mos.cms.futurecdn.net/uWjEogFLUTBc8mSvagdiuP-970-80.jpg.webp'},
// ];

const Products = ({products, onAddToCart}) =>{
    const classes = useStyles();
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container justify="center" spacing={4}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <Product product={product} onAddToCart={onAddToCart} />
                    </Grid>
                ))}
            </Grid>
        </main>
    );
}

export default Products;