import React ,{useState,useEffect}from 'react'
import styled from 'styled-components'
import ImageUpload from './ImageUpload/ImageUpload'
import Avatar from '@material-ui/core/Avatar'
import {Link} from "react-router-dom"
import { db } from '../../firebase.js'
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';

function BottomHome({user,email}) {
    const [userInfo,setUserInfo] = useState({})
    const [addBoxOnclick,setAddBoxOnclick] = useState(false)

    useEffect(()=>{
        db.collection('user').doc(email).onSnapshot((doc)=>{
            setUserInfo(doc.data())
        })
    },[])

    const modal = document.getElementById("myModal")
    window.onclick = (event) => {
        if(event.target == modal){
            setAddBoxOnclick(false)
        }
	}

    return (
        <Container>
            <LoginContainer>
                <HomeLink to="/">
                    <HomeOutlinedIcon/>
                </HomeLink>
                    
                <AddBoxOutlinedIcon onClick={()=>setAddBoxOnclick(!addBoxOnclick)}/>

                <AvatarLink to="/individual">
                    <Avatar style={{height:'30px',width:'30px'}} src={userInfo.avatar} />
                </AvatarLink>
                
            </LoginContainer>
            <Upload display={addBoxOnclick} id="myModal">
                <ModalContent>
                    <ImageUpload username={user.displayName} email={email}/>
                </ModalContent>
            </Upload>
        </Container>
    )
}

export default BottomHome
const Container = styled.div`
    position: sticky;
    bottom: 0;
    z-index: 1;
    background-color: white;
    border-top: 1px solid lightgray;
    height: 20px;
    padding: 10px;
    @media screen and (max-width: 480px){
        height: 40px;
    }
`
const LoginContainer = styled.div`
    width: 600px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    @media screen and (max-width: 1400px){
    }
    @media screen and (max-width: 999px){
    }
    @media screen and (max-width: 768px){
        width: 100%;
    }
`
const HomeLink = styled(Link)`
    color: black;
`
const AvatarLink = styled(Link)`
`
const Upload = styled.div`
    display: ${({display}) => (display ? 'block' : 'none')};
    position: fixed; 
    z-index: 1; 
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgb(0,0,0); 
    background-color: rgba(0,0,0,0.4); 
    animation: fadeIn 0.4s;
`
const ModalContent = styled.div`
    position: fixed;
    bottom: 0;
    background-color: white;
    left: 50%;
    transform: translate(-50%,0);
    border: 1px solid lightgray;
    width: 300px;
    border-radius: 10px;
    padding: 20px; 
    animation: slideIn 0.6s;
`
