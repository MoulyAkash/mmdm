import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./watchtogether.css";

function WatchTogether() {
  const [currentState, setCurrentState] = useState("createorjoin");
  // const [chatValue, setChatValue] = useState("");
  const [textOffer, setTextOffer] = useState("");
  const [textAnswer, setTextAnswer] = useState("");

  useEffect(() => {
    document.addEventListener("w2gEmitter", handleEvent);

    return () => document.removeEventListener("w2gEmitter", handleEvent);
  }, []);

  function handleEvent(e: any) {
    if (e.detail.type === "message") {
      chatlog(e.detail.data);
    }
    if (e.detail.type === "lastIceCandidate") {
      if (e.detail.state === "host") {
        setTextOffer(e.detail.offer);
      } else if (e.detail.state === "client") {
        setTextAnswer(e.detail.answer);
      }
    }
  }

  function chatlog(msg: any) {
    let receivedMessage = "[" + new Date() + "] " + msg;
    console.log(receivedMessage);
  }

  // function chatbuttonclick() {
  //   console.log("chatbuttonclick");
  //   document.dispatchEvent(
  //     new CustomEvent("w2gInit", {
  //       detail: {
  //         type: "message",
  //         text: chatValue,
  //       },
  //     })
  //   );
  //   setChatValue("");
  // }

  function clickcreateoffer() {
    console.log("clickcreateoffer");
    setCurrentState("host");
    document.dispatchEvent(
      new CustomEvent("w2gInit", {
        detail: {
          type: "createOffer",
        },
      })
    );
  }

  function clickanswerpasted() {
    console.log("clickanswerpasted");
    setCurrentState("joined");
    document.dispatchEvent(
      new CustomEvent("w2gInit", {
        detail: {
          type: "answerPasted",
          text: textAnswer,
        },
      })
    );
  }

  function clickofferpasted() {
    console.log("clickremoteoffer");
    setCurrentState("clientAnswer");
    document.dispatchEvent(
      new CustomEvent("w2gInit", {
        detail: {
          type: "offerPasted",
          text: textOffer,
        },
      })
    );
  }

  return (
    <div className="w2gcontainer">
      <div className="header">Watch Together</div>
      <div className="content">
        {currentState === "createorjoin" && (
          <>
            <div
              onClick={() => {
                setCurrentState("host");
                clickcreateoffer();
              }}
              className="button"
            >
              Create Lobby
            </div>
            <div onClick={() => setCurrentState("client")} className="button">
              Join Lobby
            </div>
          </>
        )}
        {/* {currentState !== "createorjoin" && (
          <div className="chat-container">
            <input
              type="text"
              value={chatValue}
              onChange={(e) => setChatValue(e.target.value)}
            />
            <button onClick={chatbuttonclick}>Send</button>
          </div>
        )} */}
        {currentState === "host" && (
          <div className="host-area">
            <div className="description">
              Copy the below text to your clipboard to be pasted on the other
              mmdm client
            </div>
            <textarea
              placeholder="Please wait for a few seconds"
              value={textOffer}
              onChange={(e) => setTextOffer(e.target.value)}
            ></textarea>
            <div
              onClick={() => {
                navigator.clipboard
                  .writeText(textAnswer)
                  .then(() => setCurrentState("hostAnswer"));
              }}
              className="button"
            >
              Copy
            </div>
            <div
              onClick={() => setCurrentState("createorjoin")}
              className="button cancel"
            >
              Cancel
            </div>
          </div>
        )}
        {currentState === "hostAnswer" && (
          <div className="host-area">
            <div className="description">
              Please enter other user's Code below
            </div>
            <textarea
              placeholder="Please paste other User's Code here"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
            ></textarea>
            <div onClick={clickanswerpasted} className="button">
              Join Lobby
            </div>
            <div
              onClick={() => setCurrentState("createorjoin")}
              className="button cancel"
            >
              Cancel
            </div>
          </div>
        )}
        {currentState === "client" && (
          <div className="host-area">
            <div className="description">
              Paste the code from the host of the lobby and click join to join
              the room
            </div>
            <textarea
              placeholder="Please paste offer from host"
              value={textOffer}
              onChange={(e) => setTextOffer(e.target.value)}
            ></textarea>
            <div onClick={clickofferpasted} className="button">
              Join
            </div>
            <div
              onClick={() => setCurrentState("createorjoin")}
              className="button cancel"
            >
              Cancel
            </div>
          </div>
        )}
        {currentState === "clientAnswer" && (
          <div className="host-area">
            <div className="description">
              Please copy the code below and send to Host
            </div>
            <textarea
              placeholder="Please copy the code here that appears here and send to host, then click Join"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
            ></textarea>
            <div
              onClick={() => {
                navigator.clipboard
                  .writeText(textAnswer)
                  .then(() => setCurrentState("joined"));
              }}
              className="button"
            >
              Copy to Clipboard
            </div>
            <div
              onClick={() => setCurrentState("createorjoin")}
              className="button cancel"
            >
              Cancel
            </div>
          </div>
        )}
        {currentState === "joined" && (
          <div className="host-area">
            <div className="description">Successfully Joined Lobby</div>
            <div
              onClick={() => setCurrentState("createorjoin")}
              className="button cancel"
            >
              Leave Lobby
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default WatchTogether;
