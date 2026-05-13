import { useContext, useEffect, useState } from "react";
import ChatContext from "../context/ChatContext";
import axios from 'axios'
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { FaPlus } from 'react-icons/fa'
import GroupChatModal from "./GroupChatModal";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } = useContext(ChatContext);


  const fetchChats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.get("/api/v1/chats", config);
      setChats(data);
    } catch (error) {
      toast.error("Failed to fetch chats", error);
    }
  };

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [])

  return (
    <Paper
      elevation={3}
      sx={{
        display: { xs: selectedChat ? "none" : "flex", md: "flex" },
        flexDirection: "column",
        width: { xs: "100%", md: "30%" },
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "#ffffff",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          bgcolor: "#fafafa",
        }}
      >
        <Typography variant="h6" fontWeight="600">
          My Chats
        </Typography>

        <GroupChatModal>
          <Button
            variant="contained"
            size="small"
            startIcon={<FaPlus />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      {/* Chat List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          bgcolor: "#f5f7fb",
        }}
      >
        {chats ? (
          <List sx={{ p: 1 }}>
            {chats.map((chat, index) => {
              const isSelected = selectedChat?._id === chat._id;

              return (
                <Box key={chat._id}>
                  <ListItemButton
                    onClick={() => setSelectedChat(chat)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      bgcolor: isSelected ? "#38b2ac" : "transparent",
                      color: isSelected ? "white" : "black",
                      transition: "0.2s",
                      "&:hover": {
                        bgcolor: isSelected ? "#2c9c98" : "#e6f7f6",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        !chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName
                      }
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: "0.95rem",
                      }}
                    />
                  </ListItemButton>

                  {index !== chats.length - 1 && (
                    <Divider sx={{ opacity: 0.4 }} />
                  )}
                </Box>
              );
            })}
          </List>
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography color="text.secondary">
              Loading chats...
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );

};

export default MyChats;
