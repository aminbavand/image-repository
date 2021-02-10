import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Main from './main';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <header className="App-header">

        </header> */}
        

        <Route exact path="/" component={Main} />

      </div>
    </Router>
  );
}

export default App;
