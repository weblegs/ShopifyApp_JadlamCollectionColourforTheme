import { useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const colors = await prisma.categoryDetail.findMany({ orderBy: { id: "asc" } });
  return { colors };
};

export const action = async ({ request }) => {
  await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    await prisma.categoryDetail.create({
      data: {
        mainCategory: formData.get("mainCategory"),
        primaryColor: formData.get("primaryColor"),
        secondaryColor: formData.get("secondaryColor"),
        headerColor: formData.get("headerColor"),
      },
    });
  } else if (intent === "update") {
    await prisma.categoryDetail.update({
      where: { id: Number(formData.get("id")) },
      data: {
        mainCategory: formData.get("mainCategory"),
        primaryColor: formData.get("primaryColor"),
        secondaryColor: formData.get("secondaryColor"),
        headerColor: formData.get("headerColor"),
      },
    });
  } else if (intent === "delete") {
    await prisma.categoryDetail.delete({
      where: { id: Number(formData.get("id")) },
    });
  }

  return null;
};

export default function CollectionsColors() {
  const { colors } = useLoaderData();
  const fetcher = useFetcher();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [mainCategory, setMainCategory] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [headerColor, setHeaderColor] = useState("");

  const isSubmitting = fetcher.state !== "idle";

  const handleEdit = (item) => {
    setEditingItem(item);
    setMainCategory(item.mainCategory);
    setPrimaryColor(item.primaryColor);
    setSecondaryColor(item.secondaryColor);
    setHeaderColor(item.headerColor);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingItem(null);
    setMainCategory("");
    setPrimaryColor("");
    setSecondaryColor("");
    setHeaderColor("");
  };

  const handleDelete = (id) => {
    fetcher.submit({ intent: "delete", id: String(id) }, { method: "POST" });
  };

  const handleSave = () => {
    const data = {
      intent: editingItem ? "update" : "create",
      mainCategory,
      primaryColor,
      secondaryColor,
      headerColor,
    };
    if (editingItem) data.id = String(editingItem.id);
    fetcher.submit(data, { method: "POST" });
    handleCancel();
  };

  return (
    <s-page heading="Collections Colors">
      <s-section heading="Color Configuration">
        {!isFormVisible ? (
          <s-button onClick={() => setIsFormVisible(true)}>Add Color</s-button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <s-text-field
              label="Category Name"
              value={mainCategory}
              placeholder="Enter category name"
              onInput={(e) => setMainCategory(e.target.value)}
            />
            <s-text-field
              label="Primary Color"
              value={primaryColor}
              placeholder="#FFFFFF"
              onInput={(e) => setPrimaryColor(e.target.value)}
            />
            <s-text-field
              label="Font Color"
              value={secondaryColor}
              placeholder="#FFFFFF"
              onInput={(e) => setSecondaryColor(e.target.value)}
            />
            <s-text-field
              label="Header Color"
              value={headerColor}
              placeholder="#FFFFFF"
              onInput={(e) => setHeaderColor(e.target.value)}
            />
            <s-stack direction="inline" gap="base">
              <s-button
                variant="primary"
                onClick={handleSave}
                {...(isSubmitting ? { loading: true } : {})}
              >
                {editingItem ? "Update Color" : "Save Color"}
              </s-button>
              <s-button onClick={handleCancel}>Cancel</s-button>
            </s-stack>
          </div>
        )}
      </s-section>

      <s-section heading="Saved Colors">
        {colors.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px" }}>Category</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Primary</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Font</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Header</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {colors.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: "8px" }}>{item.mainCategory}</td>
                  <td style={{ padding: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div
                        style={{
                          backgroundColor: item.primaryColor,
                          width: "24px",
                          height: "24px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      />
                      {item.primaryColor}
                    </div>
                  </td>
                  <td style={{ padding: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div
                        style={{
                          backgroundColor: item.secondaryColor || "#000000",
                          width: "24px",
                          height: "24px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      />
                      {item.secondaryColor}
                    </div>
                  </td>
                  <td style={{ padding: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div
                        style={{
                          backgroundColor: item.headerColor || "#000000",
                          width: "24px",
                          height: "24px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      />
                      {item.headerColor}
                    </div>
                  </td>
                  <td style={{ padding: "8px" }}>
                    <s-stack direction="inline" gap="tight">
                      <s-button onClick={() => handleEdit(item)}>Edit</s-button>
                      <s-button
                        variant="critical"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </s-button>
                    </s-stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <s-paragraph>No colors added yet.</s-paragraph>
        )}
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
