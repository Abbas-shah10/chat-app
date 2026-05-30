import { useId, useState } from "react";
import {
  Box,
  Button,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Backdrop,
  Fade,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Badge,
  ClickAwayListener,
  Paper,
} from "@mui/material";
import {

} from "@mui/material";
import { useContext } from "react";
import ChatContext from "../context/ChatContext";

import { FaChevronDown, FaSearch, FaTimes } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NotificationsIcon from "@mui/icons-material/Notifications";



// const Search = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   "&:hover": {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginLeft: 0,
//   width: "100%",
//   [theme.breakpoints.up("sm")]: {
//     marginLeft: theme.spacing(1),
//     width: "auto",
//   },
// }));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "inherit",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//   },
// }));

function SideBar() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLoading, setLoadingChat] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = useContext(ChatContext);


  const handleSearch = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get(`/api/v1/users?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (e) {
      toast.error("Failed to fetched all users", e);
    }
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("userInfo");
      navigate("/");
      toast.success("Logout Successfully");
    } catch (e) {
      toast.error("Logout Failed", e.response.data.message);
    }
  };


  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post("/api/v1/chats", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
    } catch (e) {
      toast.error("Failed to create chat", e.response.data.message);
      setLoadingChat(false);
    }
  };

  const id = useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };




  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name
  }


  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "white",
          width: "100%",
          padding: "5px 10px 5px 10px",
          borderWidth: "5px",
        }}
      >
        {/* Search Overlay */}
        <Backdrop
          open={openSearch}
          sx={{
            zIndex: 1300,
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
        >
          <Fade in={openSearch}>
            <Box
              sx={{
                width: { xs: "92%", sm: 500 },
                bgcolor: "#fff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              }}
            >
              {/* Search Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1.5,
                  borderBottom: "1px solid #eee",
                }}
              >
                <FaSearch size={20} color="gray" />

                <InputBase
                  autoFocus
                  fullWidth
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{
                    ml: 2,
                    fontSize: "1rem",
                  }} />

                <Button
                  onClick={handleSearch}
                  sx={{
                    ml: 1,
                    borderRadius: "10px",
                    textTransform: "none",
                    px: 2,
                  }}
                  variant="contained"
                >
                  Search
                </Button>

                <IconButton
                  onClick={() => setOpenSearch(true)}
                  sx={{
                    bgcolor: "#5865F2",
                    color: "white",
                    width: 48,
                    height: 48,
                    "&:hover": {
                      bgcolor: "#4752C4",
                      transform: "scale(1.05)",
                    },
                    transition: "all .2s ease",
                  }}
                >
                  <FaSearch />
                </IconButton>
              </Box>

              {/* Results */}
              <List sx={{ maxHeight: 320, overflowY: "auto", p: 1 }}>
                {searchResult?.length > 0 ? (
                  searchResult.map((user) => (
                    <ListItemButton
                      key={user._id}
                      sx={{
                        borderRadius: 3,
                        mb: 0.5,
                        "&:hover": {
                          bgcolor: "#f0f7ff",
                        },
                      }}
                    >
                      <Box
                        onClick={() => accessChat(user._id)} key={user._id}
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
                  ))
                ) : (
                  <Typography
                    sx={{
                      textAlign: "center",
                      py: 4,
                      color: "gray",
                    }}
                  >
                    Search users...
                  </Typography>
                )}
              </List>
            </Box>
          </Fade>
        </Backdrop>

        {/* Open Search Button */}
        <IconButton
          onClick={() => setOpenSearch(true)}
          sx={{
            bgcolor: "#1976d2",
            color: "#fff",
            "&:hover": {
              bgcolor: "#1565c0",
            },
          }}
        >
          <FaSearch />
        </IconButton>

        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            letterSpacing: 1,
          }}
        >
          💬 ChatApp
        </Typography>


        <div className="flex items-center gap-3 relative">
          <IconButton
            sx={{
              color: "white",
              bgcolor: "#2f3136",
              width: 42,
              height: 42,
              "&:hover": {
                bgcolor: "#40444B",
              },
            }}
            color="inherit"
            onClick={() => setOpenNotification(!openNotification)}
          >
            <Badge badgeContent={notification.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {openNotification && (
            <ClickAwayListener
              onClickAway={() => setOpenNotification(false)}
            >
              <Paper
                elevation={4}
                sx={{
                  position: "absolute",
                  top: "120%",
                  right: 0,
                  width: 340,
                  overflow: "hidden",
                  borderRadius: 3,
                  bgcolor: "#2B2D31",
                  color: "white",
                  border: "1px solid #40444B",
                  zIndex: 9999,
                }}
              >
                <Typography
                  sx={{
                    px: 2,
                    py: 1.5,
                    fontWeight: 700,
                    bgcolor: "#1E1F22",
                  }}
                >
                  Notifications
                </Typography>

                <Divider />

                {notification.length > 0 ? (
                  notification.map((notif) => (
                    <MenuItem key={notif._id} onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}>
                      {notif.chat.isGroupChat
                        ? `New message in ${notif.chat.chatName}`
                        : `New message from ${getSender(
                          user,
                          notif.chat.users
                        )}`}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled sx={{
                    py: 1.5,
                    "&:hover": {
                      bgcolor: "#40444B",
                    },
                  }}>
                    No new messages
                  </MenuItem>
                )}
              </Paper>
            </ClickAwayListener>
          )}

          <Button
            id={buttonId}
            aria-controls={open ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={open}
            onClick={handleClick}
          >
            <Box sx={{ position: "relative", display: 'flex' }}>

              <Avatar
                src={user?.avatar}
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "#5865F2",
                  fontWeight: "bold",
                  boxShadow: "0 0 0 3px #2f3136",
                }}
              >
                {user?.name?.charAt(0)}
                {/* <FaChevronDown size={20} /> */}
              </Avatar>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 12,
                  height: 12,
                  bgcolor: "#3BA55D",
                  borderRadius: "50%",
                  border: "2px solid #202225",
                }}
              />
            </Box>
          </Button>
          <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                bgcolor: "#2B2D31",
                color: "white",
                borderRadius: 3,
                mt: 1,
                minWidth: 200,
                border: "1px solid #40444B",
              },
            }}
            slotProps={{
              list: {
                'aria-labelledby': buttonId,
              },
            }}
          >
            <ProfileModal user={user}>
              <MenuItem sx={{
                "&:hover": {
                  bgcolor: "#40444B",
                },
              }} onClick={handleClick}>My Profile</MenuItem>
            </ProfileModal>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Box>


    </>
  );
}

export default SideBar;
