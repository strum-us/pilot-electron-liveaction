import React, { useEffect, useRef, useState } from 'react'

type Rect = { x: number, y: number, width: number, height: number }
type Point = { x: number, y: number }
type CursorDataType = { rect: Rect, pos: Point }

export function TempHome() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const containerBounds = useRef<DOMRect>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    containerBounds.current = containerRef.current.getBoundingClientRect()
  }, [])

  useEffect(() => {
    const electron = require('electron')
    electron.ipcRenderer.on('cursor-updated', (event, args) => {
      const cursorData: CursorDataType = args
      const hov = cursorData.rect.height / cursorData.rect.width
      const x = cursorData.pos.x / cursorData.rect.width * containerBounds.current.width
      const y = cursorData.pos.y / cursorData.rect.height * containerBounds.current.width * hov
      cursorRef.current.style.left = `${x - 20}px`
      cursorRef.current.style.top = `${y - 20}px`
    })

  }, [])

  return (
    <div ref={containerRef} className='relative w-screen h-screen overflow-hidden'>
      <div ref={cursorRef} className={' absolute t-0 y-0'} style={{ transition: 'left 0.5s, top 0.5s, transform 0.5s, opacity 0.5s ease 0s' }}>
        <div className='flex flex-row items-center justify-center w-10 h-10 text-white bg-black rounded-full bg-opacity-30'>
          YOON
        </div>
      </div>
    </div>
  )
}

// ########################################################################
// ########################################################################
// ########################################################################
