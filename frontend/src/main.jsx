import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

/*
    React mein, createContext ka use ek Context object banane ke liye hota hai, jo state ko different components 
    ke beech share karne ke liye use hota hai bina har level par manually props pass kiye.
*/
export const Context = createContext({
  isAuthorized: false
})

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  return (
    <Context.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        user,
        setUser,
      }}
    >
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

/*

 Is code mein ek `Context` create kiya gaya hai React ke `createContext` function ka use karke, jisme default value 
`isAuthorized: false` di gayi hai. `Context` ko ek shared state ya data ke tarah samajh sakte hain jo component tree 
 mein kisi bhi component mein accessible hota hai, bina explicitly props pass kiye hue.

`AppWrapper` ek functional component hai jisme do state variables hain: `isAuthorized` aur `user`. 
`isAuthorized` ko initially `false` set kiya gaya hai, aur `user` ko ek empty object `{}` set kiya hai. 
 Yeh dono states component ke andar `useState` hook ka use karke handle ho rahi hain.

Iske baad, `AppWrapper` component return karta hai ek `Context.Provider`, jisme `value` prop ke through 
`isAuthorized`, `setIsAuthorized`, `user`, aur `setUser` ko provide kiya ja raha hai. `Context.Provider` 
ke andar `App` component render hota hai, jo saari values ko access kar sakta hai jo `Context.Provider` se pass hui hain.

*/
