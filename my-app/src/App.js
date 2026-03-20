import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Homepage from './components/Homepage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    </div>
  );
}

export default App;
