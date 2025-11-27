const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

console.log(CLOUD_NAME,UPLOAD_PRESET);
console.log("Cloud Name:", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);



export const uploadImage =async (file,folder) => {
    console.log('foto desde funcion uploadimage',file);
    
     const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  if (folder) {
    formData.append("folder", folder);
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  console.log('respuesta desde cloudinary',res);
  

  const data = await res.json();
  return data;

};