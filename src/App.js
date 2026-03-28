import React, { useRef, useEffect, useState } from 'react';

const W = 800;
const H = 600;

let gameSpeed = "normal";


const BallGame = ({ initialBalls = [] }) => {
    const [ballsToAdd] = useState(initialBalls);
    const hasInitialized = useRef(false);
    let numberOfBalls = 0;
    const canvasRef = useRef(null);
    const [balls, setBalls] = useState([]);
    let [gameOver, setGameOver] = useState(false);
    let [winner, setWinner] = useState(null);

    function dist(xa, ya, xb, yb) {
        return Math.sqrt((xa - xb) * (xa - xb) + (ya - yb) * (ya - yb));
    }

    function normalizeVector(v) {
        const sqDir = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        return [v[0] / sqDir, v[1] / sqDir];
    }

    function getNewSpeedAndDirections(BallA, BallB) {
        const vec = [BallB.x - BallA.x, BallB.y - BallA.y];
        const n = normalizeVector(vec);

        const v1n = BallA.speed * (BallA.dir[0] * n[0] + BallA.dir[1] * n[1]);
        const v2n = BallB.speed * (BallB.dir[0] * n[0] + BallB.dir[1] * n[1]);

        const m1 = BallA.mass;
        const m2 = BallB.mass;
        const v1n_new = ((m1 - m2) / (m1 + m2)) * v1n + (2 * m2 / (m1 + m2)) * v2n;
        const v2n_new = (2 * m1 / (m1 + m2)) * v1n + ((m2 - m1) / (m1 + m2)) * v2n;

        const t = [-n[1], n[0]];
        const v1t = BallA.speed * (BallA.dir[0] * t[0] + BallA.dir[1] * t[1]);
        const v2t = BallB.speed * (BallB.dir[0] * t[0] + BallB.dir[1] * t[1]);

        const relVelX = (BallB.speed * BallB.dir[0]) - (BallA.speed * BallA.dir[0]);
        const relVelY = (BallB.speed * BallB.dir[1]) - (BallA.speed * BallA.dir[1]);

        const diffX = BallB.x - BallA.x;
        const diffY = BallB.y - BallA.y;
        
        const dotProduct = relVelX * diffX + relVelY * diffY;
        if (dotProduct > 0) return;

        BallA.speed = Math.sqrt(v1n_new * v1n_new + v1t * v1t);
        BallB.speed = Math.sqrt(v2n_new * v2n_new + v2t * v2t);

        BallA.dir[0] = (v1n_new * n[0] + v1t * t[0]) / BallA.speed;
        BallA.dir[1] = (v1n_new * n[1] + v1t * t[1]) / BallA.speed;

        BallB.dir[0] = (v2n_new * n[0] + v2t * t[0]) / BallB.speed;
        BallB.dir[1] = (v2n_new * n[1] + v2t * t[1]) / BallB.speed;
    }

    function add_ball(type, teamOfBall = -1, hpOfBall = 100, posOfBall = null) {
        let p = posOfBall;
        let colorInd = teamOfBall === -1 ? numberOfBalls: teamOfBall - 1; 
        if (!p){
            if (numberOfBalls === 0) {
                p = [3 * W / 4, H / 4];
            } else if (numberOfBalls === 1) {
                p = [W / 4, H / 4];
            } else if (numberOfBalls === 2) {
                p = [3 * W / 4, 3 * H / 4];
            } else if (numberOfBalls === 3) {
                p = [W / 4, 3 * H / 4];
            }
        }

        const baseSpeed = 10;
        const first_dir = Math.random();
        const second_dir = Math.sqrt(1 - first_dir * first_dir);

        const colorTab = ["red", "blue", "green", "orange"];

        const params = {
            x: p[0],
            y: p[1],
            dir: [first_dir, second_dir],
            speed: baseSpeed,
            hp: hpOfBall,
            maxhp: hpOfBall,
            dmg: 50,
            mass: 1,
            type: type,
            radius: 50,
            team: teamOfBall === -1 ? numberOfBalls + 1: teamOfBall,
            colision: null,
            border: null,
            borderCount: 0,
            color: colorTab[colorInd],
        };

        if (type === 'normal') {
            params.hp = 100;
            params.dmg = 10;
        } else if (type === 'duplicated') {
            params.dmg = 5;
        } else if (type === 'tank') {
            params.hp = 200;
            params.maxhp = 200;
            params.dmg = 5;
        } else if (type === 'dmg') {
            params.hp = 50;
            params.maxhp = 50;
            params.dmg = 20;
        } else if (type === 'scale') {
            params.hp = 100;
            params.maxhp = 100;
            params.dmg = 1;
            params.colision = (ball, otherBall) => { ball.dmg += 1; };
        } else if (type === 'percent') {
            params.hp = 100;
            params.dmg = 0;
            params.percentile = 10;
            params.colision = (ball, otherBall) => { otherBall.hp -= otherBall.maxhp * ball.percentile / 100; };
        } else if (type === 'speed') {
            params.hp = 100;
            params.dmg = 10;
            params.colision = (ball, otherBall) => { otherBall.hp = otherBall.hp - ball.dmg * ball.speed / baseSpeed + ball.dmg; };
        } else if (type === 'duplicate') {
            params.hp = 100;
            params.dmg = 5;
            params.border = (ball) => { 
                ball.borderCount++; 
                if(ball.borderCount === 10) {
                    const scale = 1.3;
                    add_ball("duplicated", ball.team, ball.hp, [ball.x-scale * ball.radius, ball.y-scale * ball.radius]); 
                    ball.borderCount = 0; 
                    ball.x += scale * ball.radius;
                    ball.y += scale * ball.radius;
                }; 
            };
        }else {
            alert("Unknown type");
        }

        numberOfBalls += 1;
        setBalls(prev => [...prev, params]);
    }

    function onColision(ball1, ball2) {
        getNewSpeedAndDirections(ball1, ball2);
        if (ball1.team !== ball2.team){
            ball1.hp -= ball2.dmg;
            ball2.hp -= ball1.dmg;

            if (ball1.colision) {
                ball1.colision(ball1, ball2);
            }
            if (ball2.colision) {
                ball2.colision(ball2, ball1);
            }
        }
    }

    function onBorder(ball){
        let hasBounced = false;
        if (ball.x + ball.radius > W) {
            ball.dir[0] = -ball.dir[0];
            ball.x = W - ball.radius;
            hasBounced = true;
        }
        if (ball.x - ball.radius < 0) {
            ball.dir[0] = -ball.dir[0];
            ball.x = ball.radius;
            hasBounced = true;
        }
        if (ball.y + ball.radius > H) {
            ball.dir[1] = -ball.dir[1];
            ball.y = H - ball.radius;
            hasBounced = true;
        }
        if (ball.y - ball.radius < 0) {
            ball.dir[1] = -ball.dir[1];
            ball.y = ball.radius;
            hasBounced = true;
        }
        if (hasBounced && ball.border){
            ball.border(ball);
        }
    }

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            for (const ball of ballsToAdd){
                add_ball(ball);
            }
        }
    }, [add_ball, ballsToAdd]);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (gameOver){
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#ffffff';
            ctx.font = '48px Arial';
            const draw = winner ? false : true;
            const endMessage = draw ? `Draw` : `Winner: Player ${winner}`;
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', W/2, H/2 - 30);
            ctx.fillText(endMessage, W/2, H/2 + 30);
            return;
        }
        const interval = setInterval(() => {
            setBalls(prevBalls => {
                const newBalls = [...prevBalls];

                for (let i = 0; i < newBalls.length; i++) {
                    let ball = newBalls[i];

                    ball.x += ball.speed * ball.dir[0];
                    ball.y += ball.speed * ball.dir[1];

                    for (let j = i + 1; j < newBalls.length; j++) {
                        if (dist(ball.x, ball.y, newBalls[j].x, newBalls[j].y) <= ball.radius + newBalls[j].radius) {
                            onColision(ball, newBalls[j]);
                        }
                    }

                    if (ball.hp <= 0) {
                        newBalls.splice(i, 1);
                        i--;
                        continue;
                    }

                    onBorder(ball);
                }

                if (!gameOver){
                    const teamsLeft = new Set(balls.map(b => b.team));
                    if(teamsLeft.size === 1){
                        setWinner(Array.from(teamsLeft)[0]);
                        setGameOver(true);
                    }
                    else if (teamsLeft.size === 0){
                        setGameOver(true);
                    }
                }

                return newBalls;
            });

            ctx.fillStyle = '#141428';
            ctx.fillRect(0, 0, W, H);

            balls.forEach(ball => {
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = ball.color;
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.font = '30px Arial';
                ctx.textAlign = 'center';

                ctx.fillText(Math.round(ball.hp).toString(), ball.x, ball.y - 15);

                ctx.font = '20px Arial';
                ctx.fillText(ball.type.toString(), ball.x, ball.y + 20);
            });
        
        }, 1000 / ( gameSpeed === "normal" ? 60 : 10000));

        return () => clearInterval(interval);
    }, [balls, gameOver]);

    return (
        <div>
            <canvas
                id="game-canvas"
                ref={canvasRef}
                width={W}
                height={H}
                style={{ background: '#141428' }}
            />
        </div>
    );
};

export default BallGame;