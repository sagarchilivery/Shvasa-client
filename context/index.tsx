import { createContext, useReducer } from "react";

export const Context = createContext<any>(null);

const setAgentToLocalStorage = ({ payload }: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(payload));
  }
};

const setTokenToLocalStorage = ({ payload }: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", JSON.stringify(payload));
  }
};

const getAgentFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  }
  return null;
};

const getTokenFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("accessToken");
    return data ? JSON.parse(data) : null;
  }
  return null;
};

const removeUserfromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};

const removeTokenfromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};

const InitialState: any = {
  agent: getAgentFromLocalStorage(),
  accessToken: getTokenFromLocalStorage(),
};

const rootReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN": {
      setAgentToLocalStorage({ payload: action.payload.agent });
      setTokenToLocalStorage({ payload: action.payload.accessToken });
      return {
        ...state,
        agent: action.payload.agent,
        accessToken: action.payload.accessToken,
      };
    }

    case "LOGOUT": {
      removeUserfromLocalStorage();
      removeTokenfromLocalStorage();
      return { ...state, agent: null, accessToken: null };
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
