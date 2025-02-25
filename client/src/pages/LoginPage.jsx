import dumbbell from '../assets/dumbbell.png';
import '../styles/LoginPage.css';

export default function Loginpage() {
    return (
        <div className="container">
            <div className="top-container">
                <h1><img src={dumbbell} alt="icon" className='dumbbell-icon' />AthletixHub</h1>
            </div>
            <div className='main-container'>
                <div className="register-form">
                    <h2>Join AthletixHub</h2>
                    <form>
                        <label>Name</label>
                        <br/>

                        <input type="text" placeholder="Enter your name"/>
                        <br/>

                        <label>Email</label>

                        <br />
                        <input type="email" placeholder="Enter your email"/>

                        <br />
                        <label>Phone</label>

                        <br />
                        <input type="tel" placeholder="Enter your phone number"/>

                        <br />
                        <label>Password</label>

                        <br />
                        <input type="password" placeholder="Enter your password"/>

                        <br />

                        <button>Create Profile</button>
                    </form>
                </div>
            </div>
            <div className="footer">
                <p>©2025 AthletixHub. All rights reserved.</p>
            </div>
        </div>
    );
}