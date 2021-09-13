import React, { useState, useRef } from "react";
import { auth, provider } from "../../firebase";
import Modal from "../modal/Modal";
import EmailSignUp from "./EmailSignUp";

function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const signInWithGoogle = async () => {
    await auth.signInWithRedirect(provider).catch(e => alert(e.message));
  };
  const signInWithEmail = e => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then(authUser => console.log(authUser))
      .catch(e => {
        alert(e.message);
      });
  };

  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const openModal = e => {
    const { name } = e.target;
    if (name === "modal1") {
      setModal1Open(true);
    } else if (name === "modal2") {
      setModal2Open(true);
    }
  };
  const closeModal = e => {
    // const { name } = e.target;
    // if (name === "modal1") {
    setModal1Open(false);
    // } else if (name === "modal2") {
    setModal2Open(false);
    // }
  };
  return (
    <div className="h-screen grid place-items-center bg-gray-100">
      <div className=" p-24 text-center rounded bg-white flex flex-col items-center">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/interasiastock.appspot.com/o/assets%2Finterlogo-500.jpeg?alt=media&token=af2ec17d-dc0b-4147-9c7a-650ab2db870a"
          alt="logo"
          className="bg-contain h-96"
        />
        <div className="flex flex-col w-80">
          <input
            ref={emailRef}
            type="email"
            placeholder="E-mail"
            className="p-3 border mt-3 rounded"
          />
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            className="p-3 mt-3 border rounded"
          />
        </div>
        <button
          type="submit"
          onClick={signInWithEmail}
          className="text-lg font-semibold bg-gray-400 w-80 p-2
           rounded mt-3 text-white"
        >
          Sign In
        </button>
        <div className="flex flex-row mt-5 w-80 justify-start">
          <div className="text-gray-700">{"New to INTERASIA ?  "}</div>
          <button
            className=" font-bold cursor-pointer text-gray-800"
            name="modal1"
            onClick={openModal}
          >
            {" Sign Up with e-mail !"}
          </button>
        </div>
        <div className="mt-5 text-2xl font-semibold text-gray-600">or</div>
        <button
          className="mt-5 bg-gray-800 text-lg text-gray-50 px-8 p-2 rounded"
          onClick={signInWithGoogle}
        >
          Sign in with Google
        </button>

        <Modal
          open={modal1Open}
          close={closeModal}
          header={"Sign in with E-mail"}
        >
          <EmailSignUp />
        </Modal>
      </div>
    </div>
  );
}

export default Login;
