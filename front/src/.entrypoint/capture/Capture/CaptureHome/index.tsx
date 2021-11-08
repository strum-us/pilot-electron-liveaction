import React, { useEffect, useRef, useState } from 'react'

import { CursorItem } from '../../../temp/Temp/TempHome'

type Rect = { x: number, y: number, width: number, height: number }
type Point = { x: number, y: number }
type CursorDataType = { id: number, rect: Rect, pos: Point }

let cursorTimeId = null
export function CaptureHome() {
  const containerBounds = useRef<DOMRect>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [windowId, setWindowId] = useState<number>(null)

  useEffect(() => {
    containerBounds.current = containerRef.current.getBoundingClientRect()
    const electron = require('electron')
    setWindowId(electron.remote.getCurrentWindow().id)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const electron = require('electron')
    if (cursorTimeId) {
      clearTimeout(cursorTimeId)
      cursorTimeId = null
    }

    cursorTimeId = setTimeout(() => {
      const cursorData: CursorDataType = {
        id: electron.remote.getCurrentWindow().id,
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
      onMouseMove={handleMouseMove}>
      <CursorItem
        containerBounds={containerBounds}
        windowId={windowId}
      />
    </div>
  )
}
