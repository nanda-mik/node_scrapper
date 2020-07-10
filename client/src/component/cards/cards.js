import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from '@material-ui/core';
import "./cards.css";


class Cards extends Component {
 
    constructor(){
        super();
        this.state = {
            redirect: false
        }
    }
    onSubmit = () => {
        this.setState({redirect: true});
    }

    render(){
        let redirect = null;
        if(this.state.redirect){
            redirect = <Redirect to="/table" />
        }
        return(
            <div>
            <div className="added-sites">
                <h3>Websites under monitor</h3>   
                <Button variant="contained" color="primary" onClick={this.onSubmit}>StartupTalky</Button>
            </div>
            {redirect}
            </div>
        );
        
    }
}

export default Cards;