import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="flex flex-col"
      >
        <h3 className="text-2xl font-bold text-black">Create an Account</h3>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              {
                value: fullName,
                onChange: (e) => setFullName(e.target.value),
                label: "Full Name",
                placeholder: "Roshan",
                type: "text",
                dir: -20,
              },
              {
                value: email,
                onChange: (e) => setEmail(e.target.value),
                label: "Email Address",
                placeholder: "roshan@gmail.com",
                type: "text",
                dir: 20,
              },
              {
                value: password,
                onChange: (e) => setPassword(e.target.value),
                label: "Password",
                placeholder: "Min 8 Characters",
                type: "password",
                dir: -20,
              },
              {
                value: adminInviteToken,
                onChange: (e) => setAdminInviteToken(e.target.value),
                label: "Admin Invite Token",
                placeholder: "6 Digit code",
                type: "text",
                dir: 20,
              },
            ].map((field, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { x: field.dir, opacity: 0 },
                  visible: { x: 0, opacity: 1 },
                }}
              >
                <Input {...field} />
              </motion.div>
            ))}
          </motion.div>

          {error && (
            <motion.p
              initial={{ x: -10 }}
              animate={{ x: [0, -8, 8, -4, 4, 0] }}
              transition={{ duration: 0.5 }}
              className="text-red-500 text-xs"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className={`btn-primary ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "SIGN UP"}
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-slate-700 mt-4 text-center"
          >
            Have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              LogIn
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </AuthLayout>
  );
}
