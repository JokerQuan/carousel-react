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
  direction?: 1 | -1;
  tweenAnime?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | Function
}

export default function Carousel(props: ICarouselProps) {
  const { 
    data,
    width,
    height,
    pauseDuration = 2000,
    slideDuration = 1000,
    direction = 1,
    tweenAnime = "ease",
  } = props
  const [current, setCurrent] = useState(direction === 1 ? 1 : data.length);
  const sliderRef = useRef<HTMLDivElement>(null)
  const dataRef = useRef([
    data[data.length - 1],
    ...data,
    data[0]
  ])
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
    if (direction === 1) {
      sliderRef.current!.style.left = `${-width}px`
    } else {
      sliderRef.current!.style.left = `${- (dataRef.current.length - 2) * width}px`
    }
  }, [])

  useEffect(() => {
    timer.current = setTimeout(next, pauseDuration)
    return () => clearTimeout(timer.current)
  }, [current])

  const next = () => {
    go(current + direction)
  }

  const go = (index: number) => {
    const startTime = Date.now()
    let left = 0
    //begin value
    const b = current * width
    //change value
    const c = (index - current) * width
    const anim = () => {
      const currTime = Math.min(slideDuration, Date.now() - startTime)
      left = tweenFn(currTime, b, c, slideDuration)
      if (currTime < slideDuration) {
        sliderRef.current!.style.left = `${-left}px`
        requestAnimationFrame(anim)
      } else {
        // animation end, start next timer
        calcNext(left)
      }
    }
    anim()
  }

  const calcNext = (left: number) => {
    if (left === (dataRef.current.length - 1) * width && direction === 1) {
      sliderRef.current!.style.left = `${-width}px`
      setCurrent(1)
    } else if (left === 0 && direction === -1) {
      sliderRef.current!.style.left = `${- (dataRef.current!.length - 2) * width}px`
      setCurrent(dataRef.current!.length - 2)
    } else {
      setCurrent(current + direction)
    }
  }

  return (
    <div className='carousel' style={{width: `${width}px`, height: `${height}px`}}>
      <div className='slider' ref={sliderRef} style={{width: `${dataRef.current.length * width}px`}}>
        {
          dataRef.current.map((img, index) => (
            <div key={index} className="slice">
              <img src={img.src} alt="" width={width} height={height}/>
            </div>
          ))
        }
      </div>
    </div>
  )
}
