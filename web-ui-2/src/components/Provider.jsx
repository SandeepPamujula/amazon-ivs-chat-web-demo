import React, {useState} from "react";
import axios from "axios";
import './Provider.css';
import * as config from '../config';
import Chat from "./chat/Chat";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
const Provider = (props) => {
    const [formVisible, setFormVisible] = useState(false);
    const [islist, setIsListVisible] = useState(false);
    const [eventsList, setEventsList] = useState([]);
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [duration, setDuration] = useState(0);
    const [roomDetails, setRoomDetails] = useState({})
    const [eventDetails, setEventDetails] = useState([])

    const handleJoin = (e) => {
        setRoomDetails(e)
        setFormVisible(false)
        console.log("called", roomDetails);
    }

    const getList = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/live/list?provider=${props.isProvider}`);
            console.log(response);
            setEventsList(response.data.events)
            setIsListVisible(true)
            setFormVisible(false)
            setEventDetails([])
          } catch (error) {
            console.error('Error:', error);
          }
    }

    const handleSubmit = async (e) => {
        console.log(eventTime);
        e.preventDefault()
        setFormVisible(true);
        setName(name);
        setAuthor(author);
        setEventTime(eventTime);
        setDuration(duration)
        try {
             const res = await axios.post(`${config.API_URL}/live/event`, {
                "latencyMode": "NORMAL",
                "name": name,
                "tags": {},
                "type": "BASIC",
                "eventTime": new Date(eventTime).valueOf(),
                "duration": parseInt(duration),
                "author": author
            });
            setName('');
        setAuthor('');
        setEventTime('');
        setDuration('');
        setEventDetails(res.data)
        setFormVisible(false)
           
          } catch (error) {
            console.error('Error:', error);
          }
        
    }

  return (
    <div>
        <div className="buttonBox">
            {props.isProvider && <div className={`tab ${formVisible ? "active" : ""}`} onClick={()=>{setFormVisible(true); setIsListVisible(false);setEventDetails([])}}>
                Create Live Brodcast
            </div>
            }
            
            <div className={`tab ${islist ? "active" : ""}`} onClick={getList}>
                list
            </div>
        </div>
      {formVisible && !islist && <form onSubmit={handleSubmit}>
        <label className="inputLabel">
          Event Name:
          <input className="inputField" type="text" name="name" value={name} onChange={e=>setName(e.target.value)} />
        </label>
        <label className="inputLabel">
        Author:
          <input className="inputField" type="text" name="author" value={author} onChange={e=>setAuthor(e.target.value)} />
        </label>
        <label className="inputLabel">
        Event Time:
        <DateTimePicker className="inputField" onChange={setEventTime} value={eventTime} />
        </label>
        <label  className="inputLabel">
        Duration:
          <input className="inputField" type="number" min="1" name="duration" value={duration} onChange={e=>setDuration(e.target.value)} />
        </label>
        <input className="inputField" type="submit" value="Submit" />
      </form>
      }  
      {!islist && !formVisible  && Object.keys(eventDetails).length > 0 && <div>
        <div className="listItem"> <bold> Stream Url: </bold> {eventDetails.broadcastStreamUrl}</div>
        <div className="listItem"> Secret:  {eventDetails.secret}</div>
        <div className="listItem"> Playback Url:  {eventDetails.playbackUrl}</div>
        <div className="listItem"> Event Name:  {eventDetails.eventName}</div>  
        </div>}
      {islist && !formVisible && eventsList.length>0 && 
      <div className="listContainer">
            {eventsList.map((e,i)=>{
                return(
                    <div key={i} className="listItems">
                        <div className="item">
                            {e.eventName}
                        </div>
                        <div className="item">
                            {e.author}
                        </div>
                        <div className="item">
                            {new Date(e.eventDateTime).toLocaleString("en-US")}
                        </div>
                        <div className="item">
                            {e.duration}
                        </div>
                        <div className="joinButton item" onClick={()=>handleJoin(e)}>join </div>
                    </div>
                )
            })}
      </div>
      }

      {Object.keys(roomDetails).length > 0 && !formVisible && <Chat roomDetails={roomDetails} username={props.username} isProvider={props.isProvider} avatarUrl={props.avatarUrl} />}

      
    </div>
  );
};

export default Provider;
