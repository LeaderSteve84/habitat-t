import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom";

// imports the various components
import Landing from "./components/landingPage/Landing";
import About from "./components/aboutPage/About";
import NavigationBar from "./components/landingPage/NavigationBar";
import Contact from "./components/contact/Contact";

// import from company directory
import CompanyNavbar from "./components/company/CompanyNavbar";
import CompanyDashboard from "./components/company/CompanyDashboard";
import CreateCluster from "./components/company/CreateCluster";
import ViewClusters from "./components/company/ViewClusters";
import UpdateCluster from "./components/company/UpdateCluster";

// import from cluster directory
import ClusterNavBar from "./components/cluster/ClusterNavBar";
import ClusterDashboard from "./components/cluster/ClusterDashboard";
import AdmitTenant from "./components/cluster/AdmitTenant";
import ViewTenants from "./components/cluster/ViewTenants";
import AddUnit from "./components/cluster/AddUnit";
import ViewUnits from "./components/cluster/ViewUnits";
import UpdateUnit from "./components/cluster/UpdateUnit";
import ListUnit from "./components/cluster/ListUnit";
import ListedUnits from "./components/cluster/ListedUnits";
import CreateClusterAnnouncement from "./components/cluster/CreateClusterAnnouncement";
import ViewClusterAnnouncements from "./components/cluster/ViewClusterAnnouncements";
import UpdateClusterAnnouncement from "./components/cluster/UpdateClusterAnnouncement";
import TenantDetails from "./components/cluster/TenantDetails";
import UpdateTenant from "./components/cluster/UpdateTenant";
import ViewTenantProfile from "./components/cluster/ViewTenantProfile";
import UpdateTenantProfile from "./components/cluster/UpdateTenantProfile";

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
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ResetPassword from "./components/auth/ResetPassword";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<NavigationBar />}>
          <Route index element={<Landing />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="reset_password/:token" element={<ResetPassword />} />
          <Route path="tenant_profile/:email/:tenantId/:address" element={<TenantProfile />} />
          <Route path="lease_agreement/:id" element={<LeaseAgreement />} />
          <Route path="forgot_password" element={<ForgotPassword />} />
    </Route>
    <Route path="company_dashboard/:companyId" element={<CompanyNavbar />}>
          <Route index element={<CompanyDashboard />} />
          <Route path="create_cluster" element={<CreateCluster />} />
          <Route path="view_clusters" element={<ViewClusters />} />
          <Route path="update_cluster/:clusterId" element={<UpdateCluster />} />
          <Route path="upload_document" element={<UploadDocument />} />
          <Route path="change_password" element={<ChangePassword />} />
          <Route path="logout" element={<Logout />} />
    </Route>
    <Route path="cluster_dashboard/:companyId/:clusterId/:clusterName" element={<ClusterNavBar />}>
          <Route index element={<ClusterDashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="admit_tenant/:unitId/:type/:address/:fees" element={<AdmitTenant />} />
          <Route path="view_tenants" element={<ViewTenants />} />
          <Route path="tenant_details/:tenantId" element={<TenantDetails />} >
                <Route path="view_tenant_profile/:tenantId" element={<ViewTenantProfile />} />
          </Route>
          <Route path="update_tenant_profile/:tenantId/:profileId" element={<UpdateTenantProfile />} />
          <Route path="update_tenant/:tenantId" element={<UpdateTenant />} />
          <Route path="add_unit" element={<AddUnit />} />
          <Route path="view_units" element={<ViewUnits />} />
          <Route path="update_unit/:unitId" element={<UpdateUnit />} />
          <Route path="list_unit/:id" element={<ListUnit />} />
          <Route path="listed_units" element={<ListedUnits />} />
          <Route path="create_cluster_announcement" element={<CreateClusterAnnouncement />} />
          <Route path="view_cluster_announcements" element={<ViewClusterAnnouncements />} />
          <Route path="update_cluster_announcement/:announcementId" element={<UpdateClusterAnnouncement />} />
	  <Route path="log_request" element={<LogRequest />} />
          <Route path="view_my_log_requests" element={<ViewMyLogRequests />} />
          <Route path="view_all_log_requests" element={<ViewAllLogRequests />} />
    	  <Route path="upload_document" element={<UploadDocument />} />
          <Route path="change_password" element={<ChangePassword />} />
          <Route path="logout" element={<Logout />} />
    </Route>
    <Route path="tenant_dashboard/:tenantId" element={<TenantNavBar />}>
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
