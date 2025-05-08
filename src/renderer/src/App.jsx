import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div>
        <h1>Hello lol!</h1>
      </div>
    </>
  )
}

export default App
