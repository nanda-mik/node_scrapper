import React from 'react';
import Card from '../cards/cards';
import "./cardlist.css"

export default function Cardlist(props){
    console.log(props.sites);
    return <div>
    <div class="heading"> <h2>Sites Under Monitor</h2></div>
        <div className="card-list">   
        {props.sites.map(site => (
            <Card id={site._id} name={site.link}/>
        ))}
        </div>
    </div>;
};