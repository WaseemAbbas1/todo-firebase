import React,{useState} from 'react'
import { Input } from 'antd'
import { useAuthContext } from '../../context/AuthContext'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'
const initialValue = {email : "", password :""}
export default function Login() {
  const {dispatch} = useAuthContext()
  const [isLoading,setIsLoading] = useState(false)
  const [state ,setState ] = useState(initialValue)
  const {email,password} = state
  const handleChange = (e)=>{
setState((s)=>{return{...s, [e.target.name]: e.target.value}}) 
}
const navigate = useNavigate()
const handleSubmit = async(e) => {
  e.preventDefault()
  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }  
try {
setIsLoading(true)
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const user = userCredential.user;
console.log("User registered successfully:", user);
dispatch({type:"SET-LOGGED-IN",payload:{user:user}})
setState(initialValue);
navigate("/")
} catch (error) {
console.error("Error during registration:", error);
alert(error.message);
}finally{
setIsLoading(false)
}

};
  
  return (
     <main >
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card" style={{ width: "100%", maxWidth: "450px" }}>
          <div className="card-body py-3">
            <div className="card-title text-center mb-3">
              <h2>Login</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-2">
                <label htmlFor="inputField3">Email</label>
                <Input
                  type="email"
                  id="inputField3"
                  placeholder="Enter Your Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                ></Input>
              </div>
              <div className="form-group mb-2">
                <label htmlFor="inputField4">Password</label>
                <Input.Password 
                type='password'
                  placeholder="Enter Your Password"
                 id="inputField4"
                 name="password"
                 value={password}                       
                 onChange={handleChange}
                ></Input.Password>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 offset-md-3 mt-2">
                <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-grow spinner-grow-sm"
                      aria-hidden="true"
                    ></span>
                    Wait...
                  </>
                ) : (
                  "Login"
                )}
              </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  
  )
}
