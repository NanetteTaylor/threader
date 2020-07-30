import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Main from './components/Main';
import Landing from "./components/Landing";

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    render(){
        return (
            <Router>
                <Switch>
                    <Route path='/main'>
                        <Main/>
                    </Route>
                    <Route path='/'>
                        <Landing/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}
 export default App;