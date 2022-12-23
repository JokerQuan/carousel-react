import React, { 
  FunctionComponent,
  MouseEvent,
  useEffect, 
  useMemo,
  useRef,
  useState 
} from 'react'
import './index.css'
import tween from './tween';

export interface ImgData {
  link?: string;
  src: string;
}

export interface ClickedItem {
  index: number,
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
  autoPlay?: boolean;
  tweenAnime?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | Function;
  navButton?: boolean;
  bottomCursor?: boolean;
  bottomCursorColor?: string;
  bottomCursorActiveColor?: string;
  draggable?: boolean;
  dragthreshold?: number;
  onItemClick?: (item: ClickedItem) => void;
}

const Carousel: FunctionComponent<ICarouselProps> = (props) => {
  const { 
    data,
    width,
    height,
    pauseDuration = 2000,
    slideDuration = 1000,
    direction = 1,
    pauseOnHover = true,
    autoPlay = true,
    tweenAnime = "ease",
    navButton = true,
    bottomCursor = true,
    bottomCursorColor = "#ffffff",
    bottomCursorActiveColor = "#1677ff",
    draggable = true,
    dragthreshold = 150,
    onItemClick,
  } = props
  const [current, setCurrent] = useState(direction === 1 ? 1 : data.length)
  const pauseRef = useRef(false)
  const leftRef = useRef(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const slidingRef = useRef(false)
  const rafRef = useRef(-1)
  const dataRef = useRef([
    data[data.length - 1],
    ...data,
    data[0]
  ])
  const timer = useRef(-1)
  const mouseDownClientXRef = useRef(-1)
  const mouseMoveClientXRef = useRef(0)
  const preventClick = useRef(false)
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
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    const startTime = Date.now()
    //begin value
    const b = leftRef.current
    //change value
    const c = index * width - leftRef.current
    if (c === 0) {
      calcNext()
      return;
    }
    slidingRef.current = true
    const anim = () => {
      const currTime = Math.min(slideDuration, Date.now() - startTime)
      leftRef.current = tweenFn(currTime, b, c, slideDuration)
      if (leftRef.current !== b + c) {
        sliderRef.current!.style.left = `${-leftRef.current}px`
        rafRef.current = requestAnimationFrame(anim)
      } else {
        slidingRef.current = false
        // animation end, start next timer
        calcNext()
      }
    }
    anim()
  }

  const calcNext = () => {
    if (leftRef.current >= (dataRef.current.length - 1) * width) {
      leftRef.current = width
      sliderRef.current!.style.left = `${-leftRef.current}px`
      updateCurrent(1)
    } else if (leftRef.current <= 0) {
      leftRef.current = (dataRef.current!.length - 2) * width
      sliderRef.current!.style.left = `${-leftRef.current}px`
      updateCurrent(dataRef.current!.length - 2)
    } else {
      // calculate autoplay and pause
      if (autoPlay) {
        if (!pauseOnHover || (pauseOnHover && !pauseRef.current)) {
          updateCurrentDelay(Math.floor(leftRef.current / width) + direction)
        }
      }
    }
  }

  const updateCurrent = (next: number) => {
    setCurrent(next)
  }

  const updateCurrentDelay = (next: number) => {
    timer.current = setTimeout(() => setCurrent(next), pauseDuration)
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
    if (!slidingRef.current) {
      calcNext()
    }
  }

  const goPrev = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (slidingRef.current) return;
    setCurrent(current - 1)
  }

  const goNext = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (slidingRef.current) return;
    setCurrent(current + 1)
  }

  const isCursorActive = (cursorIndex: number) : boolean => {
    if (current === cursorIndex + 1) {
      return true
    }
    if (current <= 0 && cursorIndex == dataRef.current.length - 3) {
      return true
    }
    if (current >= dataRef.current.length - 1 && cursorIndex === 0) {
      return true
    }
    return false
  }

  const handleCursorClick = (cursorIndex: number) => {
    setCurrent(cursorIndex + 1)
  }

  const handleMouseDown = (e: MouseEvent) => {
    if (!draggable) return;
    e.preventDefault()
    e.stopPropagation()
    mouseDownClientXRef.current = e.clientX
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggable) return;
    if (mouseDownClientXRef.current === -1) return;
    preventClick.current = true
    mouseMoveClientXRef.current = e.clientX
    const offset = mouseMoveClientXRef.current - mouseDownClientXRef.current
    sliderRef.current!.style.left = `${-(leftRef.current - offset)}px`
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (!draggable) return;
    if (mouseMoveClientXRef.current === 0) {
      mouseDownClientXRef.current = -1
      return;
    }
    handleSlideEnd()
  }

  const handleMouseLeave = (e: MouseEvent) => {
    if (mouseMoveClientXRef.current === 0) {
      mouseDownClientXRef.current = -1
      resumeTimer()
      return;
    }
    pauseRef.current = false
    handleSlideEnd()
  }

  const handleSlideEnd = () => {
    const offset = mouseMoveClientXRef.current - mouseDownClientXRef.current
    leftRef.current = leftRef.current - offset
    if (Math.abs(offset) >= dragthreshold) {
      setCurrent(current - Math.abs(offset) / offset)
    } else {
      go(current)
    }
    mouseDownClientXRef.current = -1
    mouseMoveClientXRef.current = 0
  }

  const handleItemClick = (index: number) => {
    if (preventClick.current) {
      preventClick.current = false
      return;
    }
    if (typeof onItemClick === "function") {
      const item = {...dataRef.current[index]} as ClickedItem
      if (index === 0) {
        item.index = dataRef.current.length - 2
      } else if (index === dataRef.current.length - 1) {
        item.index = 0
      } else {
        item.index = index - 1
      }
      onItemClick(item)
    }
  }

  return (
    <div className='carousel' style={{width: `${width}px`, height: `${height}px`}}
      onMouseEnter={pauseTimer}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className='slider' ref={sliderRef} style={{width: `${dataRef.current.length * width}px`}}>
        {
          dataRef.current.map((img, index) => (
            <div key={index} className="slice" onClick={() => handleItemClick(index)}>
              <img src={img.src} alt="" width={width} height={height}/>
            </div>
          ))
        }
      </div>
      {
        navButton && 
        <>
          <div className='nav-btn left' onClick={goPrev}
            onMouseUp={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            onMouseMove={e => e.stopPropagation()}
            ></div>
          <div className='nav-btn right' onClick={goNext}
            onMouseUp={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            onMouseMove={e => e.stopPropagation()}
          ></div>
        </>
      }
      {
        bottomCursor &&
        <div className='bottom-cursor'>
          {
            data.map((_, index) => (
              <div key={index} className={isCursorActive(index) ? "active" : ""}
                onClick={() => handleCursorClick(index)}
                style={{backgroundColor: isCursorActive(index) ? bottomCursorActiveColor : bottomCursorColor}}
              ></div>
            ))
          }
        </div>
      }
    </div>
  )
}

export default Carousel