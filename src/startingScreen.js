import React, { useState } from 'react';
import BallGame from './App.js';

const ballTypes = [
    { value: 'normal', label: 'Normal Ball', hp: 100, dmg: 10, descr: "" },
    { value: 'tank', label: 'Tank Ball', hp: 200, dmg: 5, descr: "" },
    { value: 'dmg', label: 'Damage Ball', hp: 50, dmg: 20, descr: "" },
    { value: 'scale', label: 'Scale Ball', hp: 100, dmg: 1, descr: "" },
    { value: 'percent', label: 'Percent Ball', hp: 100, dmg: 0, descr: "" },
    { value: 'speed', label: 'Speed Ball', hp: 100, dmg: 10, descr: "" },
    { value: 'duplicate', label: 'Duplicate Ball', hp: 100, dmg: 5, descr: "" },
  ];
  
let balls = [];


const StartingScreen = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [ballElements, setBallElements] = useState([]);
    const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState(false);
    const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);
    const [isStartButtonVisible, setIsStartButtonVisible] = useState(false);
    const [currentBall, setCurrentBall] = useState("");
    const [currentBallName, setCurrentBallName] = useState("");


    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        const selectedBall = ballTypes.find(ball => ball.value === selectedValue);
        setCurrentBall(selectedBall);
        setCurrentBallName(selectedValue);
    }
  
    if (gameStarted) {
        return <BallGame initialBalls={balls} />;
    }
    
    return (
        <div className="start-screen">
            <div className="balls-list" style={{ display: isDeleteButtonVisible ? 'block' : 'none' }}>
                {ballElements.map((element, index) => (
                    <div key={index} className="ball-item-simple">
                        <span style={{ display: 'inline-block', width: '120px' }}>
                            {element.label}
                        </span>
                        <span style={{ display: 'inline-block', width: '80px' }}>
                            hp: {element.hp}
                        </span>
                        <span style={{ display: 'inline-block', width: '80px' }}>
                            dmg: {element.dmg}
                        </span>
                        <span>
                            description: {element.descr}
                        </span>
                    </div>
                ))}
            </div>
            <div className="add-line" style={{ display: isAddButtonVisible ? 'block' : 'none' }}>
                <div className="collapse-content">
                    <div className="select-with-button">
                    <select 
                        onChange={handleSelectChange}
                        value={currentBallName || ""}
                    >
                        <option value="" disabled>Select option</option>
                        {ballTypes.map(element => (
                        <option key={element.value} value={element.value}>
                            {element.label}
                        </option>
                        ))}
                    </select>
                    
                    <button 
                        className="add-ball"
                        style={{ display: isAddButtonVisible ? 'block' : 'none' }}
                        onClick={() => {
                            if (currentBallName){
                                balls.push(currentBallName);
                                setBallElements([...ballElements, currentBall]);
                                setIsDeleteButtonVisible(true);
                                if (balls.length === 4) setIsAddButtonVisible(false);
                                if (balls.length >= 2) setIsStartButtonVisible(true);
                                setCurrentBallName("");
                                setCurrentBall(null);
                            }
                        }}
                    >
                        Add Ball
                    </button>
                    </div>
                </div>
                </div>

            <div>
                <button 
                    className="delete-ball"
                    style={{ display: isDeleteButtonVisible ? 'block' : 'none' }}
                    onClick={() => {
                        balls.pop();
                        setBallElements(prev => prev.slice(0, -1));
                        setIsAddButtonVisible(true);
                        if (balls.length === 0) setIsDeleteButtonVisible(false);
                        if (balls.length < 2) setIsStartButtonVisible(false);
                    }}
                >
                Delete Ball
                </button>
            </div>
                
            <div>
                <button 
                    className="start-button"
                    style={{ display: isStartButtonVisible ? 'block' : 'none' }}
                    onClick={() => {
                        setGameStarted(true);

                    }}
                >
                Start Game
                </button>
            </div>
        </div>
    );
};

export default StartingScreen;