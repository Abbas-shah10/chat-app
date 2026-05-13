import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useState } from "react";
import Input from "@mui/material/Input";
import FormLabel from "@mui/material/FormLabel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  // const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all the inputs");
    }
    if (password !== confirmPassword) {
      toast.error("Passwords must match");
    }

    try {
      const { data } = await axios.post("/api/v1/users", {
        name,
        email,
        password,
        pic,
      });

      if (data) {
        toast.success("Registration successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
      }
      setLoading(false);
    } catch (e) {
      toast.error("Something went wrong", e.response.data.message);
    }
  };

  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast.error("Please select an image");
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dd1ppveq8");
      fetch("https://api.cloudinary.com/v1_1/dd1ppveq8/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  };
  return (
    <form className="sm:w-full md:w-[50%] md:mx-auto">
      <Grid spacing={2} width={"100%"} marginTop={6}>
        <Grid width="100%" item marginBottom={2}>
          <FormLabel>Name</FormLabel>
          <Input
            id="name"
            label="Name"
            value={name}
            fullWidth
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item marginBottom={2}>
          <FormLabel>Email</FormLabel>
          <Input
            id="email"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item marginBottom={2}>
          <FormLabel>Password</FormLabel>
          <Input
            id="password"
            fullWidth
            type={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item marginBottom={2}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            id="confirmPassword"
            fullWidth
            type={"password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Grid>
        <Grid item marginBottom={2}>
          <FormLabel>Upload your Image</FormLabel>
          <Input
            fullWidth
            type="file"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </Grid>
      </Grid>
      <Button
        onClick={handleSubmit}
        sx={{ border: "1px solid blue", padding: "10px" }}
        fullWidth
      >
        Sign Up
      </Button>
    </form>
  );
};

export default Signup;
