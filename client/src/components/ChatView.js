/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
import {
  useMediaQuery,
  useTheme, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
  Typography,
  Snackbar,
  Alert,
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
  const smallerThanBreakpoint = useMediaQuery(theme.breakpoints.down('md'));
  const chatClient = props.chatClient;
  const [dialogState, setDialogState] = useState({
    open: false,
    groupName: '',
    username: '',
    loading: false,
  });
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'error',
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
  const handleSnackbarClose = () => {
    setSnackbarState({
      ...snackbarState,
      open: false,
      message: '',
    });
  };

  const createChannel = async () => {
    setDialogState({ ...dialogState, loading: true });
    const userQuery = await chatClient.queryUsers({ id: { $in: [dialogState.username] } });
    const userExist = userQuery.users.length !== 0;

    if (!userExist) {
      setSnackbarState({ open: true, message: 'User you invited does not exist', severity: 'error' });
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
      handleChannelDialogClose();
      setSnackbarState({ open: true, message: 'An error occurred when creating the chatroom', severity: 'error' });
    }
    setDialogState({
      username: '', groupName: '', loading: false, open: false,
    });
    setSnackbarState({ open: true, message: 'Chatroom created or already exists', severity: 'success' });
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
          <Stack direction="row">
            <TextField
              value={dialogState.groupName}
              onChange={(e) => (setDialogState({ ...dialogState, groupName: e.target.value }))}
              id="group-name"
              label="Group Name"
              variant="outlined"
              sx={{ marginRight: 2 }}
            />
            <TextField
              value={dialogState.username}
              onChange={(e) => (setDialogState({ ...dialogState, username: e.target.value }))}
              id="group-username"
              label="Username"
              variant="outlined"
              sx={{ marginRight: 2 }}
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
      <Snackbar open={snackbarState.open} autoHideDuration={1000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarState.severity} sx={{ width: '100%' }}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default ChatView;
