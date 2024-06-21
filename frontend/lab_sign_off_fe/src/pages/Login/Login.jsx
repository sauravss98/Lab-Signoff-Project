import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../Login/Login.css";
import axiosInstance from "../../utils/Axios.jsx";
import { authActions } from "../../store/auth.js";

const Login = () => {
  const dispatch = useDispatch();
  const [showText, setShowText] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newUser = {
      email: form.email,
      password: form.password,
    };

    try {
      const response = await axiosInstance.post("/users/login", newUser);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "authentication",
          JSON.stringify({ is_authenticated: true })
        );
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem("expiration", expiration.toISOString());
        console.log(response.data.user_type);
        dispatch(authActions.login({ user_type: response.data.user_type }));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        console.log("In elif");
        setShowText(true);
      }
      if (error.response.status === 404) {
        setShowText(true);
      }
    }
  };

  // const navigateToSignup = () => {
  //   navigate("/signUp");
  // };
  const Text = () => <p>Please Enter Correct Details</p>;

  return (
    <div className="page">
      <div className="mainContainer">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <div className="heading">Login</div>
            <div className="formDiv">
              <label>User Name:</label>
              <br />
              <input
                id="email"
                name="email"
                className="inputBox"
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={onChangeHandler}
              />
            </div>
            <div className="formDiv">
              <label>Password:</label>
              <br />
              <input
                id="password"
                name="password"
                className="inputBox"
                type="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={onChangeHandler}
              />
            </div>
            <button className="signInButton" type="submit">
              Login
            </button>
            {showText ? <Text /> : null}

            {/* <div className="notUser"> */}
            {/* <h3 className="notUserText">Not A User?</h3> */}
            {/* <button className="notUserButton" onClick={navigateToSignup}> */}
            {/* Sign Up */}
            {/* </button> */}
            {/* <button onClick={navigatetoHome}>Home</button> */}
            {/* </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
