import React, { Component } from 'react';
import './main.css'
import { Button } from '@material-ui/core';
import Axios from "axios";
import Spinner from "../Spinner/Spinner";
import Cardlist from "../cardlist/cardlist";

class Main extends Component{
    constructor(){
        super();
        this.state = {
            page_url: "",
            loading: false,
            message: null,
            sites: []
        }
    }

    
    componentDidMount(){
        fetch('http://localhost:8080/getScrapper',{
            method: 'GET'
        })
            .then(res => res.json())
            .then(sites => {
                this.setState({sites: sites.sites})
            });  
    }

    inputChange = (e) => {
        this.setState({page_url: e.target.value});
    }

    handleSubmit = async (e) => {
        this.setState({ message: null, willAppear: null });
        e.preventDefault();
        const pageUrl = this.state.page_url;
        const url = "http://165.22.214.114/addScrapper";
        try{
            this.setState({loading: true});
            const result = await Axios.post(url,{pageUrl: pageUrl});
            console.log(result);
            this.setState({
                message: result.data.message
            });
        }catch(err){
            console.log(err);
        }
        this.setState({loading: false})
    }

    render(){
        const sites = this.state.sites;
        console.log(sites);
        return(
            <div>
                <div>
                    <h2>Enter websites to monitor</h2>
                    <form onSubmit={this.handleSubmit}>
                        <input id="input" className="input" placeholder="Add website" onChange={this.inputChange}></input>
                        <div className="btn"><Button variant="contained" type="submit" color="primary">Add Website</Button></div>
                    </form>
                </div>
                {this.state.message ? (
                    <div style={{ color: "black" }}>{this.state.message}</div>
                  ) : (
                    ""
                  )}
                {this.state.loading ? <Spinner /> : null}
                {this.state.sites.length !== 0 ? <Cardlist sites={sites} /> : <h2>No sites under monitor.</h2>}
            </div>
        );
    }
}

export default Main;
