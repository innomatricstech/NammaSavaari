import React, { useState, useEffect } from 'react';
import "./ShortVideo.css"

// --- Video Upload Form ---
const VideoUploadForm = ({ onSubmit, newVideo, setNewVideo, isEditing, onCancelEdit }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="form-card">
            <h2 className="form-title">{isEditing ? 'Edit Video Details' : 'Upload New Video'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="url"
                        placeholder="Short Video URL"
                        value={newVideo.url}
                        onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Video Title"
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        required
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit" className="btn btn-primary">
                        {isEditing ? 'UPDATE VIDEO' : 'UPLOAD VIDEO'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={onCancelEdit} className="btn btn-secondary">
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

// --- Video Item Component ---
const VideoItem = ({ video, onEdit, onDelete }) => (
    <div className="video-card">
        <p className="video-title">{video.title}</p>
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="video-url">
            {video.url}
        </a>
        <div className="video-actions">
            <button onClick={() => onEdit(video)} className="btn btn-edit">Edit</button>
            <button onClick={() => onDelete(video.id)} className="btn btn-delete">Delete</button>
        </div>
    </div>
);

// --- Main Component ---
export default function AdminUploadingYouTubeVideos() {
    const [videos, setVideos] = useState(() => {
        // Load from localStorage if exists
        const saved = localStorage.getItem('videos');
        return saved ? JSON.parse(saved) : [];
    });
    const [newVideo, setNewVideo] = useState({ id: null, url: '', title: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [viewingList, setViewingList] = useState(false);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('videos', JSON.stringify(videos));
    }, [videos]);

    const handleSaveVideo = () => {
        if (!newVideo.url.trim() || !newVideo.title.trim()) return;

        if (isEditing) {
            setVideos((prev) =>
                prev.map((v) => (v.id === newVideo.id ? { ...newVideo } : v))
            );
        } else {
            setVideos((prev) => [
                ...prev,
                { id: Date.now(), url: newVideo.url.trim(), title: newVideo.title.trim() },
            ]);
        }
        setNewVideo({ id: null, url: '', title: '' });
        setIsEditing(false);
    };

    const handleEditVideo = (video) => {
        setNewVideo(video);
        setIsEditing(true);
        setViewingList(false);
    };

    const handleDeleteVideo = (id) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            setVideos((prev) => prev.filter((v) => v.id !== id));
        }
    };

    const handleCancelEdit = () => {
        setNewVideo({ id: null, url: '', title: '' });
        setIsEditing(false);
    };

    return (
        <div className="app-container">
            <header className="header">
                <h3>Admin - Short Video Manager</h3>
                <button onClick={() => setViewingList(!viewingList)}>
                    {viewingList ? 'Upload New Video' : 'View Uploaded Videos'}
                </button>
            </header>

            {!viewingList ? (
                <>
                    <VideoUploadForm
                        onSubmit={handleSaveVideo}
                        newVideo={newVideo}
                        setNewVideo={setNewVideo}
                        isEditing={isEditing}
                        onCancelEdit={handleCancelEdit}
                    />
                </>
            ) : (
                <div className="video-list">
                    {videos.length ? (
                        videos.map((video) => (
                            <VideoItem
                                key={video.id}
                                video={video}
                                onEdit={handleEditVideo}
                                onDelete={handleDeleteVideo}
                            />
                        ))
                    ) : (
                        <p className="no-videos">No videos uploaded yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}
