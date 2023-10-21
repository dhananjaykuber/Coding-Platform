import React from 'react';

const Modal = ({ openModal, setOpenModal, children }) => {
  const modalClasses = openModal
    ? 'fixed inset-0 flex items-center justify-center'
    : 'hidden';

  return (
    <div className={modalClasses}>
      <div
        className="bg-black opacity-50 absolute inset-0"
        onClick={() => setOpenModal(false)}
      ></div>
      <div className="relative bg-white p-4 rounded-lg shadow-lg z-10">
        <span
          className="absolute right-5 cursor-pointer"
          onClick={() => setOpenModal(false)}
        >
          ❌
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
