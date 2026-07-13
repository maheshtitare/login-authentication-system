package com.mahesh.login_auth_api.service;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.mail.from-name}")
    private String fromName;

    public void sendOtpEmail(String toEmail, String fullName, String otp, int expiryMinutes) {

        try {

            System.out.println("Preparing OTP email...");

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, fromName);
            helper.setTo(toEmail);
            helper.setSubject("Your OTP Code");
            helper.setText(buildHtmlBody(fullName, otp, expiryMinutes), true);

            System.out.println("Sending email to : " + toEmail);

            mailSender.send(message);

            System.out.println("Email sent successfully.");

        } catch (MessagingException | UnsupportedEncodingException e) {

            System.out.println("Email preparation failed.");
            e.printStackTrace();

            throw new RuntimeException("Failed to prepare OTP email.", e);

        } catch (MailException e) {

            System.out.println("SMTP mail sending failed.");
            e.printStackTrace();

            throw new RuntimeException("Failed to send OTP email.", e);

        } catch (Exception e) {

            System.out.println("Unexpected error while sending email.");
            e.printStackTrace();

            throw new RuntimeException("Unexpected error while sending OTP email.", e);
        }
    }

    private String buildHtmlBody(String fullName, String otp, int expiryMinutes) {

        String safeName = (fullName == null || fullName.trim().isEmpty())
                ? "User"
                : fullName;

        return ""
                + "<div style=\"font-family:Arial,sans-serif;background:#f4f6f9;padding:32px;\">"
                + "<div style=\"max-width:480px;margin:auto;background:#ffffff;border-radius:12px;padding:32px;"
                + "box-shadow:0 4px 20px rgba(0,0,0,0.06);\">"

                + "<h2 style=\"color:#0d6efd;\">Password Reset OTP</h2>"

                + "<p>Hello " + safeName + ",</p>"

                + "<p>Use the OTP below to reset your password.</p>"

                + "<div style=\"text-align:center;margin:24px 0;\">"

                + "<span style=\"display:inline-block;"
                + "background:#0d6efd;"
                + "color:#ffffff;"
                + "font-size:28px;"
                + "font-weight:bold;"
                + "letter-spacing:8px;"
                + "padding:14px 26px;"
                + "border-radius:8px;\">"

                + otp +

                "</span>"

                + "</div>"

                + "<p>This OTP is valid for <b>"
                + expiryMinutes
                + " minutes</b>.</p>"

                + "<p>If you did not request this password reset, please ignore this email.</p>"

                + "</div>"
                + "</div>";
    }
}