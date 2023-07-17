import React, { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)

  const updateUser = (userData) => {
    setUserData(userData)
    localStorage.setItem('THNDRSRDT', JSON.stringify(userData))        
  }  
  
  useEffect(()=>{
    const savedData = JSON.parse(localStorage.getItem('THNDRSRDT'))
    if(savedData){
      updateUser(savedData)
    }else{
      updateUser(null)
    }    

  },[])
  return (
    <UserContext.Provider value={{ userData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };