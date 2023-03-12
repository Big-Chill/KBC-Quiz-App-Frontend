import React from 'react'
import ReactDOM from 'react-dom'
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import NewQuestion from './Pages/NewQuestion';
import Game from './Pages/Game';
import AdminPanel from './Pages/AdminPanel';
import Stat from './Pages/Stat';
import Profile from './Pages/Profile';
import Questions from './Pages/Questions';
import BulkQuestion from './Pages/BulkQuestion';
import Privateroute from './Utils/Privateroute';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Privateroute exact path="/" component={Home} />
          <Privateroute exact path="/questions" component={Questions} />
          <Privateroute exact path="/new-question" component={NewQuestion} />
          <Privateroute exact path="/bulk-question" component={BulkQuestion} />
          <Privateroute exact path="/game" component={Game} />
          <Privateroute exact path="/admin-panel" component={AdminPanel} />
          <Privateroute exact path="/stats" component={Stat} />
          <Privateroute exact path="/profile" component={Profile} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
