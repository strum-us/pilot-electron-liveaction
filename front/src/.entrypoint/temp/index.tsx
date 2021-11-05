import '../../styles/tailwind.css'
import '../../styles/index.css'

import React from 'react'
import Root from './Temp'
import { render } from 'react-dom'

const closeSlash = () => {
  const preloader: HTMLElement | null = document.getElementById('preloader')
  preloader && preloader.remove()
}

function renderApp() {
  render(<Root />, document.getElementById('temp'))

  if ((module as any).hot) {
    (module as any).hot.accept('./Temp', () => {
      // eslint-disable-next-line global-require
      const NextRoot = require('./Temp').default
      render(
        <NextRoot />,
        document.getElementById('capture'),
      )
    })
  }
}

const entry = async () => {
  closeSlash()
  console.log('temp.tsx Initialized 😽')
  renderApp()
  console.log('temp.tsx Render started 😽 :)')
}

entry()
