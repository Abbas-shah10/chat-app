import { useContext, useEffect, useState } from "react";
import ChatContext from "../context/ChatContext"
import { Box, IconButton, Typography } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import ProfileModal from "./ProfileModal";

const SingleChat = () => {
    const { selectedChat, user, setSelectedChat } = useContext(ChatContext);


    const getSender = (loggedUser, users) => {
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name
    }

    const getSenderFull = (loggedUser, users) => {
        return users[0]._id === loggedUser._id ? users[1] : users[0]
    }

    return (
        <>
            {selectedChat ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        backgroundColor: "#f8f8f8",
                        borderRadius: {
                            xs: 0,
                            md: 3,
                        },
                    }}
                >
                    {/* CHAT HEADER */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,

                            px: {
                                xs: 1,
                                sm: 2,
                            },

                            py: 1.5,

                            borderBottom: "1px solid #e0e0e0",
                            backgroundColor: "#fff",
                        }}
                    >
                        {/* MOBILE BACK BUTTON */}
                        <IconButton
                            sx={{
                                display: {
                                    xs: "flex",
                                    md: "none",
                                },
                            }}
                            onClick={() => setSelectedChat("")}
                        >
                            <FaArrowLeft size={20} />
                        </IconButton>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "1rem",
                                    sm: "1.2rem",
                                    md: "1.5rem",
                                },

                                fontWeight: 600,
                                fontFamily: "Work Sans",

                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                </>
                            )}
                        </Typography>
                    </Box>

                    {/* CHAT AREA */}
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            width: "100%",
                            height: "100%",
                            borderRadius: "10px",
                            overflowY: "hidden",
                        }}
                    >
                        <Typography color="text.secondary">
                            Start chatting...
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: {
                            xs: "none",
                            md: "flex",
                        },

                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",

                        height: "100%",

                        borderRadius: 3,
                        backgroundColor: "#f8f8f8",

                        p: 3,
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: {
                                md: "1.4rem",
                                lg: "1.8rem",
                            },

                            fontFamily: "Work Sans",
                            fontWeight: 500,
                        }}
                    >
                        Click on a user to start chatting
                    </Typography>
                </Box>
            )}

        </>
    )
}

export default SingleChat