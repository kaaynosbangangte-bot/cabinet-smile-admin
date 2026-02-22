import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { FiMail, FiTrash2, FiEye, FiCheck, FiInfo, FiMessageSquare, FiX, FiUser, FiPhone } from 'react-icons/fi'
import { toast } from 'react-toastify'
import './Messages.css'

function Messages() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = []
            querySnapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() })
            })
            setMessages(msgs)
            setLoading(false)
        }, (error) => {
            console.error('Error fetching messages:', error)
            toast.error('Erreur de permissions : vérifiez vos règles Firestore')
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const markAsRead = async (id) => {
        try {
            const messageRef = doc(db, 'messages', id)
            await updateDoc(messageRef, {
                status: 'read'
            })
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    const deleteMessage = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce message ?')) {
            try {
                await deleteDoc(doc(db, 'messages', id))
                toast.success('Message supprimé')
                if (selectedMessage?.id === id) {
                    setShowModal(false)
                }
            } catch (error) {
                console.error('Error deleting message:', error)
                toast.error('Erreur lors de la suppression')
            }
        }
    }

    const openMessage = (msg) => {
        setSelectedMessage(msg)
        setShowModal(true)
        if (msg.status === 'unread') {
            markAsRead(msg.id)
        }
    }

    const filteredMessages = messages.filter(msg => {
        if (filter === 'unread') return msg.status === 'unread'
        if (filter === 'read') return msg.status === 'read'
        return true
    })

    const formatDate = (timestamp) => {
        if (!timestamp) return ''
        const date = timestamp.toDate()
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="main-content">
                <Header title="Messagerie" />

                <div className="dashboard-content">
                    <div className="page-header-refined">
                        <div className="header-info">
                            <h1>Messagerie du Site</h1>
                            <p>Centralisation des messages reçus via les formulaires de contact</p>
                        </div>
                    </div>

                    <div className="messages-toolbar">
                        <div className="messages-filters-refined">
                            <button
                                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                Tout ({messages.length})
                            </button>
                            <button
                                className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                                onClick={() => setFilter('unread')}
                            >
                                Non lus ({messages.filter(m => m.status === 'unread').length})
                            </button>
                            <button
                                className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
                                onClick={() => setFilter('read')}
                            >
                                Lus
                            </button>
                        </div>
                    </div>

                    <div className="messages-container-refined">
                        {loading ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                                <p>Chargement de vos messages...</p>
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="empty-state-refined">
                                <div className="empty-icon">
                                    <FiMessageSquare />
                                </div>
                                <h3>Aucun message</h3>
                                <p>Votre boîte de réception est vide pour le moment.</p>
                            </div>
                        ) : (
                            <div className="messages-grid-refined">
                                {filteredMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`message-card-premium ${msg.status}`}
                                        onClick={() => openMessage(msg)}
                                    >
                                        <div className="card-top">
                                            <span className={`source-tag ${msg.source ? msg.source.toLowerCase().replace(' ', '-') : 'inconnue'}`}>
                                                {msg.source}
                                            </span>
                                            <span className="card-date">{formatDate(msg.createdAt)}</span>
                                        </div>

                                        <div className="card-author">
                                            <div className="author-avatar">
                                                {msg.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="author-details">
                                                <h3>{msg.name}</h3>
                                                <p>{msg.email}</p>
                                            </div>
                                        </div>

                                        <div className="card-preview">
                                            <p>{msg.message}</p>
                                        </div>

                                        <div className="card-footer-premium">
                                            <div className="msg-status">
                                                {msg.status === 'unread' && <span className="unread-dot"></span>}
                                                {msg.status === 'unread' ? 'Nouveau' : 'Lu'}
                                            </div>
                                            <button
                                                className="btn-trash"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteMessage(msg.id);
                                                }}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de lecture détaillée */}
            {showModal && selectedMessage && (
                <div className="message-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="message-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                            <FiX />
                        </button>

                        <div className="modal-inner">
                            <div className="modal-header-premium">
                                <div className="modal-source-info">
                                    <span className={`source-tag ${selectedMessage.source ? selectedMessage.source.toLowerCase().replace(' ', '-') : 'inconnue'}`}>
                                        Provenance : {selectedMessage.source}
                                    </span>
                                    <span className="modal-date">{formatDate(selectedMessage.createdAt)}</span>
                                </div>

                                <div className="modal-sender-profile">
                                    <div className="profile-avatar">
                                        {selectedMessage.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="profile-info">
                                        <h2>{selectedMessage.name}</h2>
                                        <div className="profile-contacts">
                                            <span><FiMail /> {selectedMessage.email}</span>
                                            {selectedMessage.phone && <span><FiPhone /> {selectedMessage.phone}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-body-premium">
                                <h3>Contenu du message</h3>
                                <div className="message-text-full">
                                    {selectedMessage.message}
                                </div>
                            </div>

                            <div className="modal-footer-premium">
                                <button className="btn-modal-delete" onClick={() => deleteMessage(selectedMessage.id)}>
                                    <FiTrash2 /> Supprimer le message
                                </button>
                                <button className="btn-modal-close" onClick={() => setShowModal(false)}>
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Messages
