import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Carousel from './components/Carousel'

function App() {
  const imgData = [{
    link: "https://www.baidu.com",
    src: "https://img.alicdn.com/imgextra/i1/6000000002041/O1CN01Dw6SBo1QwpAedJV7p_!!6000000002041-0-octopus.jpg",
  }, {
    link: "https://www.zhihu.com",
    src: "https://img.alicdn.com/imgextra/i2/6000000003292/O1CN0148GwRI1aBmeLAqrab_!!6000000003292-0-octopus.jpg",
  }, {
    link: "https://www.github.com",
    src: "https://img.alicdn.com/imgextra/i2/6000000000160/O1CN01ZTeEW51D3KAkJ3ylC_!!6000000000160-0-octopus.jpg",
  }, {
    link: "https://www.google.com",
    src: "https://img.alicdn.com/imgextra/i2/6000000003159/O1CN01dTNCKU1ZCrySxTRtj_!!6000000003159-2-octopus.png",
  }, {
    link: "https://www.weibo.com",
    src: "https://img.alicdn.com/imgextra/i4/6000000003767/O1CN01KUtSXc1dhKmYeYeIK_!!6000000003767-2-octopus.png",
  }]

  return (
    <div className="app">
      <Carousel data={imgData} width={550} height={300} tweenAnime="ease" />
    </div>
  )
}

export default App
