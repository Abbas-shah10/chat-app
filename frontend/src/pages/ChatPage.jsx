import { useContext } from "react";
import ChatContext from "../context/ChatContext";
import { Box } from "@mui/material";
import SideBar from "../components/SideBar";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const { user } = useContext(ChatContext);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}
      <Box className="flex  justify-between w-full h-[95.5vh] p-2">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
