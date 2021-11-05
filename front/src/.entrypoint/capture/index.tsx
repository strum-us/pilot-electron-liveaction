import '../../styles/tailwind.css'
import '../../styles/index.css'

import React from 'react'
import Root from './Capture'
import { render } from 'react-dom'

const closeSlash = () => {
  const preloader: HTMLElement | null = document.getElementById('preloader')
  preloader && preloader.remove()
}

function renderApp() {
  render(<Root />, document.getElementById('capture'))

  if ((module as any).hot) {
    (module as any).hot.accept('./Capture', () => {
      // eslint-disable-next-line global-require
      const NextRoot = require('./Capture').default
      render(
        <NextRoot />,
        document.getElementById('capture'),
      )
    })
  }
}

const entry = async () => {
  closeSlash()
  console.log('capture.tsx Initialized 😽')
  renderApp()
  console.log('capture.tsx Render started 😽 :)')
}

entry()
