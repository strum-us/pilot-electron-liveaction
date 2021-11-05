import React, { useEffect, useRef, useState } from 'react'

type Rect = { x: number, y: number, width: number, height: number }
type Point = { x: number, y: number }
type CursorDataType = { rect: Rect, pos: Point }

let cursorTimeId = null
export function CaptureHome() {
  const containerBounds = useRef<DOMRect>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    containerBounds.current = containerRef.current.getBoundingClientRect()
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (cursorTimeId) {
      clearTimeout(cursorTimeId)
      cursorTimeId = null
    }

    cursorTimeId = setTimeout(() => {
      const cursorData: CursorDataType = {
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
      const electron = require('electron')
      electron.ipcRenderer.send('cursor-update', cursorData)
    }, 60);
  }

  return (
    <div ref={containerRef} className='w-screen h-screen bg-blue-300' onMouseMove={handleMouseMove}>
      capture
    </div>
  )
}

// ########################################################################
// ########################################################################
// ########################################################################
