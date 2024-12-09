import { useParams } from 'react-router-dom';

function TenantPayment() {

  const { tenantId, unitId } = useParams();

  return (
    <>
      <div className="text-center">
          <p>Tenant Payment Page</p>
          <p className="text-center">Tenant Id: { tenantId }</p>
          <p className="text-center">Unit Id: { unitId }</p>
      </div>
    </>
  );
}

export default TenantPayment;
