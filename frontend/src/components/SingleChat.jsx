import { useContext, } from "react";
import ChatContext from "../context/ChatContext"
import { Box, IconButton, Typography } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat, user, setSelectedChat } = useContext(ChatContext);


    const getSender = (loggedUser, users) => {
        if (!users || users.length < 2) return "Unknown";

        return users[0]._id === loggedUser._id
            ? users[1].name
            : users[0].name;
    };

    const getSenderFull = (loggedUser, users) => {
        if (!users || users.length < 2) return;
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
                            justifyContent: "space-between",
                            px: { xs: 1, sm: 2 },
                            py: 1.5,
                            borderBottom: "1px solid #e0e0e0",
                            backgroundColor: "#fff",
                            width: "100%",
                        }}
                    >
                        {/* MOBILE BACK BUTTON */}
                        <IconButton
                            sx={{
                                display: { xs: "flex", md: "none" },
                            }}
                            onClick={() => setSelectedChat("")}
                        >
                            <FaArrowLeft size={20} />
                        </IconButton>

                        {/* Chat name */}
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "1rem",
                                    sm: "1.2rem",
                                    md: "1.5rem",
                                },
                                fontWeight: 600,
                                fontFamily: "Work Sans",
                                flexGrow: 1,   // take available space
                                ml: 1,
                            }}
                        >
                            {!selectedChat.isGroupChat
                                ? getSender(user, selectedChat.users)
                                : selectedChat.chatName.toUpperCase()}
                        </Typography>

                        {/* Eye/Edit icon at far right */}
                        {!selectedChat.isGroupChat ? (
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        ) : (
                            <UpdateGroupChatModal
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                            />
                        )}
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