import React, { useState } from 'react';
import LeaveTypeModal from '../../../layouts/forms/LeaveTypeCreation';
import '../../../styles/button.css';

export default function LeaveTypeManagement({ superuser }) {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="container">
            {superuser && (
                <div>
                    <button className='glow-on-hover' onClick={openModal}>
                   Create Leave Type
                    </button>
                    <LeaveTypeModal showModal={showModal} onClose={closeModal} />
                </div>
            )}
        </div>
    );
}
