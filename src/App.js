import React, { useEffect, useState} from 'react'

//hello
function App() {

  const [backendData, setBackendData] = useState([{}]) //i dont really understand this but it sets the backend data

  //this function fetches the api
  useEffect(() => {
    fetch("/api").then(
      response => response.json() //storing the response as a json
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])

  return (
    //just testing out the fetched api to see if data moved to the front end
    //areeb is really so cool
   
    <div>
      {(typeof backendData.users === 'undefined') ? (
        <p>loading.... Areeb is so cooooool</p>
      ): (
        backendData.users.map((user,i) => (
          <p key={i}>{user}</p>
        ))
      )}
      <p>also areeb is soooo coooool B) </p> 
    </div>
  )
}

export default App