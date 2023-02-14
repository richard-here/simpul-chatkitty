import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { Box, ThemeProvider } from '@mui/material';
import axios from 'axios';
import Auth from './components/Auth';
import ChatView from './components/ChatView';
import theme from './theme/Theme';
import 'stream-chat-react/dist/css/v2/index.css';
import './stream-override.css';
import './layout.css';

function App() {
  const [state, setState] = useState({
    isAuthenticated: false,
    token: sessionStorage.getItem('token'),
    id: sessionStorage.getItem('id'),
    image: 'https://stepupandlive.files.wordpress.com/2014/09/3d-animated-frog-image.jpg',
  });
  const [loading, setLoading] = useState(true);
  const [chatClient] = useState(new StreamChat(process.env.REACT_APP_API_KEY));

  const connectUser = async (moniker, token) => {
    await chatClient.connectUser(
      {
        id: moniker,
      },
      token,
    );

    setState({
      isAuthenticated: true,
      // eslint-disable-next-line no-underscore-dangle
      id: moniker,
      token,
    });
  };

  const onLoginCallback = (user) => {
    setLoading(true);
    const data = { user: { ...user } };
    axios
      .post('http://localhost:3010/users', data)
      .then(async (res) => {
        if (res.data.token === '') {
          window.alert('Error occurred while authenticating you');
          return;
        }

        await connectUser(res.data.user.moniker, res.data.token);
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('id', res.data.user.moniker);
      })
      .catch((err) => {
        console.log('Error logging in', err);
        window.alert('Could not log you in');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (state.id && state.token) {
      connectUser(state.id, state.token)
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else setLoading(false);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box flexGrow={1}>
        { !state.isAuthenticated ? (
          <Auth cb={onLoginCallback} open loading={loading} />
        ) : (
          <ChatView chatClient={chatClient} />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
