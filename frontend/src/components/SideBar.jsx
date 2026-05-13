import { useId, useState } from "react";
import {
  Box,
  Tooltip,
  Button,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  ListItem,
  Backdrop,
  Fade,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
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

  const { user, setSelectedChat, chats, setChats } = useContext(ChatContext);


  const handleSearch = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get(`/api/v1/users?search=${search}`, config);
      console.log(data);
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

                <IconButton onClick={() => setOpenSearch(false)}>
                  <FaTimes />
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

        <h1 className="text-2xl text-black font-semibold">ChatApp</h1>

        <div>
          <Button
            id={buttonId}
            aria-controls={open ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={open}
            onClick={handleClick}
          >
            <Avatar sx={{ mr: 2 }} src={user?.avatar}>
              {user?.name?.charAt(0)}
            </Avatar>
            <FaChevronDown size={20} />
          </Button>
          <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                'aria-labelledby': buttonId,
              },
            }}
          >
            <ProfileModal user={user}>
              <MenuItem onClick={handleClick}>My Profile</MenuItem>
            </ProfileModal>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Box>


    </>
  );
}

export default SideBar;
