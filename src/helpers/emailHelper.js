// src/helpers/emailHelper.js

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  secure: false,
});

export const sendVerificationEmail = async (to, token) => {
  const link = `${process.env.CLIENT_URL}/verify/${token}`;
  await transporter.sendMail({
    from: `"Admin Portal" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your admin account",
    html: `<p>Please click <a href="${link}">here</a> to verify your email.</p>`,
  });
};

/**
 * Notify a user when their order status changes.
 *
 * @param {Object} params
 * @param {string} params.to      – recipient’s email
 * @param {string} params.orderId – the order’s Mongo ID
 * @param {string} params.status  – new status string
 * @param {string} params.name    – user's first name
 */

export const sendOrderStatusEmail = async ({ to, orderId, status, name }) => {
  await transporter.sendMail({
    from: `"Admin Portal" <${process.env.SMTP_USER}>`,
    to,
    subject: `Order #${orderId} status updated`,
    html: `
      <p>Hi ${name},</p>
      <p>Your order <strong>#${orderId}</strong> is now <em>${status}</em>.</p>
      <p>Thanks for shopping with us!</p>
    `,
  });
};
