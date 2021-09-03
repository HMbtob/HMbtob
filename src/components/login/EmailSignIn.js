import React from "react";
import { useRef } from "react";
import { auth } from "../../firebase";

const EmailSignIn = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const register = e => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then(authUser => console.log(authUser))
      .catch(e => {
        alert(e.message);
      });
  };

  const signIn = e => {
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
  return (
    <form className="flex flex-col items-center">
      <div className="text-2xl font-semibold mb-3">Sign In</div>
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
        onClick={signIn}
        className="text-lg font-semibold bg-gray-400 w-80 p-2 rounded mt-3 text-white"
      >
        Sign In
      </button>
      <div className="flex flex-row mt-5 w-64 justify-around">
        <div className="text-gray-600">New to INTERASIA? </div>{" "}
        <div onClick={register} className=" font-bold cursor-pointer">
          {" "}
          Sign Up !
        </div>
      </div>
    </form>
  );
};

export default EmailSignIn;
