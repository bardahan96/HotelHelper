import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initAuthListener, signOutUser } from './store/slices/authSlice';
import { joinWorkspace, clearWorkspace } from './store/slices/workspaceSlice';
import { addVacation, updateVacation, deleteVacation } from './store/slices/vacationsSlice';
import useTheme from './hooks/useTheme';
import useFirestoreSync from './hooks/useFirestoreSync';
import Logo from './components/Logo';
import ThemeToggle from './components/ThemeToggle';
import AuthScreen from './components/AuthScreen';
import WorkspaceSelector from './components/WorkspaceSelector';
import VacationList from './components/VacationList';
import VacationModal from './components/VacationModal';
import AddItemModal from './components/AddItemModal';
import ShareWorkspaceModal from './components/ShareWorkspaceModal';
import './styles/theme.css';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  
  // Redux state
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const vacations = useSelector((state) => state.vacations.items);
  
  // Local UI state
  const [vacationModalOpen, setVacationModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [editingVacation, setEditingVacation] = useState(null);
  const [currentVacationId, setCurrentVacationId] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentCustomCategory, setCurrentCustomCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const currency = '$';

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = dispatch(initAuthListener());
    return () => unsubscribe?.();
  }, [dispatch]);

  // Handle URL params for workspace joining
  useEffect(() => {
    if (!user || currentWorkspace) return;

    const urlParams = new URLSearchParams(window.location.search);
    const workspaceId = urlParams.get('workspace');

    if (workspaceId) {
      dispatch(joinWorkspace({ workspaceId, userId: user.uid }));
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user, currentWorkspace, dispatch]);

  // Real-time Firestore sync
  useFirestoreSync(currentWorkspace?.id);

  // Vacation CRUD operations
  const handleSaveVacation = async (vacationData) => {
    if (!currentWorkspace || !user) return;

    if (editingVacation) {
      // Update existing vacation
      const { id, ...updates } = vacationData;
      await dispatch(updateVacation({
        workspaceId: currentWorkspace.id,
        vacationId: id,
        updates
      }));
    } else {
      // Add new vacation
      await dispatch(addVacation({
        workspaceId: currentWorkspace.id,
        vacationData,
        userId: user.uid
      }));
    }
    setEditingVacation(null);
  };

  const handleUpdateVacation = (vacation) => {
    setEditingVacation(vacation);
    setVacationModalOpen(true);
  };

  const handleDeleteVacation = async (vacationId) => {
    if (!currentWorkspace) return;
    await dispatch(deleteVacation({
      workspaceId: currentWorkspace.id,
      vacationId
    }));
  };

  // Item selection
  const handleSelectItem = async (vacationId, category, itemId) => {
    if (!currentWorkspace) return;

    const vacation = vacations.find(v => v.id === vacationId);
    if (!vacation) return;

    const updates = {
      selectedOptions: {
        ...vacation.selectedOptions,
        [category]: vacation.selectedOptions?.[category] === itemId ? null : itemId
      }
    };

    await dispatch(updateVacation({
      workspaceId: currentWorkspace.id,
      vacationId,
      updates
    }));
  };

  // Add item
  const handleAddItem = (vacationId, category, customName) => {
    setCurrentVacationId(vacationId);
    setCurrentCategory(category);
    setCurrentCustomCategory(customName);
    setEditingItem(null);
    setItemModalOpen(true);
  };

  // Edit item
  const handleEditItem = (vacationId, category, item, customName) => {
    setCurrentVacationId(vacationId);
    setCurrentCategory(category);
    setCurrentCustomCategory(customName);
    setEditingItem(item);
    setItemModalOpen(true);
  };

  // Delete item
  const handleDeleteItem = async (vacationId, category, itemId, customName) => {
    if (!window.confirm('Delete this item?')) return;
    if (!currentWorkspace) return;

    const vacation = vacations.find(v => v.id === vacationId);
    if (!vacation) return;

    let updates;
    if (category.startsWith('custom_')) {
      const categoryName = customName || category.replace('custom_', '');
      updates = {
        customCategories: {
          ...vacation.customCategories,
          [categoryName]: vacation.customCategories[categoryName].filter(item => item.id !== itemId)
        },
        selectedOptions: {
          ...vacation.selectedOptions,
          [category]: vacation.selectedOptions?.[category] === itemId ? null : vacation.selectedOptions?.[category]
        }
      };
    } else {
      updates = {
        [category]: vacation[category].filter(item => item.id !== itemId),
        selectedOptions: {
          ...vacation.selectedOptions,
          [category]: vacation.selectedOptions?.[category] === itemId ? null : vacation.selectedOptions?.[category]
        }
      };
    }

    await dispatch(updateVacation({
      workspaceId: currentWorkspace.id,
      vacationId,
      updates
    }));
  };

  // Save item from modal
  const handleSaveItem = async (itemData, customCategoryName) => {
    if (!currentWorkspace) return;

    const vacation = vacations.find(v => v.id === currentVacationId);
    if (!vacation) return;

    // Handle new custom category creation
    if (currentCategory === '_newCustomCategory' && typeof itemData === 'string') {
      const newCategoryName = itemData;
      const updates = {
        customCategories: {
          ...vacation.customCategories,
          [newCategoryName]: []
        }
      };
      await dispatch(updateVacation({
        workspaceId: currentWorkspace.id,
        vacationId: currentVacationId,
        updates
      }));
      setItemModalOpen(false);
      return;
    }

    let updates;
    if (currentCategory.startsWith('custom_')) {
      const categoryName = customCategoryName || currentCategory.replace('custom_', '');
      const existingItems = vacation.customCategories?.[categoryName] || [];
      const itemIndex = existingItems.findIndex(item => item.id === itemData.id);
      
      let updatedItems;
      if (itemIndex >= 0) {
        updatedItems = [...existingItems];
        updatedItems[itemIndex] = itemData;
      } else {
        updatedItems = [...existingItems, itemData];
      }
      
      updates = {
        customCategories: {
          ...vacation.customCategories,
          [categoryName]: updatedItems
        }
      };
    } else {
      const existingItems = vacation[currentCategory] || [];
      const itemIndex = existingItems.findIndex(item => item.id === itemData.id);
      
      let updatedItems;
      if (itemIndex >= 0) {
        updatedItems = [...existingItems];
        updatedItems[itemIndex] = itemData;
      } else {
        updatedItems = [...existingItems, itemData];
      }
      
      updates = {
        [currentCategory]: updatedItems
      };
    }

    await dispatch(updateVacation({
      workspaceId: currentWorkspace.id,
      vacationId: currentVacationId,
      updates
    }));
  };

  const handleSignOut = async () => {
    if (window.confirm('Sign out of Planora?')) {
      await dispatch(signOutUser());
      dispatch(clearWorkspace());
    }
  };

  const handleChangeWorkspace = async () => {
    if (window.confirm('Leave this workspace?')) {
      dispatch(clearWorkspace());
    }
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="app loading">
        <div className="loading-container">
          <Logo size="large" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!user) {
    return <AuthScreen />;
  }

  // Show workspace selector if no workspace selected
  if (!currentWorkspace) {
    return <WorkspaceSelector />;
  }

  const isOwner = currentWorkspace.ownerId === user.uid;

  return (
    <div className="app">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      
      <header className="app-header">
        <div className="header-content">
          <Logo size="medium" />
          <p className="app-tagline">Plan your perfect vacation with ease</p>
        </div>
        
        <div className="header-actions">
          <div className="workspace-pill">
            <span className="workspace-name">{currentWorkspace.name}</span>
            <span className="member-count">
              {currentWorkspace.members?.length || 0} member{currentWorkspace.members?.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="action-buttons">
            {isOwner && (
              <button 
                className="btn-header share"
                onClick={() => setShareModalOpen(true)}
                title="Share workspace"
              >
                Share
              </button>
            )}
            <button 
              className="btn-header change"
              onClick={handleChangeWorkspace}
              title="Change workspace"
            >
              Switch
            </button>
            <button 
              className="btn-header signout"
              onClick={handleSignOut}
              title="Sign out"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <VacationList
          vacations={vacations}
          onUpdate={handleUpdateVacation}
          onDelete={handleDeleteVacation}
          onAddVacation={() => {
            setEditingVacation(null);
            setVacationModalOpen(true);
          }}
          onSelectItem={handleSelectItem}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          currency={currency}
        />
      </main>

      <VacationModal
        isOpen={vacationModalOpen}
        onClose={() => {
          setVacationModalOpen(false);
          setEditingVacation(null);
        }}
        onSave={handleSaveVacation}
        editingVacation={editingVacation}
      />

      <AddItemModal
        isOpen={itemModalOpen}
        onClose={() => {
          setItemModalOpen(false);
          setEditingItem(null);
          setCurrentCategory(null);
          setCurrentCustomCategory(null);
        }}
        onSave={handleSaveItem}
        categoryKey={currentCategory}
        customCategoryName={currentCustomCategory}
        editingItem={editingItem}
      />

      <ShareWorkspaceModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
};

export default App;
