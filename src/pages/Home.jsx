import { useEffect, useState } from "react";
import axios from 'axios';

import "../style/Home.css"
import { useNavigate } from "react-router-dom";

const endpoint = "https://note-taking-application-backend.onrender.com"; // "http://localhost:5000"

const Home = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("");

    const [selectedNote, setSelectedNote] =
        useState(null);

    const token = localStorage.getItem('token');

    const fetchNotes = async () => {
        try {
            // Make a GET request to your getAllNotes API endpoint with the token in the header
            const response = await axios.get(`${endpoint}/getAllNotes`, {
                headers: {
                    Authorization: token,
                },
            });

            // Handle the response
            if (response.status === 200) {
                const fetchedNotes = response.data.notes;

                // Update the state with the fetched notes
                setNotes(fetchedNotes);

                console.log('Notes fetched successfully:', fetchedNotes);
            } else {
                // Handle other status codes or error responses
                console.error('Failed to fetch notes:', response.data.error);
            }
        } catch (error) {
            console.error('An error occurred during note fetching:', error);
        }
    };

    useEffect(() => {

        // Call the fetchNotes function when the component mounts
        fetchNotes();
    }, [token]);

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content)
    }

    const handleAddNote = async (
        event
    ) => {
        event.preventDefault();

        // Assuming you have a function to retrieve the token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            // Handle the case where the token is not available
            console.error('Token not found');
            return;
        }

        const newNote = {
            title: title,
            content: content,
        };

        try {
            // Make a POST request to your createNote endpoint with the token in the header
            const response = await axios.post(`${endpoint}/createNote`, newNote, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            });

            // Handle the response
            if (response.status === 201) {
                const createdNote = response.data.note;

                // Update the state with the new note
                setNotes([createdNote, ...notes]);

                // Clear the input fields
                setTitle("");
                setContent("");

                console.log('Note created successfully:', createdNote);
            } else {
                // Handle other status codes or error responses
                console.error('Failed to create note:', response.data.error);
            }
        } catch (error) {
            console.error('An error occurred during note creation:', error);
        }
    };

    const handleUpdateNote = async (event) => {
        event.preventDefault();

        if (!selectedNote) {
            return;
        }

        const updatedNote = {
            id: selectedNote._id,
            title: title,
            content: content,
        };

        try {
            // Make a PUT request to your updateNote API endpoint with the token in the header
            const response = await axios.put(`${endpoint}/updateNote/${selectedNote._id}`, updatedNote, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            });

            // Handle the response
            if (response.status === 200) {
                const updatedNoteFromServer = response.data.note;

                // Update the state with the updated note
                setNotes((prevNotes) =>
                    prevNotes.map((note) =>
                        note.id === selectedNote.id ? updatedNoteFromServer : note
                    )
                );

                // Clear the input fields and selectedNote
                setTitle('');
                setContent('');
                setSelectedNote(null);

                console.log('Note updated successfully:', updatedNoteFromServer);
            } else {
                // Handle other status codes or error responses
                console.error('Failed to update note:', response.data.error);
            }
        } catch (error) {
            console.error('An error occurred during note update:', error);
        }
    };

    const handleCancel = () => {
        setTitle("")
        setContent("")
        setSelectedNote(null);
    }

    const deleteNote = async (event, noteId) => {
        event.stopPropagation();
        console.log('delete', noteId);

        try {
            // Make a DELETE request to your deleteNote API endpoint with the token in the header
            const response = await axios.delete(`${endpoint}/deleteNote/${noteId}`, {
                headers: {
                    Authorization: token,
                },
            });

            // Handle the response
            if (response.status === 200) {
                // Update the state with the notes excluding the deleted note
                setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));

                console.log('Note deleted successfully:', noteId);
            } else {
                // Handle other status codes or error responses
                console.error('Failed to delete note:', response.data.error);
            }
        } catch (error) {
            console.error('An error occurred during note deletion:', error);
        }
    };
    
    const logout = () => {
        localStorage.clear('token');
        navigate('/login')
    }
    return (
        <div className="app-container">
            <form className="note-form" onSubmit={(event) => {
                selectedNote ? handleUpdateNote(event) : handleAddNote(event)
            }}>
                <input
                    value={title} onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    placeholder="title" required />
                <textarea
                    value={content} onChange={(event) =>
                        setContent(event.target.value)
                    }
                    placeholder="Content"
                    rows={10}
                    required></textarea>

                {selectedNote ? (<div className="edit-button">
                    <button type="submit">Save</button>
                    <button onClick={handleCancel}>cancel</button>
                </div>) : (

                    <>

                        <button type="submit">
                            Add Note
                        </button>

                        <button onClick={logout} >
                            Logout
                        </button>
                    </>
                )}
            </form>
            <div className="notes-grid">

                {notes.map((note) => (
                    <div className="note-item" onClick={() => handleNoteClick(note)}>
                        <div className="notes-header">
                            <button onClick={(event) => deleteNote(event, note._id)}>x</button>
                        </div>
                        <h2>{note.title}</h2>
                        <p>{note.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home;