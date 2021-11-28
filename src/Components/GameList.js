import React from 'react'
import axios from 'axios';
import style from "./Style.module.css"
import {ip} from '../configs';
    
const GameList = (props) => {
    const { removeFromDom } = props;
    
    const deleteGame = (GameId) => {
        axios.delete(`http://${ip}:8000/api/Games/` + GameId)
            .then(res => {
                removeFromDom(GameId)
            })
            .catch(err => console.error(err));
    }
    return (
        <div className={style.list}>
            {props.Games.map( (Game, i) =>{
                let url=`/Games/${Game._id}`;
                return (
                <div className={style.items} key={i}>
                    <h2><a href={url}>{Game.title}</a></h2>
                    <h3>DM: {Game.dm}</h3>                
                    <button onClick={(e)=>{deleteGame(Game._id)}}>
                        Delete
                    </button>
                </div>)
            })}
        </div>
    )
}
    
export default GameList;