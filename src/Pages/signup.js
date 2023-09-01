import React, { useState, useEffect } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { HiOutlineMail } from "react-icons/hi";
import { RiInformationLine } from "react-icons/ri";
import { BiSolidUser } from "react-icons/bi";
import * as Yup from "yup";
import axios from "axios";
import googleicon from "../assets/images/google.png";
import "../assets/css/signup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Hiiii from "../assets/images/hi_40x40.gif";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../components/config";

function Signup({ errors, touched }) {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  useEffect(() => {
    const encodedEmail = localStorage.getItem("_auth");
    if (encodedEmail) {
      setIsLoading(true);
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    const customProvider = new GoogleAuthProvider();
    customProvider.setCustomParameters({ prompt: "select_account" });

    signInWithPopup(auth, customProvider)
      .then(async (result) => {
        console.log(result.user, "result");
        // setToken(result.user);
        // const userGoogle = {
        //   googleToken: result.user.accessToken,
        //   googleId: result.user.uid,
        //   googleName: result.user.displayName,
        //   googleEmail: result.user.email,
        //   googleImage: result.user.photoURL,
        // };

        // const encodedUser = btoa(JSON.stringify(userGoogle));
        // console.log(encodedUser, "encodedUser");
        // localStorage.setItem("_auth", encodedUser);
        // navigate("/dashboard");
        const response = await axios.post(
          process.env.REACT_APP_HOSTING_URL + '/v1/auth/signup',
          {
            email: result.user.email,
            password: '',
            is_social: true,
            firebase_id: 'string',
            id_token: result.user.accessToken,
            device_id: 'string'
          }
        );

        if (response && response.data) {
          console.log(response, 'response.data');
          navigate("/");
        } else {
          // Unexpected response format
          throw new Error('Invalid response from the server.');
        }
      })
      .catch((error) => {
        // console.log(error.message);
        toast.error(error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .max(50, "Name is too long - should be 50 chars maximum."),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .max(50, "Email is too long - should be 50 chars maximum.")
      .matches(
        /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
        "Invalid email address"
      )
      .lowercase(),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (values, { setSubmitting }) => {
    setLoading(true);
    const _authemail = btoa(values.email);
    localStorage.setItem("_authemail", _authemail);
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };
    axios
      .post(process.env.REACT_APP_HOSTING_URL + "/v1/auth/signup", payload)
      .then((response) => {
        console.log(response, "response");
        var signupToken = response.data.data;
        localStorage.setItem("signupToken", signupToken);
        navigate("/otpVarification");
      })
      .catch((error) => {
        console.log(error.response.data);
        toast.error(error.response.data.detail);
      })
      .finally(() => {
        console.log("finally");
        setLoading(false);
        setSubmitting(false);
      });
  };

  return (
    <>
      <ToastContainer />
      <div className=" h-full w-full">
        <div className="flex flex-col justify-center items-center left_block left_backgroundinage">
          <div className="left_heading text-center">
            <h1 className="text-4xl font-bold dark:text-gray-100 text-gray-900">
              Create{" "}
              <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent mr-3">
                Account
              </span>
              <img
                src={Hiiii}
                alt="Hiiii"
                style={{
                  width: "40px",
                  height: "40px",
                  display: "inline-block",
                  borderRadius: "50%",
                }}
              />
            </h1>
            <p className="text-gray-500">Please Fill The Below Details</p>
          </div>
          <div className="mt-10 form_layout">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="flex flex-col justify-center items-center">
                  <div className="nameinput form_layout mb-3">
                    <label className="text-gray-500">Enter your name</label>
                    <div className="inputbox-container mt-1">
                      <Field
                        type="text"
                        name="name"
                        placeholder="Name"
                        className={`inputbox dark:bg-purple-200 text-black ${
                          errors.name && touched.name ? "border-red-500" : ""
                        } dark:text-white`}
                      />
                      <span className="email-icon">
                        <BiSolidUser className="dark:text-gray-800 text-gray-500" />
                      </span>
                    </div>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error-message mt-2"
                    />
                  </div>

                  <div className="emailinput form_layout mb-3">
                    <label className="text-gray-500 emailinput">
                      Enter your email
                    </label>
                    <div className="inputbox-container mt-1">
                      <Field
                        type="text"
                        name="email"
                        placeholder="Email"
                        className={`inputbox dark:bg-purple-200 text-black ${
                          errors.email && touched.email ? "border-red-500" : ""
                        }`}
                      />
                      <span className="email-icon">
                        <HiOutlineMail className="dark:text-gray-800 text-gray-500" />
                      </span>
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-message mt-2"
                    />
                  </div>
                  <div className="passwordinput form_layout mb-3">
                    <label className="text-gray-500 mt-2">
                      Enter your password{" "}
                      <RiInformationLine
                        data-tooltip-id="password-tooltip"
                        className="password-tooltip ml-2"
                      />
                    </label>
                    <Tooltip
                      id="password-tooltip"
                      content="Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character"
                      className="custom-tooltip"
                    />
                    <div className="inputbox-container mt-1">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className={`inputbox dark:bg-purple-200 text-black ${
                          errors.password && touched.password
                            ? "border-red-500"
                            : ""
                        }`}
                        autoComplete="current-password"
                      />
                      <span
                        className="password-icon"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <BsEyeFill className="dark:text-gray-800 text-gray-500" />
                        ) : (
                          <BsEyeSlashFill className="dark:text-gray-800 text-gray-500" />
                        )}
                      </span>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message mt-2"
                    />
                  </div>
                  <div className="passwordinput form_layout mb-3">
                    <label className="text-gray-500 mt-2">
                      Confirm your password{" "}
                      <RiInformationLine
                        data-tooltip-id="confirm-password-tooltip"
                        className="password-tooltip ml-2"
                      />
                    </label>
                    <Tooltip
                      id="confirm-password-tooltip"
                      content="Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character"
                      className="custom-tooltip"
                    />
                    <div className="inputbox-container mt-1">
                      <Field
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className={`inputbox dark:bg-purple-200 text-black ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <span
                        className="password-icon"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <BsEyeFill className="dark:text-gray-800 text-gray-500" />
                        ) : (
                          <BsEyeSlashFill className="dark:text-gray-800 text-gray-500" />
                        )}
                      </span>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="error-message mt-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="submitbutton mt-10 dark:bg-purple-500 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline bg-gray-200 hover:bg-gray-300 hover:shadow-lg transition duration-300 ease-in-out"
                    disabled={isSubmitting || loading}
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="flex flex-col justify-center items-center mt-2">
              <p
                className="signup_create_acp"
                style={{ justifyContent: "space-between!important" }}
              >
                Already have an account?
                <Link to="/" className="create_ac ml-2">
                  Login
                </Link>
              </p>
            </div>
            <div title="OR" className="or_block">
              <div className="line"></div>
              <p>OR</p>
            </div>
            <button
              title="Login with google"
              className="Signup_with_thirdparty_btn dark:bg-purple-200 text-black flex items-center justify-center mt-5 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleGoogleLogin}
            >
              <div className="icon">
                <img src={googleicon} alt="google" />
              </div>
              <div>Sign up with Google</div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
