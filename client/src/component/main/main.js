import React, { Component, Fragment } from 'react';
import './main.css'
import { Button } from '@material-ui/core';
import Axios from "axios";
import Spinner from "../Spinner/Spinner";
import Cardlist from "../cardlist/cardlist";
import ErrorHandler from '../ErrorHandler/ErrorHandler';

class Main extends Component {
    constructor() {
        super();
        this.state = {
            page_url: "",
            loading: false,
            message: null,
            sites: [],
            error: null
        }
    }

    componentDidMount() {
        const cachedResult = sessionStorage.getItem('sites');
        fetch('http://165.22.214.114/api/getSites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: localStorage.getItem('userId')
            })
        })
            .then(res => res.json())
            .then(sites => {
                this.setState({ sites: sites.sites })
            });
    }

    inputChange = (e) => {
        this.setState({ page_url: e.target.value });
    }

    handleSubmit = async (e) => {
        this.setState({ message: null, willAppear: null });
        e.preventDefault();
        const pageUrl = this.state.page_url;
        const userId = localStorage.getItem('userId');
        const url = "http://165.22.214.114/api/addScrapper";
        try {
            this.setState({ loading: true });
            if (!pageUrl) {
                const error = new Error("Url Required!. Format: https://website.com/");
                throw error;
            }
            const result = await Axios.post(url, { pageUrl: pageUrl, userId: userId });
            console.log(result);
            this.setState({
                message: result.data.message
            });
        } catch (err) {
            console.log(err);
            this.setState({
                error: new Error("Sitemap.xml not found!. Check your Url.")
            })
        }
        this.setState({ loading: false })
    }

    errorHandler = () => {
        this.setState({ error: null });
    };



    render() {
        const sites = this.state.sites;
        console.log(sites);
        return (
            <Fragment>
                <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
                <div className="form-to-add">
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
            </Fragment>
        );
    }
}

export default Main;
