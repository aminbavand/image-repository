import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Signup from './pages/signup';
import Home from './pages/homepage';
import Login from './pages/login';
import UserPage from './pages/userpage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <header className="App-header">

        </header> */}
        
        <div>
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route path="/home/:userId" component={UserPage} />
        </div>


      </div>
    </Router>
  );
}

export default App;
