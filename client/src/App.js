import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      status: null,
      story: [],
      replyID: null,
      profile: {}
    };
  }

  componentDidMount() {
    fetch("/api/twitter-profile")
      .then(res => res.json())
      .then(json => {
        // upon success, update tasks
        this.setState({ profile: json[0] });
        // console.log(this.state.tasks);
      })
      .catch(error => {
        // upon failure, show error message
        console.log(error);
      });
  }

  handleInput(event){
    this.setState({status: event.target.value});
  }

  async thread(){
    for(let tweet of this.state.story){
      let response = await fetch("/api/tweet", {
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
    this.setState({story: []});
    this.breakDownStory();
    this.thread();
  }

  render(){
    return (
      <div className="threader">
        <h1>Threader</h1>
        <div className='profile'>
          <img src={this.state.profile.profile_image} alt={this.state.profile.username}/>
          <h4>{`@${this.state.profile.handle}`}</h4>
          <h5>{`Followers: ${this.state.profile.followers} Following: ${this.state.profile.friends}`}</h5>
          <h6>{this.state.profile.user_description}</h6>
        </div>
        <div className='main'>
          <textarea onChange={(event)=> this.handleInput(event)}/>
          <button onClick={(event)=> this.handleOnClick(event)} >Submit</button>
          {/* <p>{this.state.replyID}</p> */}
        </div>
      </div>
    );
  }

  // async twitterLogin(event){
  //   event.preventDefault();
  //   let response = await fetch("/twitter-login", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     redirect: "follow"
  //   });

  //   let json = await response.json();
  //   this.setState({ response: json});
  // }
}

export default App;
