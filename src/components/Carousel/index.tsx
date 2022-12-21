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
  pauseOnHover?: boolean;
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
    pauseOnHover = true,
    tweenAnime = "ease",
  } = props
  const [current, setCurrent] = useState(direction === 1 ? 1 : data.length)
  const pauseRef = useRef(false)
  const leftRef = useRef(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const dataRef = useRef([
    data[data.length - 1],
    ...data,
    data[0]
  ])
  const timer = useRef(-1)
  const tweenFn = useMemo(() => {
    if (typeof tweenAnime === "function") {
      return tweenAnime
    } else if (typeof tween[tweenAnime] === "function") {
      return tween[tweenAnime]
    } else {
      return tween.ease
    }
  }, [tweenAnime])

  const init = () => {
    if (direction === 1) {
      leftRef.current = width
    } else {
      leftRef.current = (dataRef.current.length - 2) * width
    }
    sliderRef.current!.style.left = `${-leftRef.current}px`
  }

  useEffect(init, [])

  useEffect(() => {
    go(current)
    return () => clearTimeout(timer.current)
  }, [current])

  const go = (index: number) => {
    const startTime = Date.now()
    //begin value
    const b = leftRef.current
    //change value
    const c = index * width - leftRef.current
    if (c === 0) {
      calcNext()
      return;
    }
    const anim = () => {
      const currTime = Math.min(slideDuration, Date.now() - startTime)
      leftRef.current = tweenFn(currTime, b, c, slideDuration)
      if (currTime === slideDuration) {
        // animation end, start next timer
        calcNext()
      } else {
        sliderRef.current!.style.left = `${-leftRef.current}px`
        requestAnimationFrame(anim)
      }
    }
    anim()
  }

  const calcNext = () => {
    if (pauseOnHover && pauseRef.current) return;
    if (leftRef.current >= (dataRef.current.length - 1) * width && direction === 1) {
      leftRef.current = width
      sliderRef.current!.style.left = `${-leftRef.current}px`
      setCurrent(1)
    } else if (leftRef.current <= 0 && direction === -1) {
      leftRef.current = (dataRef.current!.length - 2) * width
      sliderRef.current!.style.left = `${-leftRef.current}px`
      setCurrent(dataRef.current!.length - 2)
    } else {
      updateCurrentDelay(leftRef.current / width + direction)
    }
  }

  const updateCurrentDelay = (v: number) => {
    timer.current = setTimeout(() => setCurrent(v), pauseDuration)
  }

  const pauseTimer = () => {
    if (!pauseOnHover) return;
    pauseRef.current = true
    clearTimeout(timer.current)
    timer.current = -1
  }

  const resumeTimer = () => {
    if (!pauseOnHover) return;
    pauseRef.current = false
    calcNext()
  }

  return (
    <div className='carousel' style={{width: `${width}px`, height: `${height}px`}}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
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
