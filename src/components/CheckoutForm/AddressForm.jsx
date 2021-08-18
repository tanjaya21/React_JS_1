import React, {useState, useEffect} from 'react';
import {InputLabel, Select, MenuItem, Button, Grid, Typography} from '@material-ui/core';
import {useForm, FormProvider} from 'react-hook-form';
import FormInput  from './CustomTextField';
import { Link } from 'react-router-dom';
import { commerce } from '../../lib/commerce';

const AddressForm = ({ checkoutToken, next }) => {

    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');
    const methods = useForm();

    // object the entries, converted the object to the array, and map it to turn it into a normal array which is code and name, and returning an object with the id and label 
    const countries = Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name}));

    const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({id: code, label: name}));
    // console.log(subdivisions);

    const options = shippingOptions.map((sO)=>({id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` }))
    // console.log(shippingOptions);

    // fetching shipping countries, subdivisions and options using ecommerce API
    const fetchShippingCountries = async (checkoutTokenId) => {
        const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId);

        // it is still and object, need to change it into array
        setShippingCountries(countries);
        // so we need to call object.keys and just give the key of countries and give the first one
        setShippingCountry(Object.keys(countries)[0]);
    }

    const fetchSubdivisions = async (countryCode) =>{
        const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode);

        setShippingSubdivisions(subdivisions);
        setShippingSubdivision(Object.keys(subdivisions)[0]);
        // we cannot call imidiately when it render 
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) =>{
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region});

        setShippingOptions(options);
        setShippingOption(options[0].id);
    }

    // running the checkout token immidiately when it render

    // for Shipping Countries
    useEffect(()=>{
        // called the fetchshippingcontries function and pass it to checkoutToken.id
        fetchShippingCountries(checkoutToken.id)
    }, []);

    // for Shipping Subdivisions
    useEffect(()=>{
        // whenever the shipping country changes, it is going to recall the useEffect or calling the subdivisions
       if(shippingCountry) fetchSubdivisions(shippingCountry);
    }, [shippingCountry]);

    useEffect(()=>{
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    }, [shippingSubdivision]);


    return (
        <>
            <Typography variant='h6' gutterBottom> Shipping Address</Typography>
            <FormProvider {...methods}>
                {/* special handle submit is belong to method react hook form, the data will be contain the information for all of these specific fields */}
                {/* and required one funtion to bring all data back to checkout.jsx */}
                <form onSubmit={methods.handleSubmit((data)=> next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
                    {/* currently calling the next function, passing the necessary data, and getting all the data in the checkout.jsx, and set it in the shippingData */}
                    <Grid container style={{justifyContent: 'space-between', padding: 'auto',}} spacing={3}>
                        <FormInput required name="firstname" label="First Name" />
                        <FormInput required name="lastname" label="Last Name" />
                        <FormInput required name="address1" label="Address" />
                        <FormInput required name="email" label="Email" />
                        <FormInput required name="city" label="City" />
                        <FormInput required name="zip" label="ZIP / Postal Code" />
                        
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                                {countries.map((country) =>(
                                    <MenuItem key={country.id} value={country.id}>{country.label} </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                                {subdivisions.map((subdivision) =>(
                                    <MenuItem key={subdivision.id} value={subdivision.id}>{subdivision.label}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e)=> setShippingOption(e.target.value)}>
                                {options.map((option) =>(
                                    <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <br />
                    <div style={{display: 'flex' , justifyContent: 'space-between'}}>
                        <Button component={Link} to="/cart" variant="outlined"> Back to cart </Button>
                        <Button type="submit" variant="contained" color="primary"> Next </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
