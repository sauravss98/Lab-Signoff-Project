import "./App.css";
import AppRouters from "./component/AppRouters/AppRouters";
import Header from "./component/Header/Header";

function App() {
  let isAuthenticated = false;
  let isAuthenticatedString = localStorage.getItem("authentication");
  if (isAuthenticatedString !== null) {
    isAuthenticated = JSON.parse(isAuthenticatedString);
  } else {
    isAuthenticated = false;
  }

  return (
    <div>
      {/* {isAuthenticated.is_authenticated ? <Header /> : null} */}
      <AppRouters />
    </div>
  );
}

export default App;
