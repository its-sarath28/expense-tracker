import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const updateUser = async (
  uid: string,
  userData: UserDataType
): Promise<ResponseType> => {
  try {
    if (userData.image && userData?.image?.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        userData.image,
        "Users"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload image",
        };
      }

      userData.image = imageUploadRes.data;
    }

    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, userData);

    return { success: true, msg: "Updated successfully" };
  } catch (err: any) {
    console.log(`Error in updating user: ${err}`);
    return {
      success: false,
      msg: err.message,
    };
  }
};
