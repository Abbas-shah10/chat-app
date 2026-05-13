import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect, useState } from "react";
import SignUp from "../components/Auth/Signup";
import LoginIn from "../components/Auth/Login";
import { useNavigate } from "react-router-dom";

const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      className="mt-4 p-3"
    >
      {children}
    </div>
  );
};

const HomePage = () => {
  const [tab, setTab] = useState("0");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);
  return (
    <Container maxWidth="xl" centerContent>
      <Box
        sx={{
          display: "flex",
          border: "none",
          justifyContent: "center",
          borderRadius: "3px",
          borderWidth: "1px",
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(90deg, #2979ff, #00bcd4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
            textAlign: "center",
            marginTop: "10vh",
          }}
        >
          Welcome to Chat App
        </Typography>
      </Box>
      <Box
        sx={{
          background: "white",
          width: "100%",
          border: "none",
          padding: "4px",
          borderRadius: "lg",
          borderWidth: "1px",
          marginTop: "5vh",
        }}
      >
        <Tabs
          aria-label="basic tabs example"
          centered
          value={tab}
          onChange={(_, v) => setTab(v)}
        >
          <Tab sx={{ width: "50%" }} value="0" label="Sign Up" />
          <Tab sx={{ width: "50%" }} value="1" label="Log In" />
        </Tabs>
        <TabPanel value={tab} index="0">
          <SignUp />
        </TabPanel>
        <TabPanel value={tab} index="1">
          <LoginIn />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default HomePage;
