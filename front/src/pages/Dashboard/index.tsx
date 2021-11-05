import React, { useLayoutEffect, useState } from 'react'

export function Dashboard() {
  const [windowSource, setWindowSource] = useState([])

  const updateRect = () => {
    const electron = require('electron')
    electron.screen.screenToDipRect()
  }
  const updateDesktopSource = () => {
    const electron = require('electron')
    electron.desktopCapturer.getSources({ types: ['window'] }).then((source) => {
      // console.log({source})
      setWindowSource(source)
    })
  }

  useLayoutEffect(() => {
    updateDesktopSource()
    let timeId = null

    timeId = setInterval(() => {
      updateDesktopSource()
    }, 10000)

    return () => {
      timeId && clearInterval(timeId)
      timeId = null
    }
  }, [])

  const handleClick = (sourceId: string) => {
    const constraints: any = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          minWidth: 1280,
          minHeight: 720,
          maxWidth: 8000,
          maxHeight: 8000,
        },
      },
    }

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      console.log({ stream })
    })
  }

  // TODO:
  return (
    <div className='flex flex-col w-screen h-screen'>
      <div className='flex-grow-0 w-full h-10 pt-2 pl-20 text-white bg-black drag-app'>
        Screen Share
      </div>
      <div className='flex flex-col flex-grow space-y-0.5 bg-gray-400 w-full overflow-auto'>
        {windowSource.map((window, idx) => {
          return (
            <div
              key={'window-source-' + idx}
              onClick={() => { handleClick(window.id) }}
              className='flex flex-col flex-grow-0 flex-shrink-0 w-full px-2 py-1 space-y-1 overflow-hidden bg-white cursor-pointer hover:bg-dim-light'>
              <div className={'flex flex-row text-sm font-light w-full truncate '}>
                {window.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
