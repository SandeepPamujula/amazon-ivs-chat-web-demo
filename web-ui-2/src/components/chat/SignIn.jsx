import React, { useState, createRef, useEffect } from "react";
import Avatars from "./Avatars";

const SignIn = ({ handleSignIn }) => {
  const [username, setUsername] = useState("");
  const [provider, setProvider] = useState(false);
  const [avatar, setAvatar] = useState({});
  const [loaded, setLoaded] = useState(false);
  const inputRef = createRef();

  useEffect(() => {
    setLoaded(true);
    inputRef.current.focus();
  }, [loaded]); // eslint-disable-line

  return (
    <div className="modal pos-absolute top-0 bottom-0">
      <div className="modal__el">
        <h1 className="mg-b-2">Join the chat room</h1>
        <form onSubmit={(e) => {e.preventDefault()}}>
          <fieldset>
            <label htmlFor="name" className="mg-b-05">
              Username
            </label>
            <input
              name="name"
              id="name"
              ref={inputRef}
              type="text"
              className="radius"
              placeholder="Type here..."
              autoComplete="off"
              value={username}
              onChange={(e) => {
                e.preventDefault();
                setUsername(e.target.value);
              }}
            />
            <hr />
            <div className="mg-b-05 label">Select Avatar</div>
            <div className="item-select-container pd-1 mg-b-1">
              <div className="avatars pos-relative item-select-grid">
                <Avatars
                  currentAvatar={avatar?.name}
                  handleAvatarClick={(avatar) => {
                    setAvatar(avatar);
                  }}
                />
              </div>
            </div>
            <hr />
            <div className="fl fl-a-center fl-j-start full-width">
              <input
                type="checkbox"
                name="provider"
                className="mg-l-0 mg-r-1"
                checked={provider}
                onChange={(e) => {
                  setProvider(e.target.checked);
                }}
              />
              <label htmlFor="provider">Join as provider</label>
            </div>
            <hr />
            <button
              onClick={(e) => {
                handleSignIn(username, provider, avatar);
              }}
              className="btn btn--primary rounded mg-t-1"
              disabled={!username}
            >
              Start chatting
            </button>
          </fieldset>
        </form>
      </div>
      <div className="modal__overlay"></div>
    </div>
  );
};

export default SignIn;
