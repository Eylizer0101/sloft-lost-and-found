const emailTemplate = (userName, itemName, status, description) => {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    <!-- Header -->
    <div style="background-color: #1e40af; color: white; padding: 25px; text-align: center;">
      <h2 style="margin: 0;">S-LOFT Lost & Found Tracker</h2>
      <p style="margin: 5px 0 0; font-size: 14px; color: #dbeafe;">
        PHINMA Araullo University – College of Science and Digital Learning
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 25px; background-color: #ffffff;">
      <p style="font-size: 16px;">Hello <b>${userName || "Student"}</b>,</p>
      <p style="font-size: 15px; line-height: 1.6;">
        We would like to inform you that the status of your reported item has been updated in the
        <b>S-LOFT Lost & Found System</b>.
      </p>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="margin: 5px 0;"><b>📦 Item:</b> ${itemName}</p>
        <p style="margin: 5px 0;">
          <b>🔖 New Status:</b> 
          <span style="color: ${
            status === "Claimed" ? "#16a34a" : 
            status === "Pending" ? "#ca8a04" :
            status === "Found" ? "#0ea5e9" : "#2563eb"
          };">
            ${status}
          </span>
        </p>
        <p style="margin: 5px 0;"><b>📝 Description:</b> ${description || "No description available."}</p>
      </div>

      <p style="font-size: 15px; line-height: 1.6;">
        You may log in to your <b>S-LOFT account</b> to view further details or contact the CSDL Administrator for assistance.
      </p>

      <p style="font-size: 15px; margin-top: 20px;">Thank you for helping keep our campus organized and secure!</p>
      <p style="font-size: 15px; font-weight: bold; margin-top: 10px;">– S-LOFT Team, PHINMA AU – CSDL</p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
      <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
      <p style="margin: 2px 0;">© ${new Date().getFullYear()} PHINMA Araullo University | S-LOFT Lost & Found Tracker</p>
    </div>
  </div>
  `;
};

export default emailTemplate;
