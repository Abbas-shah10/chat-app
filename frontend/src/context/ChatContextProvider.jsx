import { useEffect, useState } from "react";
import ChatContext from "./ChatContext";

const ChatContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([])

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    // if (!userInfo) {
    //   history("/");
    // }
  }, []);

  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
