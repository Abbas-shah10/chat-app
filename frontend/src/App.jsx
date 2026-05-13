import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { ToastContainer } from "react-toastify";
import ChatContextProvider from "./context/ChatContextProvider";



function App() {
  return (
    <>
      <ChatContextProvider>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </ChatContextProvider>
    </>
  );
}

export default App;
