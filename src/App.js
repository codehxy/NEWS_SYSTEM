import IndexRouter from './router/IndexRouter'
import "./App.css"
import "./util/http"
import { Provider } from 'react-redux'
import store from "./redux/store"
import { BrowserRouter } from 'react-router-dom'

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <IndexRouter></IndexRouter>
      </BrowserRouter>
    </Provider>
  )
}

export default App
