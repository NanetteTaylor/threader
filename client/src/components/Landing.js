import React from 'react';
import './landing.css';

class Landing extends React.Component{
    render() {
        return(
            <div className="landing">
                <div className='main-section position-relative overflow-hidden p-3 p-md-5 m-md-3'>
                    <div className='container d-flex flex-column'>
                        <div className='row'>
                            <div className='mx-auto landing-content text-center'>
                                <h1>Threader</h1>
                                <h3>An app for writing beautiful stories as twitter threads</h3>
                                <a href='/twitter-login' className='btn btn-lg btn-primary'>Login With Twitter</a>
                            </div>
                            {/*<div className="col-lg-6 col-md-12 col-sm-12 ml-auto my-auto">*/}
                            {/*    <img alt="Illustration" src="./images/writing-00.svg"/>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Landing;