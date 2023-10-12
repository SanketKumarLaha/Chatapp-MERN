import { createContext, useEffect, useReducer } from "react";

export const authContext = createContext(null);

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        user: action.payload,
      };
    }
    case "LOGOUT": {
      return {
        user: null,
      };
    }
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  console.log("AuthContextProvider", state);
  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(localStorage.getItem("user")),
    });
  }, []);

  return (
    <authContext.Provider value={{ ...state, dispatch }}>
      {children}
    </authContext.Provider>
  );
};
