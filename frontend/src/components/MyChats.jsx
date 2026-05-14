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

const MyChats = ({ fetchAgain, setFetchAgain }) => {
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
  }, [fetchAgain]);

  return (
    <Paper
      elevation={3}
      sx={{
        display: {
          xs: selectedChat ? "none" : "flex",
          md: "flex",
        },

        flexDirection: "column",

        // FULL WIDTH ON MOBILE
        width: {
          xs: "100%",
          sm: "45%",
          md: "32%",
          lg: "26%",
        },

        // FULL HEIGHT MOBILE
        height: {
          xs: "100vh",
          md: "100%",
        },

        // REMOVE RADIUS ON MOBILE
        borderRadius: {
          xs: 0,
          sm: 2,
          md: 3,
        },

        overflow: "hidden",
        bgcolor: "#fff",

        // PREVENT FLEX ISSUES
        flexShrink: 0,

        // MOBILE SAFE
        position: {
          xs: "fixed",
          md: "relative",
        },

        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
          },

          py: {
            xs: 1.5,
            sm: 2,
          },

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          gap: 1,

          borderBottom: "1px solid #eee",
          bgcolor: "#fafafa",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            fontSize: {
              xs: "0.95rem",
              sm: "1.1rem",
              md: "1.2rem",
            },

            whiteSpace: "nowrap",
          }}
        >
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

              minWidth: "fit-content",

              fontSize: {
                xs: "0.7rem",
                sm: "0.8rem",
              },

              px: {
                xs: 1,
                sm: 1.5,
              },

              py: {
                xs: 0.5,
                sm: 0.8,
              },
            }}
          >
            New
          </Button>
        </GroupChatModal>
      </Box>

      {/* CHAT LIST */}
      <Box
        sx={{
          flex: 1,

          overflowY: "auto",

          bgcolor: "#f5f7fb",

          px: {
            xs: 0.5,
            sm: 1,
          },

          py: 1,

          // SMOOTH MOBILE SCROLL
          WebkitOverflowScrolling: "touch",

          scrollBehavior: "smooth",
        }}
      >
        {chats ? (
          <List sx={{ p: 0 }}>
            {chats.map((chat, index) => {
              const isSelected =
                selectedChat?._id === chat._id;

              return (
                <Box key={chat._id}>
                  <ListItemButton
                    onClick={() => setSelectedChat(chat)}
                    sx={{
                      borderRadius: 2,

                      mb: 0.5,

                      px: {
                        xs: 1,
                        sm: 1.5,
                      },

                      py: {
                        xs: 1,
                        sm: 1.2,
                      },

                      bgcolor: isSelected
                        ? "#38b2ac"
                        : "transparent",

                      color: isSelected
                        ? "#fff"
                        : "#000",

                      transition: "0.2s ease",

                      "&:hover": {
                        bgcolor: isSelected
                          ? "#2c9c98"
                          : "#e6f7f6",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        !chat.isGroupChat
                          ? getSender(
                            loggedUser,
                            chat.users
                          )
                          : chat.chatName
                      }
                      primaryTypographyProps={{
                        fontWeight: 500,

                        fontSize: {
                          xs: "0.82rem",
                          sm: "0.92rem",
                          md: "0.95rem",
                        },

                        noWrap: true,

                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
