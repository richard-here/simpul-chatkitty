import React from 'react';
import { LoadingChannels, ChatDown } from 'stream-chat-react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function CustomChannelListMessengerWrapper(cb) {
  return function CustomChannelListMessenger(props) {
    const {
      children,
      error = null,
      loading,
      LoadingErrorIndicator = ChatDown,
      LoadingIndicator = LoadingChannels,
    } = props;

    if (error) {
      return <LoadingErrorIndicator type="Connection Error" />;
    }

    if (loading) {
      return <LoadingIndicator />;
    }

    return (
      <div className="str-chat__channel-list-messenger str-chat__channel-list-messenger-react">
        <div
          aria-label="Channel list"
          className="str-chat__channel-list-messenger__main str-chat__channel-list-messenger-react__main"
          role="listbox"
        >
          {children}
          <Fab
            size="medium"
            color="primary"
            aria-label="create channel"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              margin: 2,
            }}
            onClick={() => cb('New Channel Incoming', 'notseenbeforeuser')}
          >
            <AddIcon />
          </Fab>
        </div>
      </div>
    );
  };
}
