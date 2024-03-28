import React, { useState } from 'react';
import LeaveTypeModal from '../../../layouts/forms/LeaveTypeCreation';
import LeaveTypeEditModal from '../../../layouts/forms/LeaveTypeEditModal';
import { Dropdown } from 'react-bootstrap';
import '../../../styles/button.css';

export default function LeaveTypeManagement({ superuser }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const openCreateModal = () => {
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
    };

    const openEditModal = () => {
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };

    return (
        <div className="container">
            {superuser && (
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-leavetype">
                        Leave Type
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={openCreateModal}>Create Leave Type</Dropdown.Item>
                        <Dropdown.Item onClick={openEditModal}>Edit Leave Type</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )}
            <LeaveTypeModal showModal={showCreateModal} onClose={closeCreateModal} />
            <LeaveTypeEditModal showModal={showEditModal} onClose={closeEditModal} />
        </div>
    );
}
