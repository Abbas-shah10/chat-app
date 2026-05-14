import { useContext } from 'react';
import ChatContext from '../context/ChatContext';
import { Box } from '@mui/material';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useContext(ChatContext);


  return <Box sx={{ base: selectedChat ? "flex" : 'none', md: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", p: 3, bg: "white", width: { sm: "100%", md: "68%" }, borderRadius: "lg", borderWidth: "1px" }}>

    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
  </Box>;
};

export default ChatBox;
