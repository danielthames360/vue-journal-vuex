import axios from "axios";

const uploadImage = async (file) => {
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("upload_preset", "curso-vue");
    formData.append("file", file);

    const url = "https://api.cloudinary.com/v1_1/dy8ukvwe2/image/upload";
    const { data } = await axios.post(url, formData);
    return data.secure_url;
  } catch (error) {
    console.log("Error trying to load the image, check the logs");
    return null;
  }
};

export default uploadImage;
