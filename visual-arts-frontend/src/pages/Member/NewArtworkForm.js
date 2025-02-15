import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addArtwork } from "../../redux/slices/artworkSlice";
import FormInput from "../../components/Shared/FormInput";
import { useForm } from "react-hook-form";

const NewArtworkForm = () => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("sketch"); // 🔹 Default category

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setValue("image", file);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.append("category", category); // 🔹 Include category

    dispatch(addArtwork(formData));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Submit New Artwork</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Title"
          {...register("title", { required: "Title is required" })}
          error={errors.title?.message}
        />
        <FormInput
          label="Description"
          {...register("description", { required: "Description is required" })}
          error={errors.description?.message}
        />
        
        {/* Category Selection Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="sketch">Sketch</option>
            <option value="canvas">Canvas</option>
            <option value="wallart">Wall Art</option>
            <option value="digital">Digital</option>
            <option value="photography">Photography</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Artwork Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1" />
          {image && <p className="text-gray-600 text-sm">Selected: {image.name}</p>}
        </div>

        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewArtworkForm;
