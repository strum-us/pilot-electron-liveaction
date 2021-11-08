import React, { useEffect, useRef, useState } from 'react'

type Rect = { x: number, y: number, width: number, height: number }
type Point = { x: number, y: number }
type CursorDataType = { id: number, rect: Rect, pos: Point }

let cursorTimeId = null
export function TempHome() {
  const containerBounds = useRef<DOMRect>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [windowId, setWindowId] = useState<number>(null)

  useEffect(() => {
    containerBounds.current = containerRef.current.getBoundingClientRect()
    const electron = require('electron')
    setWindowId(electron.remote.getCurrentWindow().id)
    console.log(electron.remote.getCurrentWindow().id)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const electron = require('electron')
    if (cursorTimeId) {
      clearTimeout(cursorTimeId)
      cursorTimeId = null
    }

    cursorTimeId = setTimeout(() => {
      const cursorData: CursorDataType = {
        id: windowId,
        rect: {
          x: containerBounds.current.x,
          y: containerBounds.current.y,
          width: containerBounds.current.width,
          height: containerBounds.current.height,
        }, pos: {
          x: e.clientX,
          y: e.clientY
        }
      }
      electron.ipcRenderer.send('cursor-update', cursorData)
    }, 32);
  }


  return (
    <div ref={containerRef}
      className='relative w-screen h-screen overflow-hidden'
      onMouseMove={handleMouseMove}
    >
      <CursorItem
        containerBounds={containerBounds}
        windowId={windowId}
      />
    </div>
  )
}

export function CursorItem({ containerBounds, windowId }) {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const electron = require('electron')
    const cursorSize = 80
    const listener = (event, args) => {
      const cursorData: CursorDataType = args
      console.log(args, cursorData.id, windowId, cursorData.id === windowId)
      if (cursorData.id === windowId) {
        return
      }
      const hov = cursorData.rect.height / cursorData.rect.width
      const x = cursorData.pos.x / cursorData.rect.width * containerBounds.current.width
      const y = cursorData.pos.y / cursorData.rect.height * containerBounds.current.width * hov
      cursorRef.current.style.left = `${x - (cursorSize * 0.5)}px`
      cursorRef.current.style.top = `${y - (cursorSize * 0.5)}px`
    }

    electron.ipcRenderer.addListener('cursor-updated', listener)
    return () => {
      electron.ipcRenderer.removeListener('cursor-updated', listener)
    }
  }, [windowId])

  return (
    <div ref={cursorRef} className={' absolute t-0 y-0'} style={{ transition: 'left 0.5s, top 0.5s, transform 0.5s, opacity 0.5s ease 0s' }}>
      <div className='relative flex flex-row items-center justify-center w-20 h-20 text-sm font-bold text-white bg-opacity-50 border-2 border-white rounded-full bg-secondary'>
        <div className='absolute w-12 h-12 bg-opacity-50 rounded-full bg-secondary left-3.5 top-3.5 '>
        </div>

        <div className='absolute text-white left-10 top-10'>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L9.10526 23L11.4801 15.8743C11.8212 14.851 12.3958 13.9212 13.1585 13.1585C13.9212 12.3958 14.851 11.8212 15.8743 11.4801L23 9.10526L1 1Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className='absolute w-max-max left-14 top-12'>
          {windowId}
        </div>
      </div>
    </div>
  )
}