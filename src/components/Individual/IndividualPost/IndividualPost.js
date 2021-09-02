import React from 'react'
import styled from 'styled-components'
function IndividualPost({imageUrl}) {
    return (
        <Container>
            <PostImage src={imageUrl}/>
        </Container>
    )
}

export default IndividualPost

const Container = styled.div`
    margin: 1% 1% 0 1%;
    width: 30%;
    height: 10%;
`
const PostImage = styled.img`
    object-fit: contain;
    width: 100%;
`