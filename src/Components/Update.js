import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams, useHistory } from "react-router-dom";
import style from "./Style.module.css"
import {ip} from '../configs';
    
const Update = (props) => {
    const history = useHistory();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState('');
    
    const [dm, setDm] = useState('');
    const [dmError, setDmError] = useState('');
    
    useEffect(() => {
        console.log(id)
        axios.get(`http://${ip}:8000/api/Games/` + id)
            .then(res => {
                console.log("UE", res.data)
                setTitle(res.data.title);
                setDm(res.data.dm);
            })
    }, []);
    
    const updateGame = e => {
        e.preventDefault();
        axios.put(`http://${ip}:8000/api/Games/` + id, {
            title,dm
        })
            .then(res => {
                if(!res.data.errors){
                    history.push('/Games')
                }
                else{
                    setTitleError(res.data.errors.title.message)
                    setDmError(res.data.errors.dm.message)
                }
            })
            .catch(err => console.error(err));
    }
    
    return (
        <div className={style.editor}>
            <h1>Update {title}</h1>
            <form onSubmit={updateGame}>
                <p>
                    <label>Title</label><br />
                    <input type="text" 
                    name="Title" 
                    value={title} 
                    onChange={(e) => { setTitle(e.target.value) }} />
                    <p>{titleError}</p>
                    <label>DM</label><br />
                    <input type="text" 
                    name="DM" 
                    value={dm} 
                    onChange={(e) => { setDm(e.target.value) }} />
                    <p>{dmError}</p>
                </p>
                <input type="submit" />
            </form>
        </div>
    )
}
    
export default Update;