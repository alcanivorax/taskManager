import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance.js";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

export default function SignUp() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  // Handle SignUp Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // <-- Start loading

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter full name.");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Please enter the password");
      setLoading(false);
      return;
    }

    setError("");

    try {
      if (profilePic) {
        const formData = new FormData();
        formData.append("image", profilePic);

        const imgUploadsRes = await axiosInstance.post(
          "/api/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        profileImageUrl = imgUploadsRes.data.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        const profileRes = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);

        const fullUser = { ...profileRes.data, token };
        updateUser(fullUser);

        if (fullUser.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, Please try again.");
      }
      console.log(error);
    } finally {
      setLoading(false); // <-- End loading
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="Roshan"
              type="text"
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="roshan@gmail.com"
              type="text"
            />
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 Digit code"
              type="text"
            />
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            className={`btn-primary ${loading ? "cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "SIGN UP"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Have an account?{" "}
            <Link className="font-medium text-primary underline py-10" to="/login">
              LogIn
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
