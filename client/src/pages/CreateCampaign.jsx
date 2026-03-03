import { useState, useEffect } from "react";
import { createCampaign, updateCampaign } from "../api/donations";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const CreateCampaign = ({ campaign, onSuccess }) => {
  const [targetAmount, setTargetAmount] = useState("");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  // Prefill when editing
  useEffect(() => {
    if (campaign) {
      setTargetAmount(campaign.targetAmount);
      setMessage(campaign.message);
      setDescription(campaign.description || "");
      setPreview(
        campaign.image || null,
      );
    } else {
      setTargetAmount("");
      setMessage("");
      setDescription("");
      setImage(null);
      setPreview(null);
    }
  }, [campaign]);

  // Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!targetAmount || targetAmount <= 0) {
      alert("Enter valid target amount");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("targetAmount", targetAmount);
      formData.append("message", message);
      formData.append("description", description);

      if (image) formData.append("image", image);

      if (campaign) await updateCampaign(campaign._id, formData);
      else await createCampaign(formData);

      onSuccess?.();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Preview */}
      {preview && (
        <img src={preview} className="w-full h-40 object-cover rounded-lg" />
      )}

      {/* Image Upload */}
      <Input type="file" accept="image/*" onChange={handleImageChange} />

      {/* Title */}
      <Input
        placeholder="Campaign Title"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Description */}
      <Textarea
        placeholder="Campaign Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Target */}
      <Input
        type="number"
        placeholder="Target Amount"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
      />

      <Button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 w-full"
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : campaign
            ? "Update Campaign"
            : "Create Campaign"}
      </Button>
    </form>
  );
};

export default CreateCampaign;
