import React, { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import tween from './tween';

export interface ImgData {
  link?: string;
  src: string;
}

export interface ICarouselProps {
  data: Array<ImgData>;
  width: number;
  height: number;
  pauseDuration?: number;
  slideDuration?: number;
  tweenAnime?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | Function
}

export default function Carousel(props: ICarouselProps) {
  const { 
    data,
    width,
    height,
    pauseDuration = 2000,
    slideDuration = 1000,
    tweenAnime = "ease",
  } = props
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null)
  const timer = useRef(0)
  const tweenFn = useMemo(() => {
    if (typeof tweenAnime === "function") {
      return tweenAnime
    } else if (typeof tween[tweenAnime] === "function") {
      return tween[tweenAnime]
    } else {
      return tween.ease
    }
  }, [tweenAnime])
  useEffect(() => {
    timer.current = setTimeout(next, pauseDuration)
    return () => clearTimeout(timer.current)
  }, [current])

  const next = () => {
    go(current + 1)
  }

  const go = (index: number) => {
    const startTime = Date.now()
    let progress = 0
    //begin value
    const b = current * width
    //change value
    const c = (index - current) * width
    const anim = () => {
      const currTime = Math.min(slideDuration, Date.now() - startTime)
      progress = tweenFn(currTime, b, c, slideDuration)
      console.log(currTime);
      
      if (currTime < slideDuration) {
        sliderRef.current!.style.left = `${-progress}px`
        requestAnimationFrame(anim)
      } else {
        // animation end, start next timer
        setCurrent(index)
      }
    }
    anim()
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
