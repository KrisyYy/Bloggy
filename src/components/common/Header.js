import { Link } from 'react-router-dom'
import { auth } from '../../firebase';


export const Header = () => {
    return (
        <header>
            <div className='headerSection flex-wrapper'>
                <div>
                    <Link className='navLink' to={"/"}>Bloggy</Link>
                </div>
                <div>
                    {auth.currentUser
                        ? <div id='user'>
                            <Link className='navLink' to={"/logout"}>Log out</Link>
                        </div>
                        : <div id='guest'>
                            <Link className='navLink' to={"/login"}>Login</Link>
                            <Link className='navLink' to={"/register"}>Register</Link>
                        </div>
                    }

                </div>
            </div>
        </header>
    );
}