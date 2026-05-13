import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useState } from "react";
import FormLabel from "@mui/material/FormLabel";
import Input from "@mui/material/Input";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    if (!email || !password) {
      toast.error("Please fill all the inputs");
    }
    try {
      const { data } = await axios.post("/api/v1/users/login", {
        email,
        password,
      });
      if (data) {
        toast.success("Login successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/chats");
      }
    } catch (e) {
      toast.error("Something went wrong", e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form className="sm:w-full md:w-[50%] md:mx-auto">
        <Grid spacing={2} width={"100%"} marginTop={6}>
          <Grid item marginBottom={2}>
            <FormLabel>Email</FormLabel>
            <Input
              id="email"
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item marginBottom={2}>
            <FormLabel>Password</FormLabel>
            <Input
              id="password"
              fullWidth
              type="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          onClick={handleSubmit}
          sx={{ border: "1px solid blue", padding: "10px" }}
          fullWidth
        >
          Log In
        </Button>
      </form>
    </>
  );
};

export default Login;
