import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Carousel from './components/Carousel'

function App() {
  const imgData = [{
    link: "https://www.bing.com",
    src: "https://img.alicdn.com/imgextra/i1/6000000002041/O1CN01Dw6SBo1QwpAedJV7p_!!6000000002041-0-octopus.jpg",
  }, {
    link: "https://www.youtube.com",
    src: "https://img.alicdn.com/imgextra/i2/6000000003292/O1CN0148GwRI1aBmeLAqrab_!!6000000003292-0-octopus.jpg",
  }, {
    link: "https://www.github.com",
    src: "https://img.alicdn.com/imgextra/i2/6000000000160/O1CN01ZTeEW51D3KAkJ3ylC_!!6000000000160-0-octopus.jpg",
  }, {
    link: "https://www.google.com",
    src: "https://img.alicdn.com/imgextra/i2/6000000003159/O1CN01dTNCKU1ZCrySxTRtj_!!6000000003159-2-octopus.png",
  }, {
    link: "https://www.facebook.com",
    src: "https://img.alicdn.com/imgextra/i4/6000000003767/O1CN01KUtSXc1dhKmYeYeIK_!!6000000003767-2-octopus.png",
  }]

  return (
    <div className="app">
      <Carousel 
        data={imgData} 
        width={500} 
        height={300} 
        pauseDuration={1000}
        slideDuration={500}
        direction={1}
        autoPlay={true}
        pauseOnHover={true}
        tweenAnime="ease"
        onItemClick={item => window.open(item.link)} />
    </div>
  )
}

export default App
