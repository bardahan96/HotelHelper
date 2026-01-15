import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeMemberFromWorkspace } from '../store/slices/workspaceSlice';
import '../styles/components/ShareWorkspaceModal.css';

const ShareWorkspaceModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !currentWorkspace) return null;

  const isOwner = currentWorkspace.ownerId === user?.uid;
  const shareUrl = `${window.location.origin}${window.location.pathname}?workspace=${currentWorkspace.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(currentWorkspace.id);
    } catch (err) {
      console.error('Failed to copy ID:', err);
    }
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm('Remove this member?')) {
      dispatch(removeMemberFromWorkspace({
        workspaceId: currentWorkspace.id,
        userId: memberId
      }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-modal-compact" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <h3 className="share-title">Share Workspace</h3>
        <p className="share-subtitle">{currentWorkspace.name}</p>

        <div className="share-section">
          <label className="share-label">Share Link</label>
          <div className="share-input-group">
            <input
              type="text"
              className="share-input"
              value={shareUrl}
              readOnly
              onClick={(e) => e.target.select()}
            />
            <button 
              className={`btn-copy-compact ${copied ? 'copied' : ''}`}
              onClick={handleCopyLink}
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
          <p className="share-tip">Share this link with anyone you want to invite</p>
        </div>

        <div className="share-section">
          <label className="share-label">
            Members ({currentWorkspace.members?.length || 0})
          </label>
          <div className="members-grid">
            {currentWorkspace.members?.map((memberId) => (
              <div key={memberId} className="member-chip">
                <div className="member-avatar-small">
                  {memberId.charAt(0).toUpperCase()}
                </div>
                <div className="member-text">
                  <span className="member-name-small">
                    {memberId === user?.uid ? 'You' : `User ${memberId.slice(-4)}`}
                  </span>
                  <span className="member-badge">
                    {memberId === currentWorkspace.ownerId ? '👑 Owner' : 'Member'}
                  </span>
                </div>
                {isOwner && memberId !== currentWorkspace.ownerId && (
                  <button
                    className="btn-remove-compact"
                    onClick={() => handleRemoveMember(memberId)}
                    title="Remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button className="btn-close-modal" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

export default ShareWorkspaceModal;
