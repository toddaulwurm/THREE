
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
    const selectStyle = {border: "2px solid orange", borderRadius:"10px"};
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
                <div className={style.see}>
                        <div className={style.instruct}>
                            <h1>{Game.title}</h1>
                            <h1>DM: {Game.dm}</h1>
                            <Link to={"/Games/" + Game._id + "/edit"}>
                                <button className={style.submit}>Edit</button>
                            </Link>
                        </div>
                        <div className={style.minis}>
                            <div><strong>BEFORE PLAY:</strong>Three players and a GM must create one collective Character and their given circumstances. <br/> <br/>The only unchangable factor is that the character unknowingly has an incurable illness and will die suddenly in less than a year.</div><br/>
                            <div>The GM will then craft a regular life for that character with a series of scenarios, ranging from mundane to serious, all in need of a response.</div> 
                        </div><br/>
                        <div className={style.minis}>   
                            <div><strong>DURING PLAY:</strong> In each scenario, right when the character would have a chance to react, each player chooses the principle that they deem most important for the character at that time.<br/>(Keeping in mind the dramatic irony of the situation.)</div><br/>
                            <div><strong>The Players will stay silent during the day and may only communicate while the character is asleep.</strong> <br/><em>DM: The Players' conversations may become the Character's dream that night.</em></div>
                        </div><br/>
                        <div className={style.minis}>   
                            <div><strong>END OF GAME:</strong> Throughout the game, you may accumulate headaches. If you gain 3, your character is overtaken by their illness and the game is over.<br/><br/><strong>GOAL:</strong> It is your goal to guide the character to unkowningly live their last days in the best way possible. 
                            </div>
                        </div>
                        <div className={style.minis}>   
                            <div> 
                                <h4>Reaction Calculator:</h4>           
                                    <h5 class="text">More than 1 "Abstain": <em>Character gets headache.</em></h5>
                                    <h5 class="text">All Different Principles: <em>Character gets headache.</em></h5>
                                    <h5 class="text">2 Same 1 Different: <em>Popular principle twisted negatively by the singular principle.</em></h5>
                                    <h5 class="text">All Same Principle: <em>Very Positive for that principle. Or Less.*</em></h5>
                                    <h5 class="text">2 Different Principles: <em>Positive for both principles.*</em></h5>
                                <h6><em>*in event of 1 Abstain</em> </h6>  
                            </div>
                        </div>
                </div>
            </div>

            <div className={style.left}>

                <div className={style.listPrinciples}>
                    <h1>{principles.length} Principles Submitted</h1>
                    <h1 style={selectStyle}>{headaches} Headaches</h1>
                </div>

                {headaches<3 &&
                <div>
                    {selectedItem==-1 &&
                        <h2 className={style.see} for="principles"><strong>Wait for your DM's signal to choose a principle...</strong></h2>
                    } 
                    {selectedItem==0 &&
                        <h2 className={style.see} for="principles"><strong>More than 1 Abstain will cause a headache...</strong></h2>
                    } 
                    {selectedItem==1 &&
                        <h2 className={style.see} for="principles"><strong>PEACE</strong><br/>
                        Everyone is a friend | Everyone is a foe</h2>
                    }
                    {selectedItem==2 &&
                        <h2 className={style.see} for="principles"><strong>LOVE</strong><br/>
                        Someone is attractive | Someone is repulsive</h2>
                    } 
                    {selectedItem==3 &&
                        <h2 className={style.see} for="principles"><strong>JOY</strong><br/>
                        Today is bright | Today is dark</h2>
                    } 
                    {selectedItem==4 &&
                        <h2 className={style.see} for="principles"><strong>HOPE</strong><br/> 
                        Tomorrow is bright | Tomorrow is dark </h2>
                    } 
                    {selectedItem==5 &&
                        <h2 className={style.see} for="principles"><strong>PRIDE</strong><br/>
                        My Value | Their Judgement </h2>
                    } 
                    {selectedItem==6 &&
                        <h2 className={style.see} for="principles"><strong>EMPATHY</strong><br/>
                        I Care | Who Cares? </h2>
                    } 

            
                <form onSubmit={onSubmitHandler}>
                    <div className={style.listBtn}>
                        <div className={style.pbtn} style={selectedItem==1?selectStyle:notSelectedStyle}>
                            <input type="radio" id="Peace" name="principle" value="1" onChange={onChangeHandler}/>
                            <label for="Peace">Peace</label><br/><img src="https://img.icons8.com/windows/60/453018/leaf.png"/><br/>
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

                    <input className={style.submit} type="submit"/>
            
                        <div className={style.pbtn} style={selectedItem==6?selectStyle:notSelectedStyle}>
                            <input type="radio" id="Empathy" name="principle" value="6" onChange={onChangeHandler}/>
                            <label for="Empathy">Empathy</label><br/><img class="empathyBtn" src="https://img.icons8.com/ios-glyphs/60/a65a03/globe-earth--v1.png"/><br/>
                        </div>
            
                        <div className={style.pbtn} style={selectedItem==4?selectStyle:notSelectedStyle}>
                            <input type="radio" id="Hope" name="principle" value="4" onChange={onChangeHandler}/>
                            <label for="Hope">Hope</label><br/><img class="hopeBtn" src="https://img.icons8.com/material-outlined/60/0c7710/sun--v1.png"/><br/>
                        </div>
                    </div>
                </form>
            </div>
            }
            <div className={style.listReactions}>
                <h3 className={style.see}>YOUR LATEST REACTION: <br/>{reactions[reactions.length-1]}</h3><br/>
                <h3 className={style.minis}>YOUR DIARY:</h3>
                <div className={style.listBtn}>
                    {
                        reactions.slice(0).reverse().map((reaction,i)=>{
                            return <h3 key={i}>{reaction}, </h3>
                        })
                    }
                </div>
            </div>
            {
                headaches== 3 && 
                <div className={style.see}>
                    <h1>GAME OVER</h1>
                    <h3>The character was overcome by their illness.</h3>
                </div>
            }
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




{/* <div className={style.see}>
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
</div> */}