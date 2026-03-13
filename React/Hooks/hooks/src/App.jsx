import { useState } from 'react'
import './App.css'
import PropdData from './components/Props';
import HooksPractice from './components/HooksPractice';

function App() {

  const [count, setCount] = useState(0);

  const countHandler = ()=>{
    setCount(count+1);
  }

  const myArry = [1,2,3]
  const myObj = {
    name:'test',
    age:34
  }

  return (
    <>
    <h1>Count:{count}</h1> 
    <button onClick={countHandler}>Count Run</button>  

    <PropdData name='somen' age='28' myArry={myArry}  myObj={myObj} />
    <HooksPractice/>
    </>
  )
}

export default App
