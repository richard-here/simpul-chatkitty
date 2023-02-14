/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
import {
  useMediaQuery,
  useTheme, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { React, useState } from 'react';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  Window,
  Thread,
  MessageInput,
  ChannelList,
} from 'stream-chat-react';
import '../styles/chatview.css';
import CustomChannelListMessengerWrapper from './getstream/CustomChannelListMessenger';

function ChatView(props) {
  const theme = useTheme();
  const smallerThanBreakpoint = useMediaQuery(theme.breakpoints.down('lg'));
  const chatClient = props.chatClient;
  const { onShowSnackbarCb } = props;
  const [dialogState, setDialogState] = useState({
    open: false,
    groupName: '',
    groupNameInvalid: false,
    groupNameHelperText: '',
    username: '',
    usernameInvalid: false,
    usernameHelperText: '',
    loading: false,
  });

  const filters = { members: { $in: [sessionStorage.getItem('id')] } };
  const sort = { last_message_at: -1 };

  const toggleDialog = () => {
    setDialogState({ ...dialogState, open: !dialogState.open });
  };
  const handleChannelDialogClose = () => {
    setDialogState({
      loading: false, open: false, username: '', groupName: '',
    });
  };

  const validateUsername = (inputMoniker) => {
    const invalid = !/^[a-zA-Z0-9]{6,}$/.test(inputMoniker);
    if (invalid) {
      setDialogState({
        ...dialogState,
        usernameHelperText: 'Username is required and can only contain alphanumeric characters with a min length of 6',
        usernameInvalid: true,
      });
    } else {
      setDialogState({
        ...dialogState,
        usernameHelperText: '',
        usernameInvalid: false,
      });
    }
    return invalid;
  };

  const validateGroupName = (inputGroupName) => {
    const invalid = !/^.{1,}$/.test(inputGroupName);
    if (invalid) {
      setDialogState({
        ...dialogState,
        groupNameHelperText: 'Group name is required',
        groupNameInvalid: true,
      });
    } else {
      setDialogState({
        ...dialogState,
        groupNameHelperText: '',
        groupNameInvalid: false,
      });
    }
    return invalid;
  };

  const createChannel = async () => {
    setDialogState({ ...dialogState, loading: true });
    const userQuery = await chatClient.queryUsers({ id: { $in: [dialogState.username] } });
    const userExist = userQuery.users.length !== 0;

    if (!userExist) {
      onShowSnackbarCb('User you invited does not exist', 'error');
      handleChannelDialogClose();
      return;
    }
    const newChannel = chatClient.channel('messaging', {
      name: dialogState.groupName,
      members: [sessionStorage.getItem('id'), dialogState.username],
    });

    try {
      await newChannel.create();
    } catch (e) {
      onShowSnackbarCb('An error occurred when creating the chatroom', 'error');
      handleChannelDialogClose();
    }
    setDialogState({
      username: '', groupName: '', loading: false, open: false,
    });
    onShowSnackbarCb('Chatroom created or already exists', 'success');
  };

  return (
    <Stack direction="row" height="100%">
      <Chat client={chatClient}>
        <ChannelList
          filters={filters}
          sort={sort}
          List={CustomChannelListMessengerWrapper(toggleDialog)}
        />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread fullWidth={smallerThanBreakpoint} />
        </Channel>
      </Chat>
      <Dialog open={dialogState.open} onClose={handleChannelDialogClose}>
        <DialogTitle>Create New Chatroom</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: 4 }}>
            To create a new chatroom, name the chatroom and invite an existing
            user account by username.
          </DialogContentText>
          <Stack direction="column" spacing={2}>
            <TextField
              value={dialogState.groupName}
              onChange={(e) => (setDialogState({ ...dialogState, groupName: e.target.value }))}
              id="group-name"
              label="Group Name"
              variant="outlined"
              onBlur={(e) => validateGroupName(e.target.value)}
              error={dialogState.groupNameInvalid}
              helperText={dialogState.groupNameHelperText}
            />
            <TextField
              value={dialogState.username}
              onChange={(e) => (setDialogState({ ...dialogState, username: e.target.value }))}
              id="group-username"
              label="Username"
              variant="outlined"
              onBlur={(e) => validateUsername(e.target.value)}
              error={dialogState.usernameInvalid}
              helperText={dialogState.usernameHelperText}
            />
            <LoadingButton
              onClick={createChannel}
              id="login"
              label="Login"
              variant="contained"
              loading={dialogState.loading}
            >
              <Typography variant="button">Create Chatroom</Typography>
            </LoadingButton>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

export default ChatView;
