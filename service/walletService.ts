import { ResponseType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageService";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "@/config/firebase";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };

    if (walletData.image) {
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "Wallet"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload wallet icon",
        };
      }

      walletToSave.image = imageUploadRes.data;
    }

    if (!walletData.id) {
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true });

    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (err: any) {
    console.log(`Error in creating or updating waller: ${err.message}`);
    return { success: false, msg: err.message };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);

    await deleteDoc(walletRef);
    deleteTransactionsByWalletId(walletId);

    return { success: true };
  } catch (err: any) {
    console.log(`Error in deleting wallet: ${err.message}`);
    return { success: false, msg: err.message };
  }
};

export const deleteTransactionsByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransactions = true;

    while (hasMoreTransactions) {
      const transactionsQuery = query(
        collection(firestore, "transactions"),
        where("walletId", "==", walletId)
      );

      const transactionSnapshot = await getDocs(transactionsQuery);

      if (transactionSnapshot.empty) {
        hasMoreTransactions = false;
        break;
      }

      const batch = writeBatch(firestore);

      transactionSnapshot.forEach((transaction) => {
        batch.delete(transaction.ref);
      });

      await batch.commit();
    }

    return { success: true, msg: "All transactions deleted successfully" };
  } catch (err: any) {
    console.log(`Error in deleting wallet: ${err.message}`);
    return { success: false, msg: err.message };
  }
};
