import React, {useState, useEffect} from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core';
// importing API
import { commerce } from '../../../lib/commerce';
import { Link, useHistory } from 'react-router-dom';
import useStyles from './checkoutStyles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';

const steps = ['Shipping Address', 'Payment Details'];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({}); // the useState in the beginning will be empty object
    const [isFinished, setIsFinished] = useState(false);
    const classes = useStyles();
    const history = useHistory();

    // once user enter the checkout process it will generate checkoutToken
    // to create a token required to import the API
    useEffect(()=>{
        const generateToken = async () =>{
            try{
                const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'});

                console.log(token);

                setCheckoutToken(token);
            } 
            catch(error){
                // history.pushState('/');
                console.log(error);
            }
        }
        generateToken();
    }, [cart]); // need to make it update dynamically with the cart

    // function to handle the step
    const nextStep = () => setActiveStep((prevActiveStep)=> prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep)=> prevActiveStep - 1);

    // passing the next function, the function will be accepting data, and the data will be set in the shipping data above
    const next = (data) =>{
        setShippingData(data);
        nextStep();
    }

    const timeout = () =>{
        setTimeout(() =>{
            setIsFinished(true);
        }, 3000);
    }

    let Confirmation = ()=> order.customer ? (
        <>
            <div>
                <Typography variant='h5'> Thank You for Purchase, {order.customer.firstname} {order.customer.lastname}  </Typography>
                <Divider className={classes.divider} />
                <Typography variant='subtitle2' > Order Ref: {order.customer_reference} </Typography>

            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button" > Back to Home </Button>
        </>
    ) : isFinished ? (
        <>
            <div>
                <Typography variant='h5'> Thank You for Purchase  </Typography>
                <Divider className={classes.divider} />
                <Typography variant='subtitle2' > Order Ref: {order.customer_reference} </Typography>

            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button" > Back to Home </Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if(error) {
        <>
        <Typography variant="h5" > Error: {error}</Typography>
        <Button component={Link} to="/" variant="outlined" type="button" > Back to Home </Button>
        </>
    }

    const Form = ()=> activeStep === 0
    // pass the state as a props in here
    ?<AddressForm checkoutToken={checkoutToken} next={next} />
    :<PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} timeout={timeout}/>


    return (
        // the render methods
        <>
        <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center"> Checkout </Typography>
                    <Stepper activeStep={activeStep} className={classes.Stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {/* if we have the checkout token and && from so it will render the form */}
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form/> } 
                </Paper>
            </main>
        </>
    )
}

export default Checkout
