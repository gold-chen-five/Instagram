import React, { useState , useEffect} from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'
import { db, storage } from '../../../firebase.js'
import firebase from 'firebase'
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';

function ImageUpload({username,email}) {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [avatar,setAvatar] = useState({})
    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }
    
    useEffect(() => {
        //get avatar image
        db.collection('user').doc(email).get().then((doc) => {
            setAvatar(doc.data())
        })
    },[])

    const handleUpload = () => {
        //store the post
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on('state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          }, 
          (error) => {
            // Handle unsuccessful uploads
          },
            () => {
                //complete funtion
            storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
                //post image inside db
                db.collection("post").doc().set({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl: url,
                    username: username,
                    avatar: avatar.avatar,
                    heart: 0
                })

                db.collection("user").doc(email).collection("post").doc().set({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl: url,
                    username: username,
                    heart: 0
                })

                setCaption('')
                setImage(null)
            })
          } 
        )
       
    }
    return (
        <Container>
            <Label>
                <AddToPhotosIcon style={{color: 'rgb(0,149,246)',opacity: '0.8'}}/>
                <div>上傳照片</div>
                <ImageFile type="file" onChange={handleChange}/>
            </Label>
            <Caption type="text" placeholder="加上解說..." onChange={event => setCaption(event.target.value)} />
            <Button onClick={handleUpload} style={{width:'30px',backgroundColor: 'rgb(0,149,246)',color: 'white',opacity: '0.8'}} >分享</Button>
        </Container>
    )
}

export default ImageUpload

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
`
const Label = styled.label`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    cursor: pointer;
    div {
        padding: 5px;
        color: rgb(0,149,246);
    }
`
const Caption = styled.textarea`
    height: 200px;
    margin-bottom: 20px;
    border-radius: 4px;
    border:1px solid lightgray;
`

const ImageFile = styled.input`
    display: none;
`
