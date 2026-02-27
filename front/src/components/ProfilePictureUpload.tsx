import React, { useState, useCallback, useRef } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import { userApi } from '../api/userApi';
import './ProfilePictureUpload.css';

interface ProfilePictureUploadProps {
    userId: number;
    onUploadSuccess: () => void;
    userFirstName?: string;
    userLastName?: string;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
                                                                              userId,
                                                                              onUploadSuccess,
                                                                              userFirstName = 'User',
                                                                              userLastName = 'Unknown'
                                                                          }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [timestamp, setTimestamp] = useState(Date.now());

    const [showCropper, setShowCropper] = useState(false);
    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({ unit: '%', x: 0, y: 0, width: 50, height: 50 });
    const [completedCrop, setCompletedCrop] = useState<Crop>({ unit: '%', x: 0, y: 0, width: 50, height: 50 });
    const imgRef = useRef<HTMLImageElement>(null);
    const fileRef = useRef<File | null>(null);


    const getAvatarUrl = () => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userFirstName)}+${encodeURIComponent(userLastName)}&background=667eea&color=fff&size=200&bold=true`;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Le fichier doit être une image');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('L\'image ne doit pas dépasser 5MB');
            return;
        }

        setError('');
        fileRef.current = file;

        const reader = new FileReader();
        reader.onloadend = () => {
            setCropSrc(reader.result as string);
            setShowCropper(true);
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const onCropChange = useCallback((c: Crop) => setCrop(c), []);
    const onCropComplete = useCallback((c: Crop) => setCompletedCrop(c), []);

    const getCroppedBlob = async (): Promise<Blob> => {
        if (!imgRef.current || !completedCrop.width || !completedCrop.height) return fileRef.current!;

        const canvas = document.createElement('canvas');
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
        canvas.width = (completedCrop.width ?? 0) * scaleX;
        canvas.height = (completedCrop.height ?? 0) * scaleY;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(
            imgRef.current,
            (completedCrop.x ?? 0) * scaleX,
            (completedCrop.y ?? 0) * scaleY,
            (completedCrop.width ?? 0) * scaleX,
            (completedCrop.height ?? 0) * scaleY,
            0, 0,
            (completedCrop.width ?? 0) * scaleX,
            (completedCrop.height ?? 0) * scaleY
        );
        return new Promise(resolve => canvas.toBlob(b => b && resolve(b), 'image/jpeg', 0.9));
    };

    const handleUploadCropped = async () => {
        if (!fileRef.current) return;

        try {
            setUploading(true);
            const croppedBlob = await getCroppedBlob();
            const croppedFile = new File([croppedBlob], 'avatar.jpg', {
                type: croppedBlob.type || 'image/jpeg',
                lastModified: Date.now()
            });
            await userApi.uploadProfilePicture(userId, croppedFile);
            setTimestamp(Date.now());
            onUploadSuccess();
            closeCropper();
        } catch (err: any) {
            setError(err.response?.data || "Erreur lors de l'upload");
        } finally {
            setUploading(false);
        }
    };

    const closeCropper = () => {
        setShowCropper(false);
        setCropSrc(null);
        setPreview(null);
        fileRef.current = null;
    };

    const handleDelete = async () => {
        if (!confirm('Supprimer votre photo de profil ?')) return;

        try {
            await userApi.deleteProfilePicture(userId);
            setTimestamp(Date.now());
            onUploadSuccess();
        } catch (err: any) {
            setError('Erreur lors de la suppression');
        }
    };


    const displayUrl = preview || `http://localhost:8080/api/users/${userId}/profile-picture?t=${timestamp}`;

    return (
        <div className="profile-picture-upload">
            <img
                src={displayUrl}
                className="profile-picture-preview"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = getAvatarUrl();
                }}
                alt="Profile"
            />

            <div className="upload-actions">
                <label className="upload-btn">
                    {uploading ? 'Upload...' : 'Changer la photo'}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                </label>

                <button onClick={handleDelete} className="delete-btn">
                    Supprimer
                </button>
            </div>

            {showCropper && cropSrc && (
                <div className="cropper-modal">
                    <div className="cropper-overlay" onClick={closeCropper} />
                    <div className="cropper-content">
                        <h3>Ajuste ta photo</h3>
                        <ReactCrop
                            crop={crop}
                            onChange={onCropChange}
                            onComplete={onCropComplete}
                            aspect={1}
                            minWidth={150}
                        >
                            <img ref={imgRef} src={cropSrc} alt="Cropper" />
                        </ReactCrop>
                        <div className="cropper-actions">
                            <button onClick={closeCropper} className="cancel-btn">Annuler</button>
                            <button
                                onClick={handleUploadCropped}
                                disabled={!completedCrop.width}
                                className="confirm-btn"
                            >
                                Accepter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && <p className="error-text">{error}</p>}
        </div>
    );
};
