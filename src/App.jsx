import welcomeImage from '/welcome.png'
import './App.css'
import {useRef} from "react";
import DropLayout from "./layouts/DropLayout/DropLayout.jsx";


function App() {

    const ref = useRef(null);

    const handleClick = () => {
        ref.current?.scrollIntoView({behavior: 'smooth'});
    };
    return (
        <div className="container">
            <div className="fullscreen-image" onMouseEnter={handleClick}>
                <img src={welcomeImage} alt="Background"/>
            </div>
            <div className={`form-container`}>
                <DropLayout/>
            </div>
            <div ref={ref}/>
        </div>
    );
}

export default App
