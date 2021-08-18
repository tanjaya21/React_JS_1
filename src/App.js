import React from 'react';
import { useEffect, useState } from 'react';
// import Products from './components/Products/Products';
// import Navbar from './components/Navbar/Navbar';

// instance for creating, deleting, editing product and many more of e-commerce function / or back-end code
import {commerce} from './lib/commerce';

// this is the better way to import
import {Products, Navbar, Cart, Checkout} from './components';

// the react router
import  {BrowserRouter as Router, Switch , Route} from 'react-router-dom'; 


const App = () => {

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState ({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchProducts = async () => {
        const {data} = await commerce.products.list();

        setProducts(data);
    }

    const fetchCart = async() =>{
        // const cart = 
        

        setCart(await commerce.cart.retrieve());
    }

    const handleAddToCart = async(productId, quantity)=>{
        const {cart} = await commerce.cart.add(productId, quantity);

        setCart(cart);
    }

    const handleUpdateCartQuantity = async(productId, quantity)=>{
        const {cart} = await commerce.cart.update(productId, {quantity}); //putting quantity into new object because quantity is only thing that we want to update

        setCart(cart)
    }

    const handleRemoveFromCart = async(productId) =>{
        const {cart} = await commerce.cart.remove(productId);

        setCart(cart);
    }

    const handleEmptyCart = async() =>{
        const {cart} = await commerce.cart.empty();

        setCart(cart);
    }

    const refreshCart = async() =>{
        const newCart = await commerce.cart.refresh();

        setCart(newCart);
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try{
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)

            setOrder(incomingOrder);
            refreshCart();
        }
        catch (error){
            setErrorMessage(error.data.error.message)
        }
    }

    useEffect(() =>{
        fetchProducts();
        fetchCart();
    },[] );

    console.log(cart);
    // this is will using the const that we created from above
    return (
        // to use router
        <Router>
            <div>
                {/* add the total item to the navbar cart */}
                <Navbar totalItems={cart.total_items} />
                {/* to switch between to component it wil be using switch */}
                <Switch>
                    {/* or in more simple term is showing either the Products or Cart */}
                    {/* it will depending on which Route */}
                        {/* Home Route only / */}
                        <Route exact path='/'>
                            {/* add item to the cart */}
                            <Products products={products} onAddToCart={handleAddToCart} />

                        </Route>
                        {/* Cart Route using /cart */}
                        <Route exact path='/cart'>
                            {/* handling cart items */}
                            <Cart cart={cart} 
                            // this is just a name of props, so we need to pass the parameter
                            handleUpdateCartQuantity = {handleUpdateCartQuantity}
                            handleRemoveFromCart = {handleRemoveFromCart}
                            handleEmptyCart = {handleEmptyCart}
                            />
                        </Route>
                        <Route exact path="/checkout">
                            {/* passing the cart as a props */}
                            <Checkout 
                                cart={cart}
                                order={order}
                                onCaptureCheckout={handleCaptureCheckout}
                                error={errorMessage}
                             />
                        </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App;