import { createContext, useReducer } from "react";

export const Context = createContext<any>(null);

const setUserToLocalStorage = ({ payload }: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(payload));
  }
};

const getUserFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  }
  return null;
};

const removeUserfromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};

const InitialState: any = {
  user: getUserFromLocalStorage(),
  properties: null,
};

const rootReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN": {
      setUserToLocalStorage({ payload: action.payload });
      return { ...state, user: action.payload };
    }

    case "LOGOUT": {
      removeUserfromLocalStorage();
      return { ...state, user: null };
    }

    default:
      return state;
  }
};

export const ContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(rootReducer, InitialState);
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};
