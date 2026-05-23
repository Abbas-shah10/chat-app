import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Modal from '@mui/material/Modal';
import { FaEye, FaTimes, } from "react-icons/fa";
import ChatContext from '../context/ChatContext';
import { Chip, IconButton, List, ListItemButton, ListItemText, TextField } from '@mui/material';
import { toast } from 'react-toastify'
import axios from 'axios'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [groupChatName, setGroupChatName] = React.useState('')
    const [renameLoading, setRenameLoading] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const [searchResult, setSearchResult] = React.useState([]);
    const [loading, setLoading] = React.useState(false)

    const { selectedChat, setSelectedChat, user } = React.useContext(ChatContext)



    const handleRemove = (userId) => {
        setSelectedChat({ ...selectedChat, users: selectedChat.users?.filter((u) => u._id !== userId) })
    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find(u => u._id === user1._id)) {
            toast.success("User already in group")
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast.success("Only admins can add users")
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post(`/api/v1/group-add`, {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast.error('Error adding user', error)
        }
    }

    const handleRename = async () => {
        if (!groupChatName) return;
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.patch(`/api/v1/chats/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config)
            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
            toast.success("Chat group name updated SuccessfullY")
        } catch (error) {
            toast.error("Error renaming group chat name", error)
            setRenameLoading(false)
        }
    }
    const handleSearch = async (query) => {
        if (!query) {
            return
        }
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }

        try {
            setLoading(true)
            const { data } = await axios.get(`/api/v1/users?search=${search}`, config)
            console.log(data)
            setSearchResult(data)
        } catch (error) {
            toast.error("Error to load search users", error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div>
            <Button onClick={handleOpen}>
                <FaEye size={24} className='text-gray-500' />
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <DialogTitle sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontWeight: "bold",
                    }} id="modal-modal-title" variant="h6" component="h4">
                        {selectedChat.chatName}

                        <IconButton onClick={handleClose}>
                            <FaTimes size={24} />
                        </IconButton>
                    </DialogTitle>

                    <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", paddingBottom: "4px" }}>
                        {selectedChat.users.map(user => (
                            <Chip
                                key={user?._id}
                                label={user?.name}
                                onDelete={() => handleRemove(user._id)}
                                sx={{ marginRight: '3px' }}
                            />
                        ))}

                        <Box sx={{ display: 'flex', alignItems: "center", gap: "4px", }}>
                            <TextField fullWidth
                                label="Group Name"
                                variant="outlined"
                                sx={{ mt: 2 }}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />

                            <Button variant="contained"
                                sx={{ textTransform: "none", borderRadius: 2, marginTop: "10px", height: "73%" }}
                                onClick={handleRename}
                            >Update</Button>
                        </Box>
                        <TextField label="Add user to group"
                            variant="outlined"
                            sx={{ mt: 2, display: 'block' }}
                            onChange={(e) => handleSearch(e.target.value)} />
                        {/* <span className="loader"></span> */}
                        {loading ? (<span className="loader"></span>) : (
                            <List sx={{ maxHeight: 320, padding: 1 }}>
                                {searchResult.map((user) => (
                                    <ListItemButton
                                        key={user._id}
                                        onClick={() => handleAddUser(user)}
                                        sx={{
                                            borderRadius: 3,
                                            mb: 0.5,
                                            "&:hover": {
                                                bgcolor: "#f0f7ff",
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: "50%",
                                                bgcolor: "#1976d2",
                                                color: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold",
                                                mr: 2,
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {user.name?.charAt(0)}
                                        </Box>

                                        <ListItemText primary={user.name} secondary={user.email} />
                                    </ListItemButton>
                                ))}
                            </List>
                        )}
                    </Box>
                    <Button sx={{ marginTop: '4px', float: 'right' }} variant='contained' color='red' onClick={() => handleRemove(user)}>Leave Group</Button>
                </Box>


            </Modal>
        </div>
    )
}

export default UpdateGroupChatModal