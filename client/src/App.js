import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      status: '',
      response: ''
    };
  }

  handleInput(event){
    this.setState({status: event.target.value});
  }

  tweet(){
    fetch("/api/twitter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: this.state.status })
    })
      .then(res => res.json())
      .then(json => {
        // upon success, update tasks
        this.setState({ response: json });
        // console.log(this.state.tasks);
      });
  }

  handleOnClick(event){
    event.preventDefault();
    this.tweet();
  }

  render(){
    return (
      <div className="App">
        <h1>Threader</h1>
        <textarea onChange={(event)=> this.handleInput(event)}/>
        <button onClick={(event)=> this.handleOnClick(event)} >Submit</button>
        <p>{this.state.response.id_str}</p>
      </div>
    );
  }
}

export default App;
