import './App.css';
import styled from 'styled-components'
import Header from './components/Header/Header.js'
import Home from './components/Home/Home.js'
import BottomHome from './components/BottomHome/BottomHome.js'
import Individual from './components/Individual/Individual.js'
import React ,{ useState , useEffect} from 'react'
import { db, auth } from './firebase.js'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  
  const [username,setUsername] = useState('')
  const [post,setPost] = useState([])
  const [user,setUser] = useState(null)
  
  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user logged in 
        setUser(authUser)
      }else{
        //user logged out
        setUser(null)
      }
    })
    return () => {
      // perform some cleanup actions
      unsubscribe()
    }
  },[user,username])

  const getDB = () =>{
    db.collection('post').orderBy('timestamp','desc').onSnapshot((snapshot) => {
      let test = snapshot.docs.map(doc => ({
        id:doc.id,
        post:doc.data()
      }))
      setPost(test)
    })
  }

  useEffect(() =>{
    getDB()
  },[])


  return (
    <Router>
      <Container >
        { /* header */}
        <Header user={user} auth={auth} setUsername={setUsername} username={username}/>
        
        <Switch>
          {
            user?(
              <Route path="/individual">
                <IndividualContainer>
                  <Individual email={user.email}/>
                </IndividualContainer>
              </Route>
            ):null
          }
          

          <Route path="/">
            <HomeContainer>
              <Home user={user} post={post}/>
            </HomeContainer>
          </Route>

        </Switch>
        {
              user?(<BottomHome user={user} email={user.email}/>):null
        }
      </Container>
    </Router>
  );
}

export default App;

const Container = styled.div`
  background-color: #FAFAFA;
  min-height: 100vh;
  width: 100%;

`
const IndividualContainer = styled.div`
  width: 750px;
  margin: 0 auto;
  @media screen and (max-width: 768px){
    width: 100%;
  }
`
const HomeContainer = styled.div`
  width: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 999px){
    justify-content: center;
  }
  @media screen and (max-width: 600px){
    width: 100%;
  }
`

