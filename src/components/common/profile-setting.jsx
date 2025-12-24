import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Auth } from "aws-amplify";
import { Eye, PencilLine, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { useSidebar } from "../ui/sidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminDetails, updateProfileDetails, uploadProfileImageOnS3 } from "../service/userAdmin";
import { toast } from "react-toastify";
import { useUserIdType } from "@/hooks/useUserIdType";
import { queryKeys } from "@/utils";
const uploadToS3 = async (uploadUrl, file) => {
  const type = file.type;
  const binaryData = await file.arrayBuffer()
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file, // raw file
  });

  if (!res.ok) {
    throw new Error("Failed to upload to S3");
  }
};

const ProfileSetting = ({ setIsProfile, editProfile }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const queryClient = useQueryClient();
  const {userId, userType, email: userEmail} = useUserIdType();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const { open } = useSidebar();
  const fileInputRef = useRef(null);
  const [preview, setPreView] = useState(null);
  const [profileImage,setProfileImage] = useState(null);
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const getUserDetail = useQuery({
    queryKey: [queryKeys.getUserDetails, userId],
    queryFn: () => getAdminDetails(userId)
  })
  useEffect(() => {
    if(getUserDetail.isSuccess) {
      setName(getUserDetail.data?.attributes?.name)
      setEmail(getUserDetail.data?.attributes?.email)
      setPhone(getUserDetail.data?.attributes?.phone_number)
    }
  }, [getUserDetail.isSuccess, getUserDetail.data])
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreView(URL.createObjectURL(file))
  };
  const updateProfileMutation = useMutation({
    mutationFn: (payload) => updateProfileDetails(payload),
    onSuccess: (data) => {
      if(!profileImage) {
        toast.success(data?.message);
        queryClient.invalidateQueries([queryKeys.getUserDetails]);
        setIsProfile(false)
      }
    }
  })

  const uploadToS3ApiMutation = useMutation({
    mutationFn: (uploadUrl) => uploadToS3(uploadUrl, profileImage),
    onSuccess: () => {
      if(profileImage) {
        toast.success("Profile changed successfully");
        queryClient.invalidateQueries([queryKeys.getUserDetails]);
        setProfileImage(null);
        setIsProfile(false)
      }
    }
  })

  const S3ApiMutation = useMutation({
    mutationFn: (payload) => uploadProfileImageOnS3(payload),
    onSuccess: (data) => {
      uploadToS3ApiMutation.mutate(data?.uploadUrl)
    }
  });
  
  const handleProfileChange = (e) => {
    e.preventDefault();
    const payload = {userId, userType, name, phoneNumber: phone, email: userEmail};
    updateProfileMutation?.mutate(payload);
    if(!!profileImage) {
      const fileName = profileImage.name;
      const fileType = profileImage.type;
      S3ApiMutation.mutate({fileName, fileType, userId, userType})
    }
  }
  return (
    <div className="bg-[#F5F0EC] flex items-start justify-start text-secondary">
      {editProfile === true ? (
        <div className="bg-white rounded-xl px-8 pt-8 pb-0 flex flex-col md:flex-row items-start gap-10 w-full shadow-md">
          <div className="flex flex-col w-full">
            <div className="mb-5">
              <p className="text-xl font-medium">Edit Profile</p>
            </div>

            <div className={`flex gap-10 pt-5 border-t border-gray-200 mb-2 flex-col ${open ? "md:flex-col": "md:flex-row"} lg:flex-row`}>
              <div className="flex flex-col items-center gap-4">
                <img
                  src={preview ?? getUserDetail?.data?.profileImageUrl}
                  alt="Profile"
                  className="w-60 h-60 rounded-2xl object-cover"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  variant="outline"
                  className="border-none text-secondary hover:bg-tertiary hover:text-white rounded-md px-6 w-full bg-coffee-bg-billing-foreground"
                  onClick={handleClick}
                >
                  <Upload /> Upload Image
                </Button>
              </div>

              <form className="space-y-6 flex-1 w-full"  onSubmit={handleProfileChange}>
                <div className="mb-9">
                  <Label
                    htmlFor="current-password"
                    className="text-secondary text-sm"
                  >
                    Name
                  </Label>
                  <Input
                    required
                    type="text"
                    id="phone"
                    name="username"
                    placeholder="Name"
                    className="font-medium  placeholder:font-normal mt-3 bg-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-9">
                  <Label
                    htmlFor="new-password"
                    className="text-secondary text-sm"
                  >
                    Phone Number
                  </Label>
                  <Input
                    required
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    className="font-medium  placeholder:font-normal mt-3 bg-white"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="confirm-password"
                    className="text-secondary text-sm"
                  >
                    Email id
                  </Label>
                  <Input
                    disabled
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className="font-medium  placeholder:font-normal mt-3 bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="justify-end flex gap-4 items-center mt-7 mb-5">
                  <Button
                    variant="secondary"
                    // className="bg-tertiary text-white hover:bg-[#9C3D26] hover:text-white rounded-md px-12 mb-6 w-[20%]"
                    disabled={updateProfileMutation.isPending || uploadToS3ApiMutation?.isPending || S3ApiMutation?.isPending}
                    size="lg"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
            <Separator />
            <div className="w-full">
              <div>
                <p className="text-md font-medium mt-5">Change Password</p>
              </div>
              <form>
                <div className={`grid sm:grid-cols-1 ${ open ? "md:grid-cols-1" : "md:grid-cols-2"} ${ open ? "lg:grid-cols-2" : "lg:grid-cols-3"} xl:grid-cols-3 gap-6 mt-5 w-full`}>
                  <div>
                    <Label
                      htmlFor="new-password"
                      className="text-secondary text-sm"
                    >
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        type="password"
                        id="current-password"
                        name="current-password"
                        placeholder="Current password"
                        className="font-medium  placeholder:font-normal mt-3 bg-white pr-9"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary text-500 w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="confirm-password"
                      className="text-secondary text-sm"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        type="password"
                        id="new-password"
                        name="new-password"
                        placeholder="New password"
                        className="font-medium  placeholder:font-normal mt-3 bg-white pr-9"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary text-500 w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="confirm-password"
                      className="text-secondary text-sm"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="Confirm new password"
                        className="font-medium  placeholder:font-normal mt-3 bg-white pr-9"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary text-500 w-4 h-4" />
                    </div>
                  </div>

                  {isError && (
                    <small className="text-red-600">
                      Error in updating password
                    </small>
                  )}
                  {isSuccess && (
                    <small className="text-green-600">
                      Password Changed Successfully!
                    </small>
                  )}
                </div>
                <div className="my-4 justify-end flex gap-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    // className="bg-tertiary text-white hover:bg-[#9C3D26] hover:text-white rounded-md px-12"
                    onClick={() => setIsProfile(false)}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>

          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 w-full">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-xl font-medium">Profile Details</p>
            <Button
              // size="icon"
              className="text-md"
              variant="ghost"
              onClick={() => setIsProfile(true)}
            >
              <PencilLine /> Edit Profile
            </Button>
          </div>
          <Separator />
          <div className="flex flex-col md:flex-row items-start gap-10 mt-6">
            <div className="flex flex-col items-center gap-4">
              <img
                src={getUserDetail?.data?.profileImageUrl}
                alt="Profile"
                className="w-60 h-60 rounded-2xl object-cover"
              />
            </div>

            <form className="space-y-6 flex-1">
              <div>
                <Label htmlFor="name" className="">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Current password"
                  className="bg-[#F5F0EC] text-tertiary font-normal border-none focus-visible:ring-0 mt-5 pointer-events-none"
                  value={getUserDetail.data?.attributes?.name ?? ""}
                />
              </div>

              <div>
                <Label htmlFor="phone" className="">
                  Phone Number
                </Label>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="New password"
                  className="bg-[#F5F0EC] text-tertiary font-normal border-none focus-visible:ring-0 mt-5 pointer-events-none"
                  value={getUserDetail.data?.attributes?.phone_number ?? ""}
                  //   onChange={(e) => setNewpassword(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email" className="">
                  Email id
                </Label>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Confirm new password"
                  className="bg-[#F5F0EC] text-tertiary font-normal border-none focus-visible:ring-0 mt-5 pointer-events-none"
                  value={getUserDetail.data?.attributes?.email ?? ""}
                  //   onChange={(e) => setConfirmpassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password" className="">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border border-gray-300 focus:border-brown-500 text-tertiary text-800 rounded-lg px-4 py-3 pr-10 focus:outline-none password-input pointer-events-none"
                    value={"john@email.com"}
                    //   onChange={(e) => setConfirmpassword(e.target.value)}
                  />
                  <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary text-500 w-4 h-4" />
                </div>
              </div>
              {isError && (
                <small className="text-red-600">
                  Error in updating password
                </small>
              )}
              {isSuccess && (
                <small className="text-green-600">
                  Password Changed Successfully!
                </small>
              )}
            </form>
          </div>
        </div>
      )}
      <style jsx>{`
        input.password-input {
          -webkit-text-security: disc;
          text-security: disc;
          font-size: 20px;
          color: #5c4033; /* brown */
        }
        input.password-input::placeholder {
          color: #aaa;
        }
      `}</style>
    </div>
  );
};

export default ProfileSetting;
