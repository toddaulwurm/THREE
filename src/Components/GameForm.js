import React,{useState} from "react";
import axios from "axios";
import {useHistory } from "react-router-dom";
import style from "./Style.module.css"
import {ip} from '../configs';

export default ()=>{
    const history = useHistory();

    // Title Form
    const [title,setTitle] = useState('');
    const [titleError, setTitleError] = useState('');

    // DM Form
    const [dm, setDm] = useState('');
    const [dmError, setDmError] = useState('');

    const handleTitle=e=>{
        setTitle(e.target.value)
        if(e.target.value.length>2){
            setTitleError('')
        }
        else{
            setTitleError('Title is too short!')
        }
    }
    const handleDm=e=>{
        setDm(e.target.value)
        if(e.target.value.length>0){
            setTitleError('')
        }
        else{
            setDmError('DM needed!')
        }
    }


    const onSubmitHandler = e =>{
        e.preventDefault();
        axios.post(`http://${ip}:8000/api/Games`,{
            title, dm
        })
        .then(res=>{
            if(!res.data.errors){
                history.push('/Games')
            }
            else{
                setTitleError(res.data.errors.title.message)
                setDmError(res.data.errors.dm.message)
            }
    })
        .catch(err=>console.log(err))
    }

    return(
        <form onSubmit={onSubmitHandler} className={style.form}>
            <h1>Add a Game here!</h1>
            <label>Title:</label>
            <input type='text' onChange={(e)=>{handleTitle(e)}} value={title}/><br/>
            <p>{titleError}</p>
            <label>Your DM Name:</label>
            <input type='text' onChange={(e)=>{handleDm(e)}} value={dm}/><br/>
            <p>{dmError}</p>
            <input type='submit' value='Add Game'/>
        </form>   
    )
}