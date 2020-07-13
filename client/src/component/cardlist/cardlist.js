import React from 'react';
import {Card} from '../cards/cards';

export const Carlist = props => {
    console.log(props);
    return <div className="card-list">
        {props.sites.map(site => (
            <Card id={site._id} name={site.link}/>
        ))}
    </div>;
};