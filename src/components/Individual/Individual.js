import React ,{ useState , useEffect} from 'react'
import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
import {Button,Input} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import { db, storage } from '../../firebase.js'
import firebase from 'firebase'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IndividualPost from './IndividualPost/IndividualPost.js'
// modal code from https://material-ui.com/components/modal/#modal
  
const useStyles = makeStyles((theme) => ({
    paper: {
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #000',
      boxShadow: theme.shadows[5],
      borderRadius: '10px',
      '@media screen and (max-width: 768px)': {
        width: '60%'
      },
    },
}));

function Individual({email}) {
    const classes = useStyles()
    const [openModal,setOpenModal] = useState(false)
    const [avatarImg,setAvatarImg] = useState(null)
    const [userInfo,setUserInfo] = useState({})
    const [individualPost,setIndividualPost] = useState([])
    const buttonUpload = {
        color: 'rgb(0,149,246)',
        borderBottom: '1px solid lightgray',
        width: '100%',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '@media screen and (max-width: 768px)': {
            color: 'black'
        },
    }
    const buttonDelete = {
        color:'red',
        width: '100%',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
    useEffect(()=>{
        db.collection('user').doc(email).onSnapshot((doc)=>{
            setUserInfo(doc.data())
        })
    },[])

    useEffect(()=>{
        db.collection('user').doc(email).collection('post').orderBy('timestamp','desc').onSnapshot((snapshot) => {
            let data = snapshot.docs.map(doc => ({
              id:doc.id,
              post:doc.data()
            }))
            setIndividualPost(data)
          })
    },[])

    const handleUpload = () => {
        const uploadTask = storage.ref(`avatar/${avatarImg.name}`).put(avatarImg)
        uploadTask.on(
            "state_change",
            () => {
                //complete funtion    
                storage
                    .ref("avatar")
                    .child(avatarImg.name)
                    .getDownloadURL()
                    .then((url) => {
                        //post image inside db
                        db.collection("user").doc(email).update({
                            avatar: url
                        })
                    })
            }
        )
    }

    const changeAvatarImg = (e) => {
        if(e.target.files[0]){
            setAvatarImg(e.target.files[0])
        }
    }

    const deleteAvatar = () =>{
        db.collection('user').doc(email).update({
            avatar: ""
        })
        storage.ref(`avatar/${avatarImg.name}`).delete()
        setAvatarImg(null)
    }

    return (
        <Container>
           <TopContainer>
                <IndividualAvatar>
                    <Avatar style={{height:'120px',width:'120px'}} onClick={() => setOpenModal(true)} src={userInfo.avatar}/>
                </IndividualAvatar>
                <IndividualCaption>
                    <IndividualName>{userInfo.name}</IndividualName>
                </IndividualCaption>
           </TopContainer>
           <BottomContainer>
                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                >
                    <ModalCenter className={classes.paper}>
                        <ModalContainer>
                            <ModalTitle>變更大頭貼</ModalTitle>
                            <Label>
                                <Input type="file" onChange={changeAvatarImg} style={{display: 'none'}}/>
                                <UploadAvatar>選擇相片</UploadAvatar>
                            </Label>
                            <Button style={buttonUpload} onClick={handleUpload}>上傳相片</Button>
                            <Button style={buttonDelete} onClick={deleteAvatar}>刪除目前大頭貼照</Button>
                        </ModalContainer>
                    </ModalCenter>
                </Modal>
                
                <PostContainer> 
                    {
                        individualPost.map(item => (
                            <IndividualPost imageUrl={item.post.imageUrl}/>
                        ))
                    }
                </PostContainer>
           </BottomContainer>
           
        </Container>
    )
}

export default Individual

const Container = styled.div`
    min-height: 100vh;
`
const TopContainer = styled.div`
    display: flex;
    align-items: center;
    height: 230px;
    border-bottom: 1px solid lightgray;
    padding: 10px;
    margin: 20px;
    @media screen and (max-width: 768px){
        height: 150px;
    }
`
const IndividualAvatar = styled.div`
    margin-right: 10%;
`
const IndividualCaption = styled.div`
`
const IndividualName = styled.div`
    font-size: 40px;
    font-weight: lighter;
    opacity: 0.8;
    padding-bottom: 40px;
`

const BottomContainer = styled.div`
`

const ModalCenter = styled.div` 
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
`
const ModalContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`

const ModalTitle = styled.div`
    border-bottom: 1px solid lightgray;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 480px){
        //height: 20px;
    }
`
const Label = styled.label`
    display: flex;
    //flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid lightgray;
    width: 100%;
    height: 50px;
    @media screen and (max-width: 480px){
        //height: 20px;
    }
`
const UploadAvatar = styled.div`
    color: rgb(0,149,246);
    font-size: 15px;
    //margin-bottom: 30px;
`
const PostContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding-left: 5%;
`