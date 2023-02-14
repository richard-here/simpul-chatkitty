/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
import React from 'react';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  Window,
  Thread,
  MessageInput,
} from 'stream-chat-react';

function ChatView(props) {
  const chatClient = props.chatClient;
  const channel = chatClient.channel('messaging', 'rails-chat');
  channel.watch();

  return (
    <Chat client={chatClient}>
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}

export default ChatView;
