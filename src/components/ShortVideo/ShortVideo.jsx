import React, { useState, useEffect } from "react";
import "./ShortVideo.css";
import { db, storage } from "../../firebase";
import { collection, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// --- Video Upload Form ---
const VideoUploadForm = ({ onSubmit, newVideo, setNewVideo, isEditing, onCancelEdit, uploadProgress }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="form-card">
      <h2 className="form-title">{isEditing ? "Edit Video Details" : "Upload New Video"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="url"
            placeholder="Or enter Video URL"
            value={newVideo.url}
            onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Upload Video File:</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setNewVideo({ ...newVideo, file: e.target.files[0] })}
          />
        </div>

        <div className="input-group">
          <label>Upload Thumbnail (Optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewVideo({ ...newVideo, thumbnailFile: e.target.files[0] })}
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

        {uploadProgress > 0 && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
              {uploadProgress}%
            </div>
          </div>
        )}

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={uploadProgress > 0}>
            {isEditing ? "UPDATE VIDEO" : "UPLOAD VIDEO"}
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
    {video.thumbnail ? (
      <img src={video.thumbnail} alt={video.title} className="video-thumbnail" width="320" height="180" />
    ) : video.url && video.url.endsWith(".mp4") ? (
      <video width="320" height="180" controls>
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      video.url && (
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="video-url">
          {video.url}
        </a>
      )
    )}

    <div className="video-actions">
      <button onClick={() => onEdit(video)} className="btn btn-edit">Edit</button>
      <button onClick={() => onDelete(video.id)} className="btn btn-delete">Delete</button>
    </div>
  </div>
);

// --- Main Component ---
export default function AdminUploadingYouTubeVideos() {
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ id: null, url: "", title: "", file: null, thumbnailFile: null });
  const [isEditing, setIsEditing] = useState(false);
  const [viewingList, setViewingList] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const collectionRef = collection(db, "admin", "youtube_short", "shorts");

  // Load videos from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const loadedVideos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVideos(loadedVideos);
    });
    return () => unsubscribe();
  }, []);

  // Save video and optional thumbnail
  const handleSaveVideo = async () => {
    if ((!newVideo.url && !newVideo.file) || !newVideo.title.trim()) {
      alert("Please provide a title and either a URL or a video file.");
      return;
    }

    let videoUrl = newVideo.url;
    let thumbnailUrl = "";

    try {
      // Upload video if file exists
      if (newVideo.file) {
        const videoRef = ref(storage, `videos/${Date.now()}_${newVideo.file.name}`);
        const uploadTask = uploadBytesResumable(videoRef, newVideo.file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) =>
              setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
            (error) => reject(error),
            async () => {
              videoUrl = await getDownloadURL(uploadTask.snapshot.ref);
              setUploadProgress(0);
              resolve();
            }
          );
        });
      }

      // Upload thumbnail if provided
      if (newVideo.thumbnailFile) {
        const thumbRef = ref(storage, `thumbnails/${Date.now()}_${newVideo.thumbnailFile.name}`);
        const thumbUpload = uploadBytesResumable(thumbRef, newVideo.thumbnailFile);
        await new Promise((resolve, reject) => {
          thumbUpload.on(
            "state_changed",
            (snapshot) => {},
            (error) => reject(error),
            async () => {
              thumbnailUrl = await getDownloadURL(thumbRef);
              resolve();
            }
          );
        });
      }

      // Save to Firestore
      const videoId = isEditing ? newVideo.id : Date.now().toString();
      const videoData = {
        title: newVideo.title.trim(),
        url: videoUrl,
        thumbnail: thumbnailUrl,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(collectionRef, videoId), videoData);
      setNewVideo({ id: null, url: "", title: "", file: null, thumbnailFile: null });
      setIsEditing(false);
    } catch (err) {
      console.error("Error uploading:", err);
      alert("Upload failed. Check console.");
      setUploadProgress(0);
    }
  };

  const handleEditVideo = (video) => {
    setNewVideo({ ...video, file: null, thumbnailFile: null });
    setIsEditing(true);
    setViewingList(false);
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteDoc(doc(collectionRef, id));
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Error deleting video. Check console.");
      }
    }
  };

  const handleCancelEdit = () => {
    setNewVideo({ id: null, url: "", title: "", file: null, thumbnailFile: null });
    setIsEditing(false);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h3>Admin - Short Video Manager</h3>
        <button onClick={() => setViewingList(!viewingList)}>
          {viewingList ? "Upload New Video" : "View Uploaded Videos"}
        </button>
      </header>

      {!viewingList ? (
        <VideoUploadForm
          onSubmit={handleSaveVideo}
          newVideo={newVideo}
          setNewVideo={setNewVideo}
          isEditing={isEditing}
          onCancelEdit={handleCancelEdit}
          uploadProgress={uploadProgress}
        />
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
