import React, { useState } from "react";
import { Input } from "antd";
import { auth, firestore } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const initialValue = { firstName: "", lastName: "", email: "", password: "" };
export default function Register() {
  const {setBlockAuthCheck}= useAuthContext()
  const [formData, setFormData] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const { firstName, password, email, lastName } = formData;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate()
  const storeUser = async (user) => {
    const userData = {
      firstName,
      lastName,
      email,
      uid: user.uid,
      dateCreated: serverTimestamp(),
      status: "active",
    };
    try {
      await setDoc(doc(firestore, "user", user.uid), userData);
      console.log('userData stroe in data base', userData)
    } catch (e) {
      console.log("error", e);
      setFormData(initialValue)
      setIsLoading(false)
    } finally {
      setFormData(initialValue);
      setIsLoading(false);
      navigate("/")
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      setIsLoading(true);
      setBlockAuthCheck(true)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User registered successfully in auth:", user);
      await storeUser(user);
    } catch (error) {
      setFormData(initialValue)
      setIsLoading(false)
      console.error("Error during registration:", error);
      alert(error.message);
    }
    finally{
      setBlockAuthCheck(false)
    }

    
  
//     try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
//     await updateProfile(user, {
//       displayName: `${firstName} ${lastName}`,
//     });
//     await setDoc(doc(db, "users", user.uid), {
//       firstName,
//       lastName,
//       email,
//       createdAt: new Date(),
//     });
//     console.log("User registered and profile data saved successfully");
//     setFormData(initialValue);

//   } catch (error) {
//     console.error("Error during registration:", error);
//     alert(error.message);
//   }
// };

    
  };

  return (
    <main>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card" style={{ width: "100%", maxWidth: "550px" }}>
          <div className="card-body py-3">
            <div className="card-title text-center mb-3">
              <h2>Register</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row mb-2">
                <div className="col-12 col-md-6">
                  <label htmlFor="inputField1">First Name</label>
                  <Input
                    type="text"
                    id="inputField1"
                    placeholder="Enter your First Name"
                    name="firstName"
                    value={firstName}
                    onChange={handleChange}
                  ></Input>
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="inputField2">Last Name</label>
                  <Input
                    type="text"
                    id="inputField2"
                    placeholder="Enter your Last Name"
                    name="lastName"
                    value={lastName}
                    onChange={handleChange}
                  ></Input>
                </div>
              </div>
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
                  type="password"
                  placeholder="Enter Your Password"
                  id="inputField4"
                  name="password"
                  onChange={handleChange}
                  value={password}
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
                      "Register"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
