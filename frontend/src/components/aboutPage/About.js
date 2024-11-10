import Mission from './Mission';
import Challenge from './Challenge';
import Solution from './Solution';
import Features from './Features';
import Benefits from './Benefits';
import JoinUs from './JoinUs';
// import Navbar from '../Navbar';

export default function About() {
    return (
        <div>
            <div>
               <h1>About HabitatT</h1>
               <p>
                 Welcome to our real estate communication management system! 
                 We are passionate about revolutionizing how real estate professionals, 
                 tenants, and property managers communicate. Our goal is to streamline 
                 communication, enhance transparency, and improve overall efficiency 
                 in the industry.
               </p>
            </div>
            <Mission />
            <Challenge />
            <Solution />
            <Features />
            <Benefits />
            <JoinUs />
        </div>
    );
}
