import { useParams } from "react-router-dom";

function TenantProfile() {

  const { email } = useParams();

  return (
    <div>
       <h2>Tenant Profile Page</h2>
       <p>Tenant email: { email }</p>
    </div>
  );
}

export default TenantProfile;
