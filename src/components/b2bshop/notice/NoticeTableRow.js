import React, { useState } from "react";
import Modal from "../../modal/Modal";

const NoticeTableRow = ({ title, createdAt, index, content }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <React.Fragment>
      <div
        onClick={openModal}
        className="grid grid-cols-10 place-items-center text-center 
        text-xs border-r border-b border-l py-1 cursor-pointer bg-white"
      >
        <div className="col-span-1">{index}.</div>
        <div className="col-span-7">{title}</div>
        <div className="col-span-2">
          {new Date(createdAt?.toDate()).toLocaleDateString()}
        </div>
      </div>
      {/* //header 부분에 텍스트를 입력한다. */}
      <Modal open={modalOpen} close={closeModal} header={title}>
        {/* // Modal.js <main> { props.children } </main>에 내용이 입력된다.  */}
        {content}
      </Modal>
    </React.Fragment>
  );
};

export default NoticeTableRow;
