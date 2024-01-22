import { useState, useContext } from "react";
import { UserContext } from '../contexts/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import React from "react";
import "./styling/contact.css";
import { JobContext } from '../contexts/JobContext';

const initialState = {
  customerType: "individual",
  title: "",
  name: "",
  address: "",
  city: "",
  postalCode: "",
  email: "",
  phoneNumber: "",
  description: "",
  companyName: "",
  orgNumber: "",
};

export const Contact = (props) => {
  const [state, setState] = useState(initialState);
  const { createJobRequest } = useContext(JobContext);
  const { currentUser } = useContext(UserContext);
  if(currentUser){
    initialState.name = currentUser.name;
    initialState.email = currentUser.email;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCustomerTypeChange = (type) => {
    setState({ ...initialState, customerType: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Du måste vara inloggad för att skicka en jobförfrågan.");
      return;
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(state.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const postalCodeRegex = /^(s-|S-){0,1}[0-9]{3}\s?[0-9]{2}$/;
    if (!postalCodeRegex.test(state.postalCode)) {
      toast.error("Please enter a valid postal code.");
      return;
    }

    const jobRequest = {
      customerName: state.name,
      companyName: state.customerType === "company" ? state.companyName : "",
      jobTitle: state.title,
      jobDescription: state.description,
      jobAddress: state.address,
      jobCity: state.city,
      jobZip: state.postalCode,
      orgNumber: state.orgNumber,
      contactEmail: state.email,
      phoneNumber: state.number,
      isCompany: state.customerType === "company",
    };

    try {
      await createJobRequest(jobRequest);
      console.log('Jobförfrågan skickad utan problem');
      setState(initialState);
      toast.success("Jobförfrågan skickad!.");
    } catch (error) {
      console.error('Fel med att skicka jobförfrågan:', error);
      toast.error("Fel med att skicka jobförfrågan.");
    }
  };
  const renderFormFields = () => {
    const fields = (
      <>
        <div className="form-group">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="För & Efternamn"
            value={state.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="address"
            className="form-control"
            placeholder="Adress"
            value={state.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="city"
            className="form-control"
            placeholder="Stad"
            value={state.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="postalCode"
            className="form-control"
            placeholder="Postnummer"
            value={state.postalCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={state.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="phonenumber"
            name="phonenumber"
            className="form-control"
            placeholder="Phone number"
            value={state.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="title"
            name="title"
            className="form-control"
            placeholder="Kortfattad titel: exempel (Behöver fler uttag i köket)"
            value={state.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            className="form-control"
            rows="4"
            placeholder="Beskriv mer djupgående vad ni behöver hjälp med"
            value={state.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
      </>
    );

    if (state.customerType === "company") {
      return (
        <>
          {fields}
          <div className="form-group">
            <input
              type="text"
              name="companyName"
              className="form-control"
              placeholder="Företags Namn"
              value={state.companyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="orgNumber"
              className="form-control"
              placeholder="Organisations Nummer"
              value={state.orgNumber}
              onChange={handleChange}
              required
            />
          </div>
        </>
      );
    }

    return fields;
  };

  return (
    <div>
    <ToastContainer />
      <div id="contact">
        <div className="container">
          <div className="col-md-8">
            <div className="section-title">
              <h2>Skicka jobbförfrågan</h2>
              <p>
              För att skicka in er jobbförfrågan, vänligen fyll i era uppgifter i formuläret nedan.
              </p>
            </div>
            <div className="customer-type-buttons">
              <button
                type="button"
                className={`btn ${state.customerType === "individual" ? "btn-primary" : "btn-default"}`}
                onClick={() => handleCustomerTypeChange("individual")}
              >
                Privatperson
              </button>
              <button
                type="button"
                className={`btn ${state.customerType === "company" ? "btn-primary" : "btn-default"}`}
                onClick={() => handleCustomerTypeChange("company")}
              >
                Företag
              </button>
            </div>
            <form name="sentMessage" onSubmit={handleSubmit}>
              {renderFormFields()}
              <button type="submit" className="btn-custom btn-lg">
                Skicka Förfrågan
              </button>
            </form>
          </div>
          <div className="col-md-3 col-md-offset-1 contact-info">
            <div className="contact-item">
              <h3>Contact Info</h3>
              <p>
                <span>
                  <i className="fa fa-map-marker"></i> Adress: 
                </span>
                {props.data ? props.data.address : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-phone"></i> Nummer: 
                </span>{" "}
                {props.data ? props.data.phone : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-envelope-o"></i> Email: 
                </span>{" "}
                {props.data ? props.data.email : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-envelope-o"></i> Phone Number: 
                </span>{" "}
                {props.data ? props.data.phoneNumber : "loading"}
              </p>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="social">
                <ul>
                  <li>
                    <a href="https://www.facebook.com" aria-label="Facebook">
                      <i className="fa fa-facebook" aria-hidden="true"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.twitter.com" aria-label="Twitter">
                      <i className="fa fa-twitter" aria-hidden="true"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.youtube.com" aria-label="Youtube">
                      <i className="fa fa-youtube" aria-hidden="true"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <div className="container text-center">
          <p>
            &copy; 2023 Design av Ted Hamrén.
          </p>
        </div>
      </div>
    </div>
  );
};
