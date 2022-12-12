import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar.jsx';
import Home from './components/Pages/Home/Home';
import About from './components/Pages/About/About';
import Contact from './components/Pages/Contact/Contact';
import Partners from './components/Pages/Partners/Partners';
import Help from './components/Pages/Help/Help';
import ShoppingCart from './components/Pages/ShoppingCart/ShoppingCart';
import Profile from './components/Pages/Profile/Profile';
import SignUp from './components/Pages/SignUp/SignUp';
import Login from './components/Pages/Login/Login';
import Footer from './components/layout/Footer/Footer';
function App() {
  return (
    <>

      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contactUs' element={<Contact />} />
          <Route path='/partners' element={<Partners />} />
          <Route path='/help' element={<Help />} />
          <Route path='/shoppingCart' element={<ShoppingCart />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
