import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Modal from '@mui/material/Modal';
import { FaEye, FaTimes, } from "react-icons/fa";
import ChatContext from '../context/ChatContext';
import { Chip, DialogContent, IconButton, TextField } from '@mui/material';

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

    const { selectedChat, setSelectedChat, user } = React.useContext(ChatContext)


    const handleRemove = (id) => {
        setSelectedChat(selectedChat.users.filter((u) => u._id !== id))
    }

    const handleRename = () => { }
    const handleSearch = () => { }


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
                            sx={{ mt: 2 }}
                            value={groupChatName}
                            onChange={(e) => handleSearch(e.target.value)} />

                        <Button sx={{ marginTop: '4px' }} variant='contained' color='red' onClick={() => handleRemove(user)}>Leave Group</Button>
                    </Box>
                </Box>


            </Modal>
        </div>
    )
}

export default UpdateGroupChatModal