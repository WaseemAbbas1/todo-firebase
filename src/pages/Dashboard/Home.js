import React, { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/skeleton/Title";
import { firestore } from "../../config/firebase";
import { Link } from "react-router-dom";
import {useAuthContext} from "../../context/AuthContext"
const iniltialState = { title: "", location: "", description: "" };
export default function Home() {
  const [state, setState] = useState(iniltialState);
  const [isLoading, setIsLoading] = useState(false);
  const { title, description, location } = state;
  const {user}=useAuthContext() 
  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!title){
      alert("enter name")
      return
      
    }
    const todo = {
      ...state,
      createDate: serverTimestamp(),
      id: Math.random().toString(36).slice(2),
      createBy :{uid:user.uid}
    };
    setState(iniltialState);
    try {
      setIsLoading(true);
     await setDoc(doc(firestore, "todo",todo.id), todo);
      console.log("Document written with ID: ");
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main>
      <div className="row">
        <div className="col text-center">
          <Link to="/" className="btn btn-dark">Home</Link>
        </div>
      </div>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card" style={{ width: "100%", maxWidth: "550px" }}>
          <div className="card-body py-3">
            <div className="card-title text-center mb-3">
              <Title level={2}>Add Todo</Title>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row mb-2">
                <div className="col">
                  <label htmlFor="inputField2">Title</label>
                  <Input
                    type="text"
                    value={title}
                    id="inputField2"
                    placeholder="Enter You Title "
                    name="title"
                    onChange={handleChange}
                  ></Input>
                </div>
              </div>
              <div className="form-group mb-2">
                <label htmlFor="inputField3">Location</label>
                <Input
                  type="text"
                  value={location}
                  id="inputField3"
                  placeholder="Enter Your Location"
                  name="location"
                  onChange={handleChange}
                ></Input>
              </div>
              <div className="form-group mb-2">
                <label htmlFor="inputField4">Description</label>
                <TextArea
                  style={{ resize: "none" }}
                  rows={8}
                  placeholder="Enter Your Description"
                  id="inputField4"
                  value={description}
                  name="description"
                  onChange={handleChange}
                  variant="filled"
                  status="warning"
                ></TextArea>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 offset-md-3 mt-2">
                  {isLoading ? (
                    <button
                      className="btn btn-dark  w-100"
                      disabled ={isLoading}
                    >
                      <span
                        className="spinner-grow spinner-grow-sm"
                        aria-hidden="true"
                      ></span>
                      <span role="status">Loading...</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-dark btn-outline-light w-100"
                    >
                      Add Todo
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
