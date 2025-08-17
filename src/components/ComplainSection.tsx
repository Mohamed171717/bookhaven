"use client";

import { useState } from "react";
import { db } from "@/lib/firebase"; // adjust path to your Firebase config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { uploadImageToImageKit } from "@/app/[locale]/utils/imagekitUpload";
import { useAuth } from "@/context/AuthContext";

type ComplainType = "user" | "book";

export default function ComplaintSection() {
  const t = useTranslations("HomePage");
  const { user } = useAuth();
  const [desc, setDesc] = useState("");
  const [complainType, setComplainType] = useState<ComplainType>("user");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error(t("loginRequired"));
      return;
    }
    setLoading(true);

    try {
      if (!desc || !file) {
        toast.error("Please fill in all fields.");
        setLoading(false);
        return;
      }
      const imageUrl = await uploadImageToImageKit(file);
      if (!imageUrl) return alert("Failed to upload image");

      await addDoc(collection(db, "complains"), {
        userId: user?.uid,
        reporter: user?.email,
        reportedTo: email,
        description: desc,
        complainType,
        image: imageUrl,
        createdAt: serverTimestamp(),
      });

      toast.success("Complaint submitted successfully!");
      setDesc("");
      setEmail("");
      setFile(null);
    } catch (error) {
      console.error("Error submitting complaint:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 md:py-16 bg-card-color border primary-color">
      <div className="container mx-auto px-4 md:px-8 lg:px-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          {t("complaintTitle")}
        </h2>
        <p className="text-base md:text-lg mb-6 md:mb-8 text-center">
          {t("complaintDesc")}
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-card-bg p-6 rounded-lg shadow-lg space-y-3 text-gray-800"
        >
          <label className="text-md font-semibold text-gray-600">
            {t("complainPlaceholder")}
          </label>
          <textarea
            placeholder={t("descPlaceholder")}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
            rows={4}
            className="w-full px-4 resize-none py-3 border rounded-lg focus:outline-none mb-3"
          ></textarea>
          <label
            htmlFor="email"
            className="text-md font-semibold text-gray-600 mt-4"
          >
            Enter email the person you want to report
          </label>
          <input
            placeholder="spammer@gmail.com"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            title="email"
            type="email"
            name=""
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div
            style={{ marginBottom: "12px" }}
            className="flex items-center space-x-4"
          >
            <label className="text-md py-2 font-semibold text-gray-600">
              {t("complaintType")}
            </label>
            <select
              title="Complain Type"
              value={complainType}
              style={{ marginRight: "10px" }}
              onChange={(e) => setComplainType(e.target.value as ComplainType)}
              className="px-4 py-2 border rounded-lg focus:outline-none"
            >
              <option value="user">{t("complaintTypeUser")}</option>
              <option value="book">{t("complaintTypeBook")}</option>
            </select>
          </div>
          <label className="text-md font-semibold text-gray-600">
            {t("imagePlaceholder")}
          </label>
          <input
            title="Image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                setFile(selected);
              }
            }}
            className="w-full px-4 pt-1 pb-3 mt-1 border rounded-lg focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-color hover:bg-[#a16950] text-white font-semibold py-3 px-6 rounded-full transition duration-300"
          >
            {loading ? t("sending") : t("submitComplaint")}
          </button>
        </form>
      </div>
    </section>
  );
}
