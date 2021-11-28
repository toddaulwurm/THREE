
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams,Link} from "react-router-dom";
import io from 'socket.io-client'
import style from "./Style.module.css"
import {ip} from '../configs';

const Detail = (props) => {
    // connection to backend server
    const [socket] = useState(() => io(":8000"));

    // Individual Game info
    const [Game, setGame] = useState({});
    
    // gets game's id from URL
    const { id } = useParams();
    
    // holder for Detail's principle select form
    const [input, setInput] = useState("")
    
    // list of principles submitted from server
    const [principles, setPrinciples] = useState([]);
    // list of sets of 3 reactions updating throughout game
    const [reactions, setReactions] = useState([]);
    // number of headaches
    const [headaches, setHeadaches] = useState(0);
    
    
    // button select styling vvv
    const [selectedItem, setSelectedItem] = useState(-1);
    const selectStyle = {border: "10px solid red"};
    const notSelectedStyle = {};
    
    useEffect(() => {
        axios.get(`http://${ip}:8000/api/Games/` +id)
        .then(res => setGame(res.data))
        .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if(Game.headaches){
            setPrinciples([Game.principles]);
            setReactions([Game.reactions]);
            console.log("fun", headaches)
        }
    }, [Game]);
    
    useEffect(() => {
        console.log("Is this thing on");
        socket.on('welcome', _=>{
            socket.emit('setup',  {"gameId":id})
        })
        socket.on('send bundle', bundle=>{
            setPrinciples(bundle.message.principles);
            setReactions(bundle.message.reactions);
            setHeadaches(bundle.message.headaches);
            console.log("This is from bundle!!!!", bundle.message.headaches)
        })
        return () => socket.disconnect(true);
    }, [socket]);
    
    // SUBMIT HANDLER
    const onSubmitHandler =e=>{
        e.preventDefault();
        socket.emit('chat', {"input":input, "gameId":id});
        console.log(headaches)
        axios.put(`http://${ip}:8000/api/Games/` + id, {
            principles, reactions, headaches
        })
        .then(res => {
            if(!res.data.errors){
                console.log(res.data, "DATA");
            }
            else{
                console.log(res.data.errors, "ERRORS")
                }
            })
            .catch(err => console.error(err));
    }
        
    const onChangeHandler=e=>{
        setInput(e.target.value);
        setSelectedItem(e.target.value)
    }
    
    return (
        <div className={style.single}>
            <div className={style.left}>
                <br/>
                <div className={style.see}>
                    <h1>{Game.title}</h1>
                    <h3>DM: {Game.dm}</h3>
                    <Link to={"/Games/" + Game._id + "/edit"}>
                        <button>Edit</button>
                    </Link>
                </div><br/>


                {headaches<3 &&
                <div>
                <h2 className={style.listReactions} for="principles"><strong>Choose a Principle:</strong></h2>

                <form onSubmit={onSubmitHandler}>
                    <div className={style.listBtn}>
                        <div className={style.pbtn} style={selectedItem==1?selectStyle:notSelectedStyle}>
                            <input type="radio" id="Peace" name="principle" value="1" onChange={onChangeHandler}/>
                            <label for="Peace">Peace</label><br/><img src="https://img.icons8.com/windows/60/463838/leaf.png"/><br/>
                        </div>

                        <div className={style.pbtn} style={selectedItem==0?selectStyle:notSelectedStyle}>
                            <input type="radio" id="Abstain" name="principle" value="0" onChange={onChangeHandler}/>
                            <label for="Abstain">Abstain</label><br/><img src="https://img.icons8.com/ios-filled/50/000000/x.png"/><br/>
                        </div>
                        <div className={style.pbtn} style={selectedItem==2?selectStyle:notSelectedStyle}>
                            <input type="radio" id="Love" name="principle" value="2" onChange={onChangeHandler}/>
                            <label for="Love">Love</label><br/><img class="loveBtn" src="https://img.icons8.com/android/60/2237cc/fire-element.png"/><br/>
                        </div>
                    </div>

                    <div className={style.list}>
                        <div className={style.pbtn} style={selectedItem==3?selectStyle:notSelectedStyle} >
                            <input type="radio" id="Joy" name="principle" value="3" onChange={onChangeHandler}/>
                            <label for="Joy">Joy</label><br/><img class="joyBtn" src="https://img.icons8.com/ios/60/f1f950/  lightning-bolt--v1.png"/><br/>
                        </div>

                        <div className={style.pbtn} style={selectedItem==5?selectStyle:notSelectedStyle}>
                            <input type="radio" id="Pride" name="principle" value="5" onChange={onChangeHandler}/>
                            <label for="Pride">Pride</label><br/><img class="prideBtn" src="https://img.icons8.com/ios/60/892e94/sparkling.png"/><br/>
                        </div>

                        <div className={style.pbtn} style={selectedItem==6?selectStyle:notSelectedStyle}>
                            <input type="radio" id="Empathy" name="principle" value="6" onChange={onChangeHandler}/>
                            <label for="Empathy">Empathy</label><br/><img class="empathyBtn" src="https://img.icons8.com/ios-glyphs/60/6f3d0a/globe-earth--v1.png"/><br/>
                        </div>

                        <div className={style.pbtn} style={selectedItem==4?selectStyle:notSelectedStyle}>
                            <input type="radio" id="Hope" name="principle" value="4" onChange={onChangeHandler}/>
                            <label for="Hope">Hope</label><br/><img class="hopeBtn" src="https://img.icons8.com/material-outlined/60/0c7710/sun--v1.png"/><br/>
                        </div>
                    </div>

                    <input className={style.submit} type="submit"/>
                </form>
            </div>
            }
            {
                headaches== 3 && 
                <div>
                    <h1>GAME OVER</h1>
                    <h3>Character sustained 3<br/> mysterious headaches and died.</h3>
                </div>
            }
            </div>

            <div className={style.left}>
                <h1 className={style.see}>Reaction History</h1>
                <div className={style.listReactions}>
                    {
                        reactions.map((reaction,i)=>{
                            return <h3 key={i}>{reaction}, </h3>
                        })
                    }
                </div>

                <div className={style.listPrinciples}>
                    <h1>{principles.length} Principles Submitted</h1>
                    <h1 style={selectStyle}>{headaches} Headaches</h1>
                </div>

                <div className={style.see}>
                    <h3>The 6 Principles</h3>
                    <div className={style.guide}>
                        <div>
                            <p class="text"><strong>PEACE</strong><br/>
                            Everyone is a friend | Everyone is a foe</p>
                            <p class="text"><strong>JOY</strong><br/>
                            Today is bright | Today is dark <br/></p>
                            <p class="text"><strong>PRIDE</strong><br/>
                            My value / Their Judgement <br/></p>
                        </div>
                        <div>
                            <p class="text"><strong>LOVE</strong><br/>
                            Someone is attractive | Someone is repulsive <br/></p>
                            <p class="text"><strong>HOPE</strong><br/> 
                            Tomorrow is bright | Tomorrow is dark <br/></p>
                            <p class="text"><strong>EMPATHY</strong><br/>
                            Their value / My Judgement <br/></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Detail;








{/* // const [ids, setIds]= useState({ */}
{/* //     "DM":"",
//     "Player1":"",
//     "Player2":"",
//     "Player3":"",
// })

// if(ids.DM===""){
    //     ids.DM=bundle.id
    //     setIds(IDs=>{return{...IDs}})
    // }
    // else if(ids.Player1===""&&ids.DM!=bundle.id){
//     ids.Player1=bundle.id
//     setIds(IDs=>{return{...IDs}})
// }
// else if(ids.Player2===""&&ids.DM!=bundle.id&&ids.Player1!=bundle.id){
//     ids.Player2=bundle.id
//     setIds(IDs=>{return{...IDs}})
// }
// else if(ids.Player3===""&&ids.DM!=bundle.id&&ids.Player1!=bundle.id&&ids.Player2!=bundle.id){
//     ids.Player3=bundle.id
//     setIds(IDs=>{return{...IDs}})
// }
// console.log("THE ID IS", ids) */}