import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../customHooks/useFetch';
import axios from 'axios';

function LeaseAgreement() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [data, setData] = useState({
    name: {fname: '', lname: ''},
    DoB: '',
    sex: '',
    contactDetails: { email: '', phone: '', address: '' },
    emergencyContact: { name: '', phone: '', address: '' },
    leaseAgreement: ''
  });

  const endpoint = `/api/tenant/profile/${id}/update`;
  const { data: profile, isPending, error } = useFetch(endpoint);

  useEffect(() => {
    if (profile) {
      console.log(profile);
      setData({
        name: profile.name || {fname: '', lname: ''},
        DoB: profile.DoB || '',
        sex: profile.sex || '',
        contactDetails: profile.contactDetails || { email: '', phone: '', address: '' },
        emergencyContact: profile.emergencyContact || { name: '', phone: '', address: '' },
        leaseAgreement: profile.leaseAgreement || ''
      });
    }
  }, [profile]);

  console.log(`${profile.tenantId}`);
  const aURL = `/api/tenants/${profile.tenantId}/lease-agreements`;
  const { data: agreement, aIsPending, aError } = useFetch(aURL);
  console.log('agreement');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length > 1) {
      setData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/tenant/profile/${id}/update`, data);
      const { msg } = response.data;
      setMessage({msg: msg?.toString()});
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      const err = error.response?.data?.error || "Error submitting your decision. Try again";
      setMessage({error: err});
    }
  }

  return (
    <div className="container my-4">
      <h2 className="h4 text-center fw-bold">Lease Agreement</h2>
      { error && <div className="alert alert-danger">{ error.error }</div> }
      { isPending && <div className="text-center">Loading...</div> }
      { message && (
          <div>
            { message.msg && <p className="alert alert-info">{ message.msg }</p> }
            { message.error && <p className="alert alert-danger">{ message.error }</p> }
          </div>
      )}
      { aError && <div className="alert alert-danger">{ aError.error }</div> }
      { aIsPending && <div className="text-center">Loading lease agreement...</div> }
      <p className="text-center">{ agreement.leaseAgreementDetails }</p>
      <form onSubmit={handleSubmit}>
	  <fieldset className="mb-3">
             <legend>Did you agree to our terms of lease?</legend>
             <div className="form-check form-check-inline">
                 <input type="radio" className="form-check-input" name="leaseAgreement" value="agreed" checked={data.leaseAgreement === 'agreed'} onChange={handleChange} />
                 <label className="form-check-label">Yes</label>
             </div>
             <div className="form-check form-check-inline">
                 <input type="radio" className="form-check-input" name="leaseAgreement" value="disagreed" checked={data.leaseAgreement === 'disagreed'} onChange={handleChange} />
                 <label>No</label>
             </div>
          </fieldset>
         <button className="btn btn-primary w-100" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LeaseAgreement;
