import '../../styles/tailbase.css'
import '../../styles/tailwind.css'
import '../../styles/index.css'
import '../../assets/preloader.css'

import Root from './Root'
import { render } from 'react-dom'

function renderApp() {
  render(<Root />, document.getElementById('app'))

  if ((module as any).hot) {
    (module as any).hot.accept('./Root', () => {
      // eslint-disable-next-line global-require
      const NextRoot = require('./Root').default
      render(
        <NextRoot />,
        document.getElementById('app'),
      )
    })
  }
}


const closeSlash = () => {
  const preloader: HTMLElement | null = document.getElementById('preloader')
  preloader && preloader.remove()
}

const entry = async () => {
  closeSlash()
  console.log('Initialized 😽')
  renderApp()
  console.log('Render started 😽 :)')
}

entry()

