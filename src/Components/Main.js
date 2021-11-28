import React, { useEffect, useState } from 'react'
import axios from 'axios';
import GameList from './GameList';
import GameForm from './GameForm';
import style from "./Style.module.css"
import {ip} from '../configs';

export default () => {
    // list of games in database
    const [Games, setGames]=useState([]);
    const [loaded, setLoaded]=useState(false);

    useEffect(()=>{
        axios.get(`http://${ip}:8000/api/Games`)
            .then(res=>{
                setGames(res.data);
                setLoaded(true);
            })
            .catch(err => console.error(err));
    },[]);

    const removeFromDom = GameId => {
        setGames(Games.filter(Game => Game._id !== GameId));
    }
    
    return (
        <div className={style.list}>
            <GameForm/>
            <div>
                <h2>Current Games:</h2>
                {loaded && <GameList Games={Games} removeFromDom={removeFromDom}/>}
            </div>
        </div>
    )
}