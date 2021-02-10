import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Main from './pages/main';
import newPage from './pages/newpage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <header className="App-header">

        </header> */}
        
        <div>
          <Route exact path="/" component={Main} />
          <Route exact path="/newpage" component={newPage} />
        </div>


      </div>
    </Router>
  );
}

export default App;
