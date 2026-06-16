"use client";
import { FC, useState } from "react";
import { orderFormData } from "@/src/types/orderFormData";
import { formatUpdateEmail } from "@/src/emails/formatUpdateEmails";
import { useRouter } from "next/navigation";
import AdminForm from "@/app/components/ui/AdminForm";
import AdminFormSection from "@/app/components/ui/AdminFormSection";
import AdminInput from "@/app/components/ui/AdminInput";
import Button from "@/app/components/ui/Button";

interface OrderFormProps {
  id: string;
  updateFormInfo: orderFormData;
  onClose: () => void;
}
const OrderForm: FC<OrderFormProps> = ({ id, updateFormInfo, onClose }) => {
  const [formData, setFormData] = useState({
    full_name: updateFormInfo.customerName || "",
    address_line_1: updateFormInfo.address1 || "",
    address_line_2: updateFormInfo.address2 || "",
    postal: updateFormInfo.postal || "",
    city: updateFormInfo.city || "",
    province: updateFormInfo.province || "",
    email: updateFormInfo.email || "",
    phone_number: updateFormInfo.phone || "",
    shipping_status: updateFormInfo.shippingStatus || "",
    tracking_number: updateFormInfo.trackingNumber || "",
    label_url: updateFormInfo.labelUrl || "",
    estimated_delivery: updateFormInfo.estimatedDelivery
      ? updateFormInfo.estimatedDelivery.split("T")[0]
      : "",
  });

  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  const emailHtml = formatUpdateEmail(id, formData);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const updateRes = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estimated_delivery: formData.estimated_delivery || null,
        }),
      });

      if (!updateRes.ok) {
        throw new Error("Failed to update Order");
      }

      try {
        const emailRes = await fetch("/api/emails", {
          method: "Post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: formData.email,
            subject: "Kiloboy Artwork Order Update",
            html: emailHtml,
          }),
        });

        if (!emailRes.ok) {
          throw new Error("Failed to send email");
        }

        onClose();
        handleRefresh();
      } catch (err: any) {
        console.error("Update Email Error:", err);
      }
      console.log("Order Updated:", formData);
    } catch (err: any) {
      console.error("Update Orders Error:", err);
    }
  };

  return (
    <AdminForm
      title="Update Customer Information"
      description="Edit customer and shipping details for this order."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <fieldset className="space-y-6">
          {/* Customer Info */}
          <AdminFormSection title="Customer Info">
            <div className="grid md:grid-cols-2 gap-4">
              <AdminInput
                label="Customer Name"
                value={formData.full_name}
                onChange={(e) =>
                  handleChange({
                    target: { name: "full_name", value: e.target.value },
                  })
                }
                placeholder="Customer Name"
              />

              <AdminInput
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  handleChange({
                    target: { name: "email", value: e.target.value },
                  })
                }
                placeholder="Email"
              />

              <AdminInput
                label="Phone Number"
                value={formData.phone_number}
                onChange={(e) =>
                  handleChange({
                    target: { name: "phone_number", value: e.target.value },
                  })
                }
                placeholder="Phone Number"
              />

              <AdminInput
                label="Address Line 1"
                value={formData.address_line_1}
                onChange={(e) =>
                  handleChange({
                    target: { name: "address_line_1", value: e.target.value },
                  })
                }
                placeholder="Address Line 1"
              />

              <AdminInput
                label="Address Line 2"
                value={formData.address_line_2}
                onChange={(e) =>
                  handleChange({
                    target: { name: "address_line_2", value: e.target.value },
                  })
                }
                placeholder="Address Line 2"
              />

              <AdminInput
                label="Postal"
                value={formData.postal}
                onChange={(e) =>
                  handleChange({
                    target: { name: "postal", value: e.target.value },
                  })
                }
                placeholder="Postal Code"
              />

              <AdminInput
                label="City"
                value={formData.city}
                onChange={(e) =>
                  handleChange({
                    target: { name: "city", value: e.target.value },
                  })
                }
                placeholder="City"
              />

              <AdminInput
                label="Province"
                value={formData.province}
                onChange={(e) =>
                  handleChange({
                    target: { name: "province", value: e.target.value },
                  })
                }
                placeholder="Province"
              />
            </div>
          </AdminFormSection>

          {/* Shipping Info */}
          <AdminFormSection title="Shipping Info">
            <div>
              <label className="block mb-1 font-semibold text-kilotextlight">
                Shipping Status
              </label>

              <select
                className="
                  w-full
                  rounded-lg
                  border border-[#3a3a41]
                  bg-kiloblack
                  px-3 py-2
                  text-sm
                "
                name="shipping_status"
                id="shipping_status"
                value={formData.shipping_status}
                onChange={handleChange}
              >
                <option className="bg-gray-700" value="Pending">
                  Pending
                </option>
                <option className="bg-gray-700" value="Shipped">
                  Shipped
                </option>
                <option className="bg-gray-700" value="Delivered">
                  Delivered
                </option>
              </select>
            </div>

            <AdminInput
              label="Tracking Number"
              value={formData.tracking_number}
              onChange={(e) =>
                handleChange({
                  target: { name: "tracking_number", value: e.target.value },
                })
              }
              placeholder="Tracking Number"
            />

            <AdminInput
              label="Label URL"
              value={formData.label_url}
              onChange={(e) =>
                handleChange({
                  target: { name: "label_url", value: e.target.value },
                })
              }
              placeholder="Label URL"
            />

            <div>
              <label className="block mb-1 font-semibold text-kilotextlight">
                Estimated Delivery
              </label>

              <input
                className="
                  w-full
                  rounded-lg
                  border border-[#3a3a41]
                  bg-kiloblack
                  px-3 py-2
                  text-sm
                "
                type="date"
                name="estimated_delivery"
                value={formData.estimated_delivery}
                onChange={handleChange}
              />
            </div>
          </AdminFormSection>

          <div className="flex justify-center pt-4">
            <Button type="submit" variant="primary">
              Update Order
            </Button>
          </div>
        </fieldset>
      </form>
    </AdminForm>
  );
};

export default OrderForm;
