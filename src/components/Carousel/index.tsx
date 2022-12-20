import React, { useEffect, useRef, useState } from 'react'
import './index.css'

export interface ImgData {
  link?: string;
  src: string;
}

export interface ICarouselProps {
  data: Array<ImgData>;
  width: number;
  height: number;
}

export default function Carousel(props: ICarouselProps) {
  const { data, width, height } = props
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null)
  const timer = useRef(0)
  useEffect(() => {
    timer.current = setTimeout(next, 2000)
    return () => clearTimeout(timer.current)
  }, [current])

  const next = () => {
    go(current + 1)
  }

  const go = (index: number) => {
    sliderRef.current!.style.transition = `ease 1s`
    sliderRef.current!.style.transform = `translateX(${- index * width}px)`
    setCurrent(index)
  }

  return (
    <div className='carousel' style={{width: `${width}px`, height: `${height}px`}}>
      <div className='slider' ref={sliderRef} style={{width: `${data.length * width}px`}}>
      {
        data.map(img => (
          <div key={img.src} className="slice">
            <img src={img.src} alt="" width={width} height={height}/>
          </div>
        ))
      }
      </div>
    </div>
  )
}
