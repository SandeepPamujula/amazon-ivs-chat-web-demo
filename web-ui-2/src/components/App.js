import React, {useState} from 'react';
import SignIn from './chat/SignIn';
import Provider from './Provider';
import User from './User';
import Chat from './chat/Chat';

function App() {
  const [showSignIn, setShowSignIn] = useState(true);
  const [username, setUsername] = useState('');
  const [provider, setProvider] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState({})

  const handleSignIn = (selectedUsername, isprovider, avatarUrl) => {
    console.log(selectedUsername, isprovider,avatarUrl );
    // Set application state
    setUsername(selectedUsername);
    setProvider(isprovider);
    setAvatarUrl(avatarUrl)
    setShowSignIn(false)

    // Instantiate a chat room
    // const room = new ChatRoom({
    //   regionOrUrl: config.CHAT_REGION,
    //   tokenProvider: () =>
    //     tokenProvider(selectedUsername, isprovider, avatarUrl),
    // });
    // setChatRoom(room);

    // // Connect to the chat room
    // room.connect();
  };
  return (
    <div className="App full-width full-height">
        {showSignIn && <SignIn handleSignIn={handleSignIn} />}
        {!showSignIn &&
        <Provider username={username} isProvider={provider} avatarUrl={avatarUrl}/>
        }
      {/* <Chat /> */}
    </div>    
  );
}

export default App;
