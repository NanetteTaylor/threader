import React from 'react';
import './main.css';

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state={
      uid: null,
      status: null,
      story: [],
      replyID: null, // The ID of the tweet to reply to. This is how a thread is created. You need to reply to the tweet to create a thread
      profile: {}
    };
  }

  // fetches current user's profile data and saves it to the states
  componentDidMount() {
      let uid = window.document.cookie.split('=')[1];
      this.setState({uid: uid});
    fetch(`/api/twitter-profile/${uid}`)
      .then(res => res.json())
      .then(json => {
        // upon success, update tasks
        this.setState({ profile: json });
        // console.log(this.state.tasks);
      })
      .catch(error => {
        // upon failure, show error message
        console.log(error);
      });
  }

  // saves user input to 'status' in state
  handleInput(event){
    this.setState({status: event.target.value});
  }

  // loops through the 'story' array in state and posts each status in a thread
  async thread(){
    let uid = window.document.cookie.split('=')[1];
    console.log(uid);
    for(let tweet of this.state.story){
      let response = await fetch(`/api/tweet/${this.state.uid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // The 'replyID' is the tweet this status is replying to. When left empty, it doesn't reply to any tweet. It posts the status on its own
        body: JSON.stringify({ status: tweet, replyID: this.state.replyID })
      });

      let json = await response.json();
      this.setState({ replyID: json.id_str});
    }
  }

  // breaks down a user story into tweets, Each tweet is 280 characters or less
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
          // console.log(`Finished a full tweet with length ${tweet.length}`);
          this.state.story.push(tweet.substring(0, tweet.length-1));
          tweet = word + ' ';
          fullWord = false;
        }
      }
      this.state.story.push(tweet.substring(0, tweet.length-1));
    }
    // console.log(`Story array in state AFTER is ${this.state.story}`);
  }

  handleOnClick(event){
    event.preventDefault();
    this.setState({story: []});
    this.breakDownStory();
    this.thread();
  }

  render(){
    return (
      <div className='threader'>
        <h1>Threader</h1>
        <p>An app for writing beautiful stories as Twitter threads</p>
        <div className='main'>
          <div className='profile'>
            <img src={this.state.profile.profile_image} alt={this.state.profile.username}/>
            <h2>{`@${this.state.profile.handle}`}</h2>
            <h3>{`Followers: ${this.state.profile.followers} Following: ${this.state.profile.friends}`}</h3>
            <h4>{this.state.profile.user_description}</h4>
          </div>
          <div className='threader-input'>
            <h3>Hello {this.state.profile.username}, you can type your story here</h3>
            <textarea onChange={(event)=> this.handleInput(event)} placeholder='Your twitter thread' rows='8'/>
            <div className='button'><button onClick={(event)=> this.handleOnClick(event)} >Tweet</button></div>
            {/* <p>{this.state.replyID}</p> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
