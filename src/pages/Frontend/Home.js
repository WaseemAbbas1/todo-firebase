import React, {  useEffect, useState } from "react";
import {collection,deleteDoc,doc,getDocs,query,serverTimestamp,setDoc, where,} from "firebase/firestore";
import { auth, firestore } from "../../config/firebase";
import { CloseOutlined } from "@ant-design/icons";
import { useAuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
export default function Home() {
  const {setIsAppLoading,isAuth ,user,dispatch} = useAuthContext()
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({title: "",location: "",description: "",});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  useEffect(() => {
    setIsAppLoading(true); // Start loader
    const fetchTodos = async () => {
      try {
        if(user){

          const querySnapshot = await getDocs(query(collection(firestore,"todo"),where("createBy.uid","==", user.uid)));
          const todosArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTodos(todosArray);
        }
        } catch (e) {
          console.log("error", e);
        } finally {
          setIsAppLoading(false); // Stop loader only after completion
        }
      };
      fetchTodos();
  }, []); 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTodo((prev) => ({ ...prev, [name]: value }));
  };
  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await deleteDoc(doc(firestore, "todo", id));
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (e) {
      console.log("erorr", e);
    } finally {
      setLoadingId(null);
    }
  };
  const handleEdit = (todo) => {
    setCurrentTodo(todo);
    setShowModal(true);
  };
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const updatedTodo = { ...currentTodo, editDate: serverTimestamp() };
      const todoRef = doc(firestore, "todo", currentTodo.id);
      await setDoc(todoRef, updatedTodo);
      setTodos((prevTodos) =>
        prevTodos.map((item) =>
          item.id === updatedTodo.id ? updatedTodo : item
        )
      );
      setShowModal(false);
    } catch (e) {
      console.log("error", e);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLoggedOut=async()=>{
    try{
      await signOut(auth)
      dispatch({ type: "SET-LOGGED-OUT" });  
    }
catch(error){
  console.log('error', error)
};
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col text-center">
          {isAuth
        ?<>
        <Link to="/dashboard/" className="btn btn-success btn-outline-dark">Dasboard</Link>
        <Link to="/auth/" onClick={handleLoggedOut} className="btn btn-light btn-outline-dark">Logout</Link>
           <p>{user.email}</p>   
        </>
         :
         <>
         <Link to="/auth/" className="btn btn-light btn-outline-dark">Login</Link>
         <Link to="/auth/register" className="btn btn-success btn-outline-info">Register</Link>  
         </>
        }
        </div>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Location</th>
              <th scope="col">Description</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {todos?.map((todo, i) => {
              return (
                <tr key={todo.id}>
                  <th>{i + 1}</th>
                  <td>{todo.title}</td>
                  <td>{todo.location}</td>
                  <td>{todo.description}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => handleEdit(todo)}
                    >
                      Update
                    </button>
                    |
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(todo.id)}
                      disabled={loadingId === todo.id} // disable only this button during loading
                    >
                      {loadingId === todo.id ? (
                        <>
                          <span
                            className="spinner-grow spinner-grow-sm"
                            aria-hidden="true"
                          ></span>
                          Wait...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {showModal && (
          <EditTodoModal
            todo={currentTodo}
            isLoading={isLoading}
            onClose={() => setShowModal(false)}
            onChange={handleInputChange}
            onSave={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}
function EditTodoModal({ todo, isLoading, onClose, onChange, onSave }) {
  return (
    <>
      <div
        className="modal show"
        style={{ display: "block" }}
        onClick={onClose}
      >
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Todo</h5>
              <button
                type="button"
                className="btn btn-outline-dark ms-auto"
                onClick={onClose}
              >
                <CloseOutlined />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group mb-3">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={todo.title}
                    onChange={onChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={todo.location}
                    onChange={onChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Description</label>
                  <textarea
                    name="description"
                    rows="6"
                    value={todo.description}
                    onChange={onChange}
                    className="form-control"
                    style={{ resize: "none" }}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onSave}
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
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
