import { useContext, useEffect, useState, } from "react";
import ChatContext from "../context/ChatContext"
import { Box, TextField, IconButton, Typography } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import { toast } from "react-toastify";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client'
import { Lottie } from "lottie-react";
import rawAnimation from "../animation/typing.json";

const ENDPOINT = "http://localhost:8000";
let socket, selectedChatCompare;

const typingAnimation = rawAnimation.default ? rawAnimation.default : rawAnimation;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [socketConnected, setSocketConnected] = useState(false)
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("")
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)


    const { selectedChat, user, setSelectedChat } = useContext(ChatContext);

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on("connected", () => setSocketConnected(true))

        socket.on('typing', () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [])


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

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            event.preventDefault();
            socket.emit("stop typing", selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.post("/api/v1/messages", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)
                setNewMessage("")
                socket.emit("new message", data)
                setMessages([...messages, data])
            } catch (error) {
                toast.error("Cannot create", error)
            }
        }
    }


    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat) return;
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setLoading(true)
                const { data } = await axios.get(`/api/v1/messages/${selectedChat._id}`, config)
                console.log(data)
                setMessages(data)
                setLoading(false)
                socket.emit('join chat', selectedChat._id)
            } catch (error) {
                toast.error(error)
            }
        }
        fetchMessages()
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on('message received', (newMessagesReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessagesReceived.chat._id) {
                // give notifications
            } else {
                setMessages([...messages, newMessagesReceived])
            }
        })
    }, [])



    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return
        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        let timerLength = 3000;

        setTimeout(() => {
            let timeNow = new Date().getTime()
            let timeDifference = timeNow - lastTypingTime

            if (timeDifference >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
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
                            justifyContent: "flex-end",
                            padding: 3,
                            flexDirection: "column",
                            width: "100%",
                            height: "100%",
                            borderRadius: "10px",
                            overflowY: "hidden",
                        }}
                    >
                        {loading ? (<span className="spinner"></span>) : (<div className='messages'>
                            <ScrollableChat messages={messages} />
                        </div>)}
                    </Box>
                    <Box

                        component="form"
                        onKeyDown={sendMessage}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            p: 1,
                            backgroundColor: "#f5f5f5",
                        }}>
                        {isTyping ? (<div style={{ width: 300, margin: 'auto' }}>
                            <Lottie
                                animationData={typingAnimation}
                                loop
                                autoplay
                            />
                        </div>) : <></>}
                        <TextField
                            fullWidth
                            placeholder="Enter a message.."
                            variant="outlined"
                            size="small"
                            onChange={typingHandler}
                            value={newMessage}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#fff",
                                    borderRadius: "4px",

                                    "& fieldset": {
                                        borderColor: "#e0e0e0",
                                    },

                                    "&:hover fieldset": {
                                        borderColor: "#d0d0d0",
                                    },

                                    "&.Mui-focused fieldset": {
                                        borderColor: "#1976d2",
                                    },
                                },

                                "& input": {
                                    py: 1,
                                    px: 1,
                                    fontSize: "14px",
                                },

                                "& input::placeholder": {
                                    color: "#b0b0b0",
                                    opacity: 1,
                                },
                            }}
                        />
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