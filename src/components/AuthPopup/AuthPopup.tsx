import React from 'react'
import './AuthPopup.css'
import Image from 'next/image'
import logo from '@/assets/logo.png'
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'

interface AuthPopupProps {
    setShowpopup: React.Dispatch<React.SetStateAction<boolean>>;
}
const AuthPopup: React.FC<AuthPopupProps> = ({ setShowpopup }) => {

    const [showSignup, setShowSignup] = React.useState<boolean>(false)


    const handleLogin = () => { }
    const handleSignup = () => { }
    return (
        <div className='popup'>
               <button className='close'
                onClick={() => {
                    setShowpopup(false)
                }}
            >
                <AiOutlineClose />
            </button>
            {
                showSignup ? (
                    <div className='authform'>
                        <div className='left'>
                            <Image src={logo} alt="Logo" />
                        </div>
                        <div className='right'>
                            <h1>Signup to become Fit-योगी</h1>
                            <form action="">
                                <Input
                                    color="success"
                                    placeholder="Email ID"
                                    size="lg"
                                    variant="outlined"
                                />

                                <Input
                                    color="success"
                                    placeholder="Password"
                                    size="lg"
                                    variant="outlined"
                                    type='password'
                                />


                                <div className='form_input_leftright'>
                                    <Input color="success" size="lg" variant="outlined" type="number" placeholder='Age' />
                                    <Input color="success" size="lg" variant="outlined" type="number" placeholder='Weight' />
                                </div>

                                <Select
                                    color="success"
                                    placeholder="Gender"
                                    size="lg"
                                    variant="outlined"
                                >
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                    <Option value="other">Other</Option>
                                </Select>

                                <br />
                                <label htmlFor="">Height</label>
                                <div className='form_input_leftright'>
                                    {/* 5ft 11inch */}
                                    <Input color="success" size="lg" variant="outlined" type="number" placeholder='ft' />
                                    <Input color="success" size="lg" variant="outlined" type="number" placeholder='in' />
                                </div>

                                <button
                                    onClick={() => {
                                        handleSignup()
                                    }}
                                >Signup</button>
                            </form>
                            <p>Already have an account?  <button onClick={() => {
                                setShowSignup(false)
                            }}>Login</button></p>
                        </div>

                    </div>
                ) : (
                    <div className='authform'>
                        <div className='left'>
                            <Image src={logo} alt="Logo" />
                        </div>
                        <div className='right'>
                            <h1>Login to become a Fit-योगी</h1>
                            <form action="">
                                <Input
                                    color="success"
                                    placeholder="Email ID"
                                    size="lg"
                                    variant="outlined"
                                />

                                <Input
                                    color="success"
                                    placeholder="Password"
                                    size="lg"
                                    variant="outlined"
                                    type='password'
                                />
                                <button
                                    onClick={() => {
                                        handleLogin()
                                    }}
                                >Login</button>
                            </form>
                            <p>Don't have an account?  <button onClick={() => {
                                setShowSignup(true)
                            }}>Signup</button></p>
                        </div>

                    </div>
                )
            }
        </div>
    )
}

export default AuthPopup