import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { sName, userType } from "../utils";
import swal from "sweetalert";
import M from "materialize-css";

const SignUp = () => {
  const history = useHistory();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPasword] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "voting");
    data.append("cloud_name", "dvfpkko1z");
    fetch("https://api.cloudinary.com/v1_1/dvfpkko1z/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFields = () => {
    if (!email) {
      swal("Error", "Email is required", "error");
      return;
    }
    if (!password) {
      swal("Error", "Password is required", "error");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      swal("Error", "Invalid email", "error");
      return;
    }
    fetch("https://online-voting-backend-y9ri.onrender.com/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        password,
        email,
        city,
        stateName,
        mobile,
        age,
        pic: url,
        isAdmin: userRole === "Admin",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          swal("Error", data.error, "error");
        } else {
          swal("Success", data.message, "success");
          history.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const PostData = () => {
    if (age < 18) {
      swal("Not Eligible", "You are not eligible to vote", "error");
      return;
    }
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="col-5" style={{ margin: "auto" }}>
      <div className="card px-5 py-2" style={{ margin: "5%" }}>
        <h4 style={{ margin: "auto", marginBottom: "20px" }}>Registration</h4>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col">
            <input
              type="text"
              placeholder="email"
              value={email}
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPasword(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-6">
            <input
              className="form-control"
              type="text"
              placeholder="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            >
              {sName.map((item) => (
                <option value={item} key={item}>
                  {" "}
                  {item}{" "}
                </option>
              ))}
            </select>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-6">
            <input
              type="number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="form-control"
              placeholder="Reg No"
            />
          </div>
          <div className="col-md-6">
            <input
              type="number"
              className="form-control"
              placeholder="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col">
            <select
              className="form-select"
              style={{ marginTop: "5px", width: "100%" }}
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              {userType.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <br />
        <div className="input-group mb-3">
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label className="input-group-text" htmlFor="inputGroupFile02">
            Upload
          </label>
        </div>
        <button
          className="btn btn-success mb-4 mt-2"
          onClick={() => PostData()}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default SignUp;
