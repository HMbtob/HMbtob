import React, { useState } from "react";
import { auth, provider } from "../../firebase";
import Modal from "../modal/Modal";
import EmailSignIn from "./EmailSignIn";
function Login() {
  const signIn = async () => {
    await auth.signInWithRedirect(provider).catch(e => alert(e.message));
  };

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <div className="h-screen grid place-items-center bg-gray-100">
      <div className=" p-24 text-center rounded bg-white flex flex-col">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/interasiastock.appspot.com/o/assets%2Flo.jpeg?alt=media&token=ea92d0b2-5857-45a7-8552-6ff0b87e7db7"
          alt="logo"
          className="bg-contain h-96"
        />
        <button
          className="mt-6 bg-gray-800 text-2xl text-gray-50 px-8 py-3 rounded-sm"
          onClick={signIn}
        >
          Sign in with Google
        </button>
        <button
          className="mt-6 bg-gray-800 text-2xl text-gray-50 px-8 py-3 rounded-sm"
          onClick={openModal}
        >
          Sign in with E-mail
        </button>
        <Modal
          open={modalOpen}
          close={closeModal}
          header={"Sign in with E-mail"}
        >
          <EmailSignIn />
        </Modal>
      </div>
    </div>
  );
}

export default Login;
