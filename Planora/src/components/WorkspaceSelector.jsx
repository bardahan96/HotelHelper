import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createWorkspace, joinWorkspace } from '../store/slices/workspaceSlice';
import Logo from './Logo';
import '../styles/components/WorkspaceSelector.css';

const WorkspaceSelector = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.workspace);
  const [mode, setMode] = useState('main'); // 'main', 'create', 'join'
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');

  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    if (workspaceName.trim() && user) {
      dispatch(createWorkspace({ 
        name: workspaceName.trim(), 
        userId: user.uid 
      }));
    }
  };

  const handleJoinWorkspace = (e) => {
    e.preventDefault();
    if (workspaceId.trim() && user) {
      dispatch(joinWorkspace({ 
        workspaceId: workspaceId.trim(), 
        userId: user.uid 
      }));
    }
  };

  const resetForm = () => {
    setMode('main');
    setWorkspaceName('');
    setWorkspaceId('');
  };

  return (
    <div className="workspace-screen">
      <div className="workspace-box">
        <Logo size="medium" />

        {mode === 'main' && (
          <>
            <h2 className="workspace-heading">Choose Your Path</h2>
            
            <div className="workspace-actions">
              <button 
                className="workspace-btn primary"
                onClick={() => setMode('create')}
              >
                <span className="btn-icon">✨</span>
                <span>Create New Workspace</span>
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <button 
                className="workspace-btn secondary"
                onClick={() => setMode('join')}
              >
                <span className="btn-icon">🔗</span>
                <span>Join with Link</span>
              </button>
            </div>
          </>
        )}

        {mode === 'create' && (
          <>
            <h2 className="workspace-heading">Create Workspace</h2>
            <p className="workspace-hint">Name your vacation planning space</p>
            
            <form onSubmit={handleCreateWorkspace} className="workspace-form">
              <input
                type="text"
                className="workspace-input"
                placeholder="e.g., Europe Summer 2026"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                disabled={loading}
                autoFocus
                maxLength={50}
              />

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn-cancel"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-submit"
                  disabled={loading || !workspaceName.trim()}
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </>
        )}

        {mode === 'join' && (
          <>
            <h2 className="workspace-heading">Join Workspace</h2>
            <p className="workspace-hint">Paste the workspace ID you received</p>
            
            <form onSubmit={handleJoinWorkspace} className="workspace-form">
              <input
                type="text"
                className="workspace-input"
                placeholder="ws_..."
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                disabled={loading}
                autoFocus
              />

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn-cancel"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-submit"
                  disabled={loading || !workspaceId.trim()}
                >
                  {loading ? 'Joining...' : 'Join'}
                </button>
              </div>
            </form>
          </>
        )}

        {error && (
          <div className="workspace-error">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceSelector;
