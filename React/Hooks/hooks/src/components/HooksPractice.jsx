import React, { useCallback, useEffect, useState } from 'react'

const HooksPractice = () => {
    const [length, SetLength] = useState(10);
    const [isNumberAllowed, setIsNumberAllowed ] = useState(false);
    const [isCharAllowed, setIsCharAllowed ] = useState(false);
    const [password, setPassWord] = useState("");


    const PasswordGenerator = useCallback(()=>{
        let pass = "";
        let str = "abjassdjkfhjhdfjksdfh";
        
        if(isNumberAllowed) {
            str += "0987789876876"
        }

        if(isCharAllowed)  str += "$%^&#2(*&%!"
    }, [length, isNumberAllowed, isCharAllowed])


    useEffect(()=>{

    },[])
    return (

    <>
        <div className="container">
            <div className="second-container">
                <h1>Password Gemerator</h1>
                <input type="text" />
                <button>Click</button>
            </div>
        </div>
    </>
  )
}

export default HooksPractice;
