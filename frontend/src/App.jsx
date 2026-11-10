import{BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import './App.css'
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Workspace from './pages/Workspace';
import WorkspaceProvider from './context/workspaceProvider';
import { Projects } from './pages/Project';
import { Tasks } from './pages/Task';
import EditProject from './pages/EditProject';
import EditWorkspace from './pages/EditWorkspace';


function App() {

  return (
    <BrowserRouter>
      <WorkspaceProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path='/dashboard' element={<Dashboard />}/>
              <Route path='/workspaces' element={<Workspace />} />
              <Route path='//workspace/:id/' element={< EditWorkspace />}/>
              <Route path='/workspace/:id/projects' element={<Projects />}/>
              <Route path='/projects' element={< Projects />}/>
              <Route path='/workspaces/:id/project/:projectid/tasks' element={<Tasks />}/>
              <Route path='/workspaces/:id/project/:projectid/edit' element={<Tasks />}/>
              <Route path='/my-tasks' element={< Tasks />}/>
              <Route path='/project/:projectid/edit' element={< EditProject />} />
            </Route>
        </Routes>
      </WorkspaceProvider>
    </BrowserRouter>
  )
}

export default App
