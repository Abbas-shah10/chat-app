import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FaEye } from "react-icons/fa";
import { Button } from '@mui/material';

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

const ProfileModal = ({ user, children }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            {children ? (
                <span onClick={() => setOpen(true)}>{children}</span>
            ) : (
                <IconButton onClick={() => setOpen(true)}>
                    <FaEye size={25} />
                </IconButton>
            )}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <Box sx={{ ...style, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography id="modal-modal-title" variant="h2" component="h2" sx={{ mb: 2, fontSize: "1.5rem" }}>
                        {user.name}
                    </Typography>
                    {/* <img src={user?.pic} alt={user.name} style={{ width: "100%" }} /> */}
                    <p className="text-[1.25rem]">Email: {user?.email}</p>
                    <Button onClick={() => setOpen(false)} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Close
                    </Button>
                </Box>

            </Modal>
        </>
    )
}

export default ProfileModal