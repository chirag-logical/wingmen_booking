import React, { useEffect, useState } from 'react'
import Geocode from "react-geocode";
//PHONE INPUT
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
//OTP INPUT
import OtpInput from 'react-otp-input';
import axios from 'axios';
import API, { mapKey } from '../../Config/api';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { Context } from '../../Data/context';


const BookingLogin = () => {

    const {
        setToken,
        setUserData,
        bookingSignin,
        setBookingSignin,
        setIsBookingSignup,
        onSignUp,
        setOnSignUp
    } = useContext(Context)

    //USER REGIS 
    const [phoneNumber, setPhoneNumber] = useState('')
    const [countryCode, setCountryCode] = useState('')
    const [opt, setOpt] = useState('')
    const [otpId, setOtpId] = useState('')
    //COMPONENT VIEW
    const [checkPhone, setCheckPhone] = useState(true)
    const [UserOtpView, setUserOtpView] = useState(false)
    const [userProfileView, setUserProfileView] = useState(false)
    //USER PROFILE DATA
    const [fname, setFname] = useState('')
    const [lName, setLName] = useState('')
    const [gender, setGender] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [address, setAddress] = useState('')

    //SIGNUP COMPONENT VIEW
    const onSignup = () => {
        setOnSignUp(false)
    }
    //SIGNIN COMPONENT VIEW
    const onSignIn = () => {
        setOnSignUp(true)
    }

    //TAKE PHONENUMBER & COUNTRYCODE
    const onPhoneNumber = (value, data) => {
        setCountryCode(`+${data.dialCode}`);
        setPhoneNumber(value.slice(data.dialCode.length));
    }

    //API CALL FOR USER REGISTER
    const onSubmit = () => {
        const body = {
            countryCode: countryCode,
            phone: phoneNumber,
            type: "mobile",
        }
        let url = API + `signUp`;
        axios
            .post(url, body)
            .then((response) => {
                console.log(response, 'signUp');
                if (response.data.success === true) {
                    console.log(response, 'signUp');
                    setOtpId(response.data.data.otpId)
                    setCheckPhone(false)
                    setUserOtpView(true)
                } else {
                    toast.warn(response.data.message)
                }
            })
            .catch((err) => {
                console.log("error here", err);
            });
    }

    //API FOR USER OTP VERIFICATION
    const onRegister = () => {
        const body = {
            otp: opt,
            otpId: otpId
        }
        let url = API + `verifyOtp`;
        axios
            .post(url, body)
            .then((response) => {
                console.log(response, 'verifyOtp');
                if (response.data.success === true) {
                    console.log(response, 'verifyOtp');
                    setUserProfileView(true)
                    setUserOtpView(false)
                } else {
                    toast.warn(response.data.message)
                }
            })
            .catch((err) => {
                console.log("error here", err);
            });
    }

    //API FOR USER PROFILE DETAIL SAVE
    const onUserData = () => {
        const body = {
            image: '',
            firstName: fname,
            lastName: lName,
            email: email,
            password: password,
            phone: parseInt(phoneNumber, 0),
            countryCode: countryCode,
            latitude: latitude,
            longitude: longitude,
            address: address,
            gender: gender,
            genderType: gender,
            singUpType: "mobile",
            deviceType: "web"
        }
        console.log(body, "user body");
        let url = API + `complete`;
        axios
            .post(url, body)
            .then((response) => {
                console.log(response, 'complete');
                if (response.data.success === true) {
                    console.log(response, 'complete');
                    toast.dark('Login done')
                    //SAVE USER DATA IN LOCALSTORAGE
                    localStorage.setItem(
                        "wingmen_booking",
                        JSON.stringify(response.data.data)
                    );
                    setUserData(response.data.data)
                    setToken(response.data.data.token)
                    setIsBookingSignup(true)
                } else {
                    toast.warn(response.data.message)
                }
            })
            .catch((err) => {
                console.log("error here", err);
            });
    }

    //FOR FETCHING CALLBACK AND GETING LAT LNG FROM GEOCODE
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
            //GETING ADDRESS FROM LAT & LNG
            Geocode.setApiKey(mapKey);
            Geocode.enableDebug();
            Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                response => {
                    const address = response.results[0].formatted_address;
                    setAddress(address);
                },
                error => {
                    console.error(error);
                }
            );
        });
    }, [])


    return (
        <div className='booking_login'>
            <h2>Get Moving With <span>Wingmen</span></h2>
            {onSignUp ? <div className="login_form">
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Email / Phone"
                    value={bookingSignin.loginId}
                    onChange={(e) => {
                        setBookingSignin({
                            ...bookingSignin,
                            loginId: e.target.value,
                        });
                    }}
                />
                <input
                    type="password"
                    name="pass"
                    id="pass"
                    placeholder="Password"
                    value={bookingSignin.loginPassword}
                    onChange={(e) => {
                        setBookingSignin({
                            ...bookingSignin,
                            loginPassword: e.target.value,
                        });
                    }}
                />
                <div className="bookig_signup">
                    <h3>Don't have an account?<span onClick={() => onSignup()}>Sign Up</span></h3>
                </div>
            </div>
                : <div className="login_form">
                    {checkPhone &&
                        <div className="signup_form">
                            <PhoneInput
                                country={'in'}
                                // country={'us'}
                                onChange={onPhoneNumber}
                            />
                            <div className="login_forget float-end">
                                <button className="btn_brand" onClick={() => onSubmit()}>Check For Otp</button>
                            </div>
                        </div>
                    }
                    {UserOtpView &&
                        <div>
                            <div className="signup_form_otp">
                                <OtpInput
                                    value={opt}
                                    onChange={(e) => setOpt(e)}
                                    numInputs={6}
                                    separator={<span> - </span>}
                                />
                            </div>
                            <div className="login_forget float-end">
                                <button className="btn_brand" onClick={() => onRegister()}>Verified Otp</button>
                            </div>
                        </div>
                    }
                    {userProfileView &&
                        <div className="user_date signup_user_detail">
                            <h2>User Profile</h2>
                            <div className="user_input mb-0">
                                <label htmlFor="fname">First Name:</label>
                                <input
                                    type="text"
                                    name="fname"
                                    id="fname"
                                    placeholder="First Name"
                                    value={fname}
                                    onChange={(e) => setFname(e.target.value)}
                                />
                            </div>
                            <div className="user_input mb-0">
                                <label htmlFor="lname">Last Name:</label>
                                <input
                                    type="text"
                                    name="lname"
                                    id="lname"
                                    placeholder="Last Name"
                                    value={lName}
                                    onChange={(e) => setLName(e.target.value)}
                                />
                            </div>
                            <div className="user_input">
                                <label htmlFor="gender">Gender:</label>
                                <select
                                    name="gender"
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="MALE">MALE</option>
                                    <option value="FEMALE">FEMALE</option>
                                    <option value="NO_PREFRENCE">NO_PREFRENCE</option>
                                </select>
                            </div>
                            <div className="user_input mb-0">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="user_input mb-0">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="login_forget float-end">
                                <button
                                    className="btn_brand"
                                    onClick={() => onUserData()}
                                >
                                    save profile
                                </button>
                            </div>
                        </div>
                    }
                    <div className="bookig_signup">
                        <h3>Don't have an account?<span onClick={() => onSignIn()}>Sign In</span></h3>
                    </div>
                </div>
            }
        </div>
    )
}

export default BookingLogin