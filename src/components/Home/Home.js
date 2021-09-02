import React from 'react'
import styled from 'styled-components'
import Post from './Post/Post.js'


function Home({user, post}) {
    
    return (
    <PostContainer>
        {
             post.map(item => (
                <Post 
                    post={post}
                    user={user} 
                    id={item.id} 
                    username={item.post.username} 
                    caption={item.post.caption} 
                    imageURL={item.post.imageUrl}
                    avatar={item.post.avatar} 
                    heartNum={item.post.heart}
                />
            ))
        }
     </PostContainer>
    )
}

export default Home

const PostContainer = styled.div`
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;  
    flex-shrink: 0;
    width: 500px;
    margin: 0 auto;
    @media screen and (max-width: 600px){
        width: 100%;
    }
`
