import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      status: null,
      story: [],
      replyID: null,
      response: null
    };
  }

  handleInput(event){
    this.setState({status: event.target.value});
  }

  tweet(){
    fetch("/api/tweet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: this.state.status })
    })
      .then(res => res.json())
      .then(json => {
        this.setState({ replyID: json.id_str });
      });
  }

  // replyTweet(tweet){
  //   fetch("/api/reply-tweet", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ status: tweet, replyID: this.state.replyID })
  //   })
  //     .then(res => res.json())
  //     .then(json => {
  //       this.setState({ replyID: json.id_str});
  //     });
  // }

  async thread(){
    for(let tweet of this.state.story){
    let response = await fetch("/api/reply-tweet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: tweet, replyID: this.state.replyID })
    });

    let json = await response.json();
    this.setState({ replyID: json.id_str});
  }
  }

  breakDownStory(){
    if (this.state.status.length <= 280){
      // this.replyTweet();
      this.state.story.push(this.state.status);
    }else{
      let storyLength = this.state.status.length; 
      let startIndex = 0;
      let endIndex = 280;
      while (startIndex <= storyLength){
        this.state.story.push(this.state.status.substring(startIndex, endIndex));
        startIndex = endIndex;
        endIndex += 280;
      }
    }

    this.thread();

    // for (let tweet of this.state.story) {
    //   this.replyTweet(tweet);
    // }

    // this.state.story.forEach(tweet => this.replyTweet(tweet));

  }

  handleOnClick(event){
    event.preventDefault();
    this.breakDownStory();
  }

  render(){
    return (
      <div className="App">
        <h1>Threader</h1>
        <textarea onChange={(event)=> this.handleInput(event)}/>
        <button onClick={(event)=> this.handleOnClick(event)} >Submit</button>
        <p>{this.state.replyID}</p>
      </div>
    );
  }
}

export default App;
