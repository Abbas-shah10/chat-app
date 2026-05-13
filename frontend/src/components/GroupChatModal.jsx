import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
    Box,
    IconButton,
    Slide, List, ListItem, Skeleton, Stack, Chip
} from "@mui/material";
import { FaPlus, FaTimes } from "react-icons/fa";
import ChatContext from "../context/ChatContext";
import { toast } from "react-toastify";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const GroupChatModal = () => {
    const [open, setOpen] = React.useState(false);
    const [groupChatName, setGroupChatName] = React.useState("");
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([]);
    const [loading, setLoading] = React.useState(false);


    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const { user, chats, setChats } = React.useContext(ChatContext);


    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            setSearchResults([]);
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            }

            const { data } = await axios.get(`/api/v1/users?search=${search}`, config);
            setLoading(false)
            setSearchResults(data);
            console.log(data)
        } catch (error) {
            toast.error("Failed to load search results", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = () => {

    }
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.error("User already added");
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    const handleRemove = (userId) => {
        setSelectedUsers(selectedUsers.filter((u) => u._id !== userId));
    }

    // const handleDelete = (userId) => {

    // }

    return (
        <>
            {/* Trigger Button */}
            <Button
                variant="contained"
                startIcon={<FaPlus />}
                onClick={handleClickOpen}
                sx={{ textTransform: "none", borderRadius: 2 }}
            >
                New Group
            </Button>

            {/* Modal */}
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        p: 1,
                        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontWeight: "bold",
                    }}
                >
                    Create New Group


                    <IconButton onClick={handleClose}>
                        <FaTimes />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Enter a group name and start chatting instantly 🚀
                        </Typography>

                        <TextField
                            fullWidth
                            label="Group Name"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />

                        <TextField
                            fullWidth
                            label="Add Members name"
                            variant="outlined"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Box>

                    {/* Selected Users */}
                    <Stack direction="row" flexWrap="wrap" gap={1} mb={2} mt={2}>
                        {selectedUsers.map(user => (
                            <Chip
                                key={user._id}
                                label={user.name}
                                onDelete={() => handleRemove(user._id)}
                            />
                        ))}
                    </Stack>


                    {loading ? (

                        <List>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <ListItem
                                    key={i}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        py: 1.5,
                                    }}
                                >
                                    <Skeleton variant="circular" width={40} height={40} />

                                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                                        <Skeleton variant="text" width="80%" height={20} />
                                        <Skeleton variant="text" width="60%" height={15} />
                                    </Stack>
                                </ListItem>
                            ))}
                        </List>
                    ) : searchResults.length > 0 ? (
                        <List>
                            {searchResults?.slice(0, 4).map((user) => (
                                <ListItem
                                    key={user._id}
                                    onClick={() => handleGroup(user)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        py: 1.5,
                                        borderRadius: 2,
                                        cursor: "pointer",
                                        "&:hover": {
                                            bgcolor: "#f5f7fb",
                                        },
                                    }}
                                >
                                    {/* Avatar (real user data, not skeleton) */}
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
                                            textTransform: "uppercase",
                                        }}

                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </Box>

                                    <Stack spacing={0.3} sx={{ flex: 1 }} >
                                        <Typography fontWeight={600} >
                                            {user.name}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {user.email}
                                        </Typography>
                                    </Stack>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        // 💤 No results state
                        <Typography
                            sx={{ textAlign: "center", mt: 2 }}
                            color="text.secondary"
                        >
                            No users found
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} sx={{ textTransform: "none" }}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            px: 3,
                            background: "linear-gradient(135deg, #38b2ac, #319795)",
                        }}
                        onClick={handleSubmit}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GroupChatModal;