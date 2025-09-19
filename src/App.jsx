import logo from './assets/logo_UASSIST.png'
import './App.css'
import FormularioWidget from './components/Formulario'

function App() {
  return (
    <div className="app-stack">
      <div className="logo-wrap">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="form-wrap">
        <FormularioWidget />
      </div>
    </div>
  )
}

export default App
