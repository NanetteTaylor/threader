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
    console.log(`Story array in state is ${this.state.story}`);
    if (this.state.status.length <= 280){
      this.state.story.push(this.state.status);
    }else{
      let storyArray = this.state.status.split(' ');
      console.log(storyArray);
      let tweet = '';
      let fullWord = false;
      for(let word of storyArray){
        if((tweet.length + word.length) <= 280){
          tweet += word + ' ';
        }else{
          fullWord = true;
        }
        if(fullWord){
          console.log(`Finished a full tweet with length ${tweet.length}`);
          this.state.story.push(tweet.substring(0, tweet.length-1));
          tweet = word + ' ';
          fullWord = false;
        }
      }
      this.state.story.push(tweet.substring(0, tweet.length-1));
    }
    console.log(`Story array in state AFTER is ${this.state.story}`);
  }

  handleOnClick(event){
    event.preventDefault();
    this.breakDownStory();
    this.thread();
  }

  async twitterLogin(event){
    event.preventDefault();
    let response = await fetch("/api/redirect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow"
    });

    let json = await response.json();
    this.setState({ response: json});
  }

  render(){
    return (
      <div className="App">
        <h1>Threader</h1>
        <textarea onChange={(event)=> this.handleInput(event)}/>
        <button onClick={(event)=> this.handleOnClick(event)} >Submit</button>
        <button onClick={(event) => this.twitterLogin(event)}>Login</button>
        <p>{this.state.replyID}</p>
      </div>
    );
  }
}

export default App;
