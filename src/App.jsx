import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import chatgptLogo from "./assets/chatgptLogo.svg";
import addbtn from "./assets/add-30.png";
import msgIcon from "./assets/message.svg";
import home from "./assets/home.svg";
import saved from "./assets/bookmark.svg";
import rocket from "./assets/rocket.svg";
import sendBtn from "./assets/send.svg";
import userIcon from "./assets/user-icon.png";
import { sendMsgToTogether } from "./openai";

export default function App() {
  const messageEnd = useRef(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hi , i am Chat GPT Bot ,How may i assist you today??",
      isBot: true,
    },
  ]);
  const [prevMessages, setPrevmessages] = useState([]);
const typingInterval = useRef(null);
  useEffect(() => {
    messageEnd.current.scrollIntoView();
  }, [messages]);

  const handleSend = async (input) => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, isBot: false }]);
    setInput(" ");
    setPrevmessages([...prevMessages, input]);

    const res = await sendMsgToTogether(input);


        let currentText = "";
     typingInterval.current = setInterval(() => {
      currentText += res[currentText.length];

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.isBot && !last.done) {
          return [
            ...prev.slice(0, -1),
            { text: currentText, isBot: true, done: false },
          ];
        } else {
          return [...prev, { text: currentText, isBot: true, done: false }];
        }
      });

      if (currentText.length === res.length) {
        clearInterval(typingInterval.current);
        typingInterval.current  = null;
        setMessages((prev) => {
          return [
            ...prev.slice(0, -1),
            { text: currentText, isBot: true, done: true },
          ];
        });
      }
    }, 5);

  };

  const handleEnterKey = async (e) => {
    if (e.key == "Enter") await handleSend(input);
  };
 function NewChat() {
  if (typingInterval.current) {
    clearInterval(typingInterval.current);
    typingInterval.current = null;
  }

  setMessages([
    {
      text: "Hi , i am Chat GPT Bot ,How may i assist you today??",
      isBot: true,
    },
  ]);
}

  return (
    <>
      <div className="App">
        <div className="sidebar">
          <div className="upperside">
            <div className="uppersideTop">
              <div className="logoRow">
                <img src={chatgptLogo} alt="Logo" className="logo" />
                <span className="brand">ChatGPT</span>
              </div>
              <button className="midbtn" onClick={()=>{
                NewChat();
              }}>
                <img src={addbtn} alt="newchat" className="addbtn" />
                New Chat
              </button>
            </div>

            <div className="uppersideBottom">
              {prevMessages.map((PrevMessage, i) => 
                <button key={i} className="query">
                  <img src={msgIcon} alt="Query" />
                  {PrevMessage}
                </button>
              )}
            </div>
          </div>

          <div className="lowerside">
            <div className="listItem">
              <img src={home} alt="" className="listItemsImg" />
              Home
            </div>
            <div className="listItem">
              <img src={saved} alt="" className="listItemsImg" />
              Saved
            </div>
            <div className="listItem">
              <img src={rocket} alt="" className="listItemsImg" />
              Upgrade
            </div>
          </div>
        </div>

        <div className="main">
          <div className="chats">
            {messages.map((message, i) => (
              <div key={i} className={message.isBot ? "chat bot" : "chat"}>
                <img
                  className="chatImg"
                  src={message.isBot ? chatgptLogo : userIcon}
                  alt=""
                />
                <p className="txt">{message.text}</p>
              </div>
            ))}
            <div ref={messageEnd} />
          </div>
          <div className="chatFooter">
            <div className="input">
              <input
                type="text"
                name="input"
                id=""
                placeholder="send a message"
                onKeyDown={handleEnterKey}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              <button className="sendBtn" onClick={() => {handleSend(input);
              }
            
              }>
                <img src={sendBtn} alt="" />
              </button>
            </div>
            <div className="info">
              ChatGPT may produce inaccurate information about people,places,or
              facts. ChatGPT June 25 version.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
