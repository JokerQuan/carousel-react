import { useState } from 'react'
import './App.css'
import Carousel from './components/Carousel'

function App() {
  const childrenData = [{
    link: "https://www.bing.com",
  }, {
    link: "https://www.youtube.com",
  }, {
    link: "https://www.github.com",
  }, {
    link: "https://www.google.com",
  }, {
    link: "https://www.facebook.com",
  }]

  return (
    <div className="app">
      <Carousel
        width={"30%"} 
        height={"300px"} 
        pauseDuration={1000}
        slideDuration={500}
        direction={1}
        autoPlay={true}
        pauseOnHover={true}
        tweenAnime="ease"
        onItemClick={item => console.log(item)}
      >
        {
          childrenData.map((item, index) => (
            <div key={item.link} style={{backgroundColor:"#cdcdcd", height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
              <h1>{index}</h1>
            </div>
          ))
        }
      </Carousel>
      <Carousel
        width={"30%"} 
        height={"300px"} 
        pauseDuration={1000}
        slideDuration={500}
        direction={1}
        autoPlay={true}
        pauseOnHover={true}
        tweenAnime="ease"
        orientation='vertical'
        onItemClick={item => console.log(item)}
      >
        {
          childrenData.map((item, index) => (
            <div key={item.link} style={{backgroundColor:"#cdcdcd", height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
              <h1>{index}</h1>
            </div>
          ))
        }
      </Carousel>
    </div>
  )
}

export default App
