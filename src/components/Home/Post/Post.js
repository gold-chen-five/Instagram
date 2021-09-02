import React,{ useState , useEffect}  from 'react'
import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
import { db } from '../../../firebase'
import firebase from 'firebase'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite';
function Post({post,user, id, username, caption, imageURL, avatar, heartNum}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [heart, setHeart] = useState(false)

    const avatarStyle = {
        height: '30px',
        width: '30px'    
    }

    useEffect(() => {
        let unsubscribe
        if(id){
            unsubscribe = db 
                .collection('post')
                .doc(id)
                .collection('comments')
                .orderBy('timestamp','desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }

        return () => {
            unsubscribe()
        }

    }, [id])
    
    const postComment = (event) => {
        event.preventDefault()

        db.collection('post').doc(id).collection('comments').add({
            text: comment,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    const subHeart = () => {
        setHeart(false)
        db.collection('post').doc(id).get().then((doc) => {
            db.collection('post').doc(id).update({
                heart: doc.data().heart -1
            })
        })
        db.collection('post').doc(id).collection('heartMenber').doc(user.email).delete()
    }

    const addHeart = () => {
        setHeart(true)
        db.collection('post').doc(id).get().then((doc) => {
            db.collection('post').doc(id).update({
                heart: doc.data().heart +1
            })
        })

        db.collection('post').doc(id).collection('heartMenber').doc(user.email).set({
            email: user.email,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    useEffect(()=>{
        if(user){
            db.collection('post').doc(id).collection('heartMenber').doc(user.email).get().then((doc) => {
                if(doc.exists){
                    setHeart(true)
                }else{
                    setHeart(false)
                }
            })
        }
    },[user,post])

    return (
        <Container>
            <AvatarContainer>
                <AvatarImg>
                    <Avatar style={avatarStyle} src={avatar}/>
                </AvatarImg>
                <Username>{username}</Username>
            </AvatarContainer>
           
            <PostImage src={imageURL}/>
            {
                user?(
                    <HeartContainer>
                        <HeartCheck display={heart}>
                            <SpaceHeart onClick={addHeart} />    
                        </HeartCheck>  
                        <HeartCheck2 display={heart}>
                            <RedHeart onClick={subHeart} />
                        </HeartCheck2>
                    </HeartContainer>
                ):null
            }

            <HeartNum>{heartNum}個讚</HeartNum>
            

            <PostContainer>
                <PostUsername>{username} </PostUsername>
                <Caption>{caption}</Caption>
            </PostContainer>
            <PostComment>
                {
                    comments.map((data) => (
                        <PostItem><PostName>{data.name}</PostName>{data.text}</PostItem>
                    ))
                }
            </PostComment>
            {
                user ? (
                    <CommentItem>
                        <Comment 
                            type="text"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Postbtn
                            disabled={!comment}
                            type="submit"
                            onClick={postComment}
                        >
                        Post
                        </Postbtn>
                    </CommentItem>
                ):(null)
            }
           
        </Container>
    )
}

export default Post
const Container = styled.div`
    background-color: white;
    border: 1px solid lightgray;
    border-radius: 4px;
    margin-bottom: 20px;
    width: 100%;
`
const AvatarContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
`
const AvatarImg = styled.div`
    margin-right: 10px;
`
const Username = styled.div`
    font-weight: bold;
    font-size: 12px;
`
const PostImage = styled.img`
    object-fit: contain;
    width: 100%;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
`
const HeartContainer = styled.div`
    position: relative;
    padding: 5px 0 0 10px;
`
const HeartCheck = styled.div`
    display: ${({display}) => (display ? 'none' : 'block')};
`
const HeartCheck2 = styled.div`
    display: ${({display}) => (display ? 'block' : 'none')};
`
const RedHeart = styled(FavoriteIcon)`
    color: #ED4956;
    animation: hearthAnimate 0.2s;
`
const SpaceHeart = styled(FavoriteBorderIcon)`
    animation: hearthAnimate 0.2s;
`
const HeartNum = styled.div`
    padding: 5px 0 0 12px;
    font-weight: bold;
    font-size: 12px;
`
const PostContainer = styled.div`
    display: flex;
    padding: 10px 15px ;
`
const PostUsername = styled.div`
    font-weight: bold;
    font-size: 10px; 
    margin-right: 10px;
`
const Caption = styled.div`
    font-weight: normal;
    font-size: 12px;
`
const PostComment = styled.div`
    padding: 0 15px;
`
const PostItem = styled.div`
    display: flex;
    font-size: 12px;
    padding-bottom: 5px;
`
const PostName = styled.div`
    font-weight: bold;
    margin-right: 10px;
`
const CommentItem = styled.form`
    display: flex;
    margin-top: 10px;
`
const Comment = styled.input`
    flex: 1;
    border: none;
    padding: 10px;
    border-top: 1px solid lightgray;
`
const Postbtn = styled.button`
    flex: 0;
    border: none;
    border-top: 1px solid lightgray;
    color: #CDEAFD;
    background-color: transparent;
    padding-right: 10px;
`
