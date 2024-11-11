import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom";

// imports the various components
import Landing from "./components/landingPage/Landing";
import About from "./components/aboutPage/About";
import NavigationBar from "./components/landingPage/NavigationBar";
import Contact from "./components/contact/Contact";

// import from admin directory
import AdminNavBar from "./components/admin/AdminNavBar";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdmitTenant from "./components/admin/AdmitTenant";
import ViewTenants from "./components/admin/ViewTenants";
import AddProperty from "./components/admin/AddProperty";
import ViewProperties from "./components/admin/ViewProperties";
import ListProperty from "./components/admin/ListProperty";
import ListedProperties from "./components/admin/ListedProperties";
import CreateAnnouncement from "./components/admin/CreateAnnouncement";
import ViewAnnouncements from "./components/admin/ViewAnnouncements";

// import from tenant directory
import TenantNavBar from "./components/tenant/TenantNavBar";
import TenantDashboard from "./components/tenant/TenantDashboard";
import UpdateProfile from "./components/tenant/UpdateProfile";

// import from chat
import Chat from "./components/chat/Chat";

// import from logRequest
import LogRequest from "./components/logRequest/LogRequest";
import ViewMyLogRequests from "./components/logRequest/ViewMyLogRequests";
import ViewAllLogRequests from "./components/logRequest/ViewAllLogRequests";

// import from uploadDocument
import UploadDocument from "./components/uploadDocument/UploadDocument";

// import from auth
import ChangePassword from "./components/auth/ChangePassword";
import Logout from "./components/auth/Logout";
import ForgotPassword from "./components/auth/ForgotPassword";
import Login from "./components/auth/Login";
import ResetPassword from "./components/auth/ResetPassword";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<NavigationBar />}>
          <Route index element={<Landing />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="reset_password/:token" element={<ResetPassword />} />
          <Route path="forgot_password" element={<ForgotPassword />} />
    </Route>
    <Route path="AdminDashboard" element={<AdminNavBar />}>
          <Route index element={<AdminDashboard />} />
          <Route path="Chat" element={<Chat />} />
          <Route path="AdmitTenant" element={<AdmitTenant />} />
          <Route path="ViewTenants" element={<ViewTenants />} />
          <Route path="AddProperty" element={<AddProperty />} />
          <Route path="ViewProperties" element={<ViewProperties />} />
          <Route path="ListProperty" element={<ListProperty />} />
          <Route path="ListedProperties" element={<ListedProperties />} />
          <Route path="CreateAnnouncement" element={<CreateAnnouncement />} />
          <Route path="ViewAnnouncements" element={<ViewAnnouncements />} />
	  <Route path="LogRequest" element={<LogRequest />} />
          <Route path="ViewMyLogRequests" element={<ViewMyLogRequests />} />
          <Route path="ViewAllLogRequests" element={<ViewAllLogRequests />} />
    	  <Route path="UploadDocument" element={<UploadDocument />} />
          <Route path="ChangePassword" element={<ChangePassword />} />
          <Route path="Logout" element={<Logout />} />
    </Route>
    <Route path="TenantDashboard" element={<TenantNavBar />}>
          <Route index element={<TenantDashboard />} />
          <Route path="Chat" element={<Chat />} />
          <Route path="ViewMyLogRequests" element={<ViewMyLogRequests />} />
          <Route path="UpdateProfile" element={<UpdateProfile />} />
	  <Route path="LogRequest" element={<LogRequest />} />
    	  <Route path="UploadDocument" element={<UploadDocument />} />
          <Route path="ChangePassword" element={<ChangePassword />} />
          <Route path="Logout" element={<Logout />} />
    </Route>
    </>
  )
);

function App() {
  return (
    <div>
	<RouterProvider router={router} />
    </div>
  );
}

export default App;
