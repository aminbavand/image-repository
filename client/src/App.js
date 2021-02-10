import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Main from './pages/main';
import newPage from './pages/newpage';
import Signup from './pages/signup';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <header className="App-header">

        </header> */}
        
        <div>
          <Route exact path="/" component={Main} />
          <Route exact path="/newpage" component={newPage} />
          <Route exact path="/signup" component={Signup} />
        </div>


      </div>
    </Router>
  );
}

export default App;
