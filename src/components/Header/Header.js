import styled from 'styled-components'
import React ,{ useState } from 'react'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import {Button,Input} from '@material-ui/core'
import {Link} from "react-router-dom";
import { db } from '../../firebase.js'
import logoImg from '../../images/insImg.png'

// modal code from https://material-ui.com/components/modal/#modal
  
const useStyles = makeStyles((theme) => ({
    paper: {
      borderRadius: '10px',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      '@media screen and (max-width: 768px)':{
          width: '60%'
      },
    },
  }));


function Header({user,auth,setUsername,username}) {

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const classes = useStyles()

    const [openSignIn, setOpenSignIn] = useState(false)
    const [open,setOpen] = useState(false)

    const signUpDB = (event) => {
        event.preventDefault()
        const newUser = db.collection('user').doc(email)
        newUser.get().then((doc) => {
            if(doc.exist){
            }else{
                newUser.set({
                    avatar: '',
                    name: username
                }).then(()=>{
                    signUpAuth()
                })
            }     
        })
    }

    const signUpAuth = () =>{
        auth.createUserWithEmailAndPassword(email,password)
        .then((authUser) => {
            return authUser.user.updateProfile({
                displayName: username
            })
        })
        .catch((error) => alert(error.message))
    }
    
    const signIn = (event) => {
        event.preventDefault()
        auth.signInWithEmailAndPassword(email,password)
        .catch((error)=>alert(error.message))
        setOpenSignIn(false)
    }

    return (
        <Container>
            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(false)}
            >
                <ModalCenter className={classes.paper}>
                    <ModalContainer>
                        <ModalImg src={logoImg}/>
                        <Input
                            type="text"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="text"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button onClick={signIn}>sign in</Button>
                    </ModalContainer>
                </ModalCenter>
            </Modal>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <ModalCenter className={classes.paper}>
                    <ModalContainer>
                        <ModalImg src={logoImg}/>
                        <Input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            type="text"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="text"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button onClick={signUpDB}>sign up</Button>
                    </ModalContainer>
                </ModalCenter>
               
            </Modal>
            <HeaderItem>
                <LogoLink to="/">
                    <LogoImg src={logoImg}/>
                </LogoLink>
                
                {/* login logout*/}
                <LoginOrLogout>
                {
                    user ? (
                    <LogoutLink to='/'>
                        <Button onClick={() => auth.signOut()}>logout</Button>
                    </LogoutLink>
                    
                    ):(
                    <div>
                        <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
                        <Button onClick={() => setOpen(true)}>Sign up</Button>
                    </div>  
                    )
                }
                </LoginOrLogout>
            </HeaderItem>
        </Container>
    )
}

export default Header
const Container = styled.div`
    background-color: white;
    padding: 10px;
    border-bottom: 1px solid #DBDBDB;
    position: sticky;
    top: 0;
    z-index: 1;
    height: 30px;
`
const ModalCenter = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
`
const ModalContainer = styled.form`
    display: flex;
    flex-direction: column;
`
const ModalImg = styled.img`
    object-fit: contain;
    width: 100px;
`
const HeaderItem = styled.div`
    width: 600px;
    margin: 0 auto;
    display: flex;
    height: 100%;
    justify-content: space-between;
    @media screen and (max-width: 768px){
        width: 100%;
    }
`
const LogoLink = styled(Link)`
    display: flex;
    align-items: center;
`
const LogoImg = styled.img`
    object-fit: contain;
    @media screen and (max-width: 768px){
        width: 70%;
    }
`
const LoginOrLogout = styled.div`
    display: flex;
    align-items: center;
`
const LogoutLink = styled(Link)`
    text-decoration: none;
`