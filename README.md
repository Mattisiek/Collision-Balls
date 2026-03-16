
# Collision Balls

A high-performance, dynamic physics battle simulator built with **React** and the **Canvas API**. Watch different types of balls collide, fight, and use their unique abilities to dominate the arena!

---

##  Game Features

### Ball Types & Unique Abilities
Each ball has distinct stats and custom collision logic that dictates its combat style:

| Type | HP | Damage | Special Ability |
| :--- | :--- | :--- | :--- |
| **Normal** | 100 | 10 | Standard balanced combatant. |
| **Tank** | 200 | 5 | High HP; survives long attrition battles. |
| **Damage** | 50 | 20 | Glass cannon; high lethality but fragile. |
| **Scale** | 100 | 1+ | **Growth:** Base damage increases by +1 on every hit. |
| **Percent** | 100 | 0 | **Slayer:** Deals damage equal to 10% of target's MAX HP. |
| **Speed** | 100 | ~10 | **Momentum:** Damage scales with velocity (faster = more dmg). |

###  Physics Engine
The engine uses **custom vector mathematics** to handle high-speed interactions and realistic physical properties at a smooth 60 FPS:

* **Momentum Conservation:** Calculates post-collision velocities using the conservation of momentum principle:
    $$m_1\mathbf{v}_{1i} + m_2\mathbf{v}_{2i} = m_1\mathbf{v}_{1f} + m_2\mathbf{v}_{2f}$$

* **Elastic Collision Response:** Kinetic energy is preserved during bounces, ensuring the battle remains dynamic and high-energy.
* **Border Detection:** Precise boundary checking ensures balls bounce off the canvas edges accurately.

---

## Technical Implementation

### Built With
* **React** - UI framework and game loop management.
* **Canvas API** - High-performance rendering and animations.
* **JavaScript** - Custom physics calculations and entity logic.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v14 or higher)
* **npm**

### Installation
1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Mattisiek/Collision-Balls.git](https://github.com/Mattisiek/Collision-Balls.git)
    cd collision_balls
    ```

2.  **Install dependencies**
    ```bash
    npm install    ```

3.  **Start the development server**
    ```bash
    npm start
    ```

4.  **View the Battle**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Future Enhancements
- [ ] **Team Battles:** Balls are split to form a team.
- [ ] **Power-ups:** Randomly spawning items (Shields, Heals, Speed Boosts).
- [ ] **More types:** More advanced types of balls

---

## Contributing
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.


---
**Watch the battle unfold!** Every run is unique due to randomized initial trajectories and complex collision chains.