import React, { useState, useRef } from "react";
import { auth, provider } from "../../firebase";
import firebase from "firebase";
import Modal from "../modal/Modal";
import EmailSignUp from "./EmailSignUp";

function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const signInWithGoogle = async () => {
    await auth.signInWithRedirect(provider).catch((e) => alert(e.message));
  };

  const signInWithEmail = (e) => {
    e.preventDefault();
    auth
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return (
          auth
            .signInWithEmailAndPassword(
              emailRef.current.value,
              passwordRef.current.value
            )
            // .then(userC => {
            //   const user = userC.user;
            //   // console.log(user);
            // })
            .catch((e) => console.log(e))
        );
      })
      // .then(authUser => console.log(authUser))
      .catch((e) => {
        alert(e.message);
      });
  };

  const [modal1Open, setModal1Open] = useState(false);
  const openModal = () => {
    setModal1Open(true);
  };
  const closeModal = () => {
    setModal1Open(false);
  };
  const forgotPassword = (e) => {
    e.preventDefault();
    const inputEmail = prompt("Please enter your email address.");
    if (inputEmail != null) {
      auth
        .sendPasswordResetEmail(inputEmail)
        .then(() => {
          console.log("성공");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("e", errorCode, errorMessage);
        });
    }
  };
  return (
    <div className="flex flex-col bg-gray-100 h-auto min-h-screen w-scree">
      <div
        className="p-10 lg:p-24 text-center rounded bg-white flex flex-col items-center 
       m-auto w-11/12 lg:w-auto"
      >
        <img
          src="https://firebasestorage.googleapis.com/v0/b/hmbtob-b093b.appspot.com/o/KakaoTalk_Photo_2022-05-22-16-23-08.png?alt=media&token=9f83fa22-e4d6-4924-b4fc-20e47d0af5ba"
          alt="logo"
          className="h-40 lg:h-40"
        />
        <div className="flex flex-col w-11/12 lg:w-80">
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
          className="text-lg font-semibold bg-gray-400 w-11/12 lg:w-80 p-2
           rounded mt-3 text-white"
        >
          Sign In
        </button>
        <div
          onClick={forgotPassword}
          className="text-right text-gray-800 w-11/12 mt-3 lg:w-80 text-xs cursor-pointer"
        >
          forgot password?
        </div>
        <div className="flex flex-col lg:flex-row mt-5 w-80 justify-start">
          <div className="text-gray-700">{"New to HMcompany ?  "}</div>
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
          className="mt-5 bg-gray-800 text-lg text-gray-50 px-2 lg:px-8 p-2 rounded
          w-11/12 lg:w-80"
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
