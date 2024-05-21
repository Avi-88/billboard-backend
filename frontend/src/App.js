import "./App.css";
import Home from "./components/Home";
import TabsComp from "./Tabs";
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import SinglePage from "./components/SinglePage";
import Checkout from "./components/Checkout";
import { useState, useEffect } from "react";
import SearchDetails from "./components/SearchDetails";
import SearchPageFooter from "./components/SearchPageFooter";
import DetailsPage from "./components/DetailsPage";
import AddPost from "./components/AddPost";
import Login from "./components/Login";

function App() {
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="App">
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<Login />} />
            <Route
              path="/home"
              exact
              element={
                <>
                  {" "}
                  <Home toggle={open} setToggle={setOpen} />{" "}
                  <TabsComp toggle={open} setToggle={setOpen} />{" "}
                  <SearchPageFooter />{" "}
                </>
              }
            />
            <Route
              path="/:id"
              element={
                <>
                  {" "}
                  <Home /> <DetailsPage />{" "}
                </>
              }
            />
            <Route
              path="/addPost"
              exact
              element={
                <>
                  {" "}
                  <Home /> <AddPost />{" "}
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
