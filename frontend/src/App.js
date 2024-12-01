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
import UpdateProperty from "./components/admin/UpdateProperty";
import ListProperty from "./components/admin/ListProperty";
import ListedProperties from "./components/admin/ListedProperties";
import CreateAnnouncement from "./components/admin/CreateAnnouncement";
import ViewAnnouncements from "./components/admin/ViewAnnouncements";
import TenantDetails from "./components/admin/TenantDetails";
import UpdateTenant from "./components/admin/UpdateTenant";
import ViewTenantProfile from "./components/admin/ViewTenantProfile";
import UpdateTenantProfile from "./components/admin/UpdateTenantProfile";

// import from tenant directory
import TenantNavBar from "./components/tenant/TenantNavBar";
import TenantDashboard from "./components/tenant/TenantDashboard";
import TenantProfile from "./components/tenant/TenantProfile";
import UpdateProfile from "./components/tenant/UpdateProfile";
import LeaseAgreement from "./components/tenant/LeaseAgreement";

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
          <Route path="tenant_profile/:email/:tenantId/:address" element={<TenantProfile />} />
          <Route path="lease_agreement/:id" element={<LeaseAgreement />} />
          <Route path="forgot_password" element={<ForgotPassword />} />
    </Route>
    <Route path="admin_dashboard" element={<AdminNavBar />}>
          <Route index element={<AdminDashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="admit_tenant/:id/:type/:address/:fees" element={<AdmitTenant />} />
          <Route path="view_tenants" element={<ViewTenants />} />
          <Route path="tenant_details/:id" element={<TenantDetails />} >
                <Route path="view_tenant_profile/:id" element={<ViewTenantProfile />} />
          </Route>
          <Route path="update_tenant_profile/:id" element={<UpdateTenantProfile />} />
          <Route path="update_tenant/:id" element={<UpdateTenant />} />
          <Route path="add_property" element={<AddProperty />} />
          <Route path="view_properties" element={<ViewProperties />} />
          <Route path="update_property/:id" element={<UpdateProperty />} />
          <Route path="list_property/:id" element={<ListProperty />} />
          <Route path="listed_properties" element={<ListedProperties />} />
          <Route path="create_announcement" element={<CreateAnnouncement />} />
          <Route path="view_announcements" element={<ViewAnnouncements />} />
	  <Route path="log_request" element={<LogRequest />} />
          <Route path="view_my_log_requests" element={<ViewMyLogRequests />} />
          <Route path="view_all_log_requests" element={<ViewAllLogRequests />} />
    	  <Route path="upload_document" element={<UploadDocument />} />
          <Route path="change_password" element={<ChangePassword />} />
          <Route path="logout" element={<Logout />} />
    </Route>
    <Route path="tenant_dashboard" element={<TenantNavBar />}>
          <Route index element={<TenantDashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="view_my_log_requests" element={<ViewMyLogRequests />} />
          <Route path="update_profile" element={<UpdateProfile />} />
	  <Route path="log_request" element={<LogRequest />} />
    	  <Route path="upload_document" element={<UploadDocument />} />
          <Route path="change_password" element={<ChangePassword />} />
          <Route path="logout" element={<Logout />} />
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
