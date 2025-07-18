import nodemailer from 'nodemailer';
import { IUser } from '../models/user.model.js';
import { IBooking } from '../models/booking.model.js';
import { ISlot } from '../models/slot.model.js';
import { IService } from '../models/service.model.js';

interface BookingDetails {
  user: IUser;
  booking: IBooking;
  slot: ISlot;
  service: IService;
  provider: IUser;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure your email provider here
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });
  }

  async sendReminderEmail(bookingDetails: BookingDetails): Promise<boolean> {
    try {
      const { user, slot, service, provider } = bookingDetails;

      const appointmentDate = new Date(slot.startTime);
      const appointmentTime = appointmentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const appointmentDateStr = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      console.log(user.email, 'tooooooooooooo');

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `Reminder: Your appointment is in 30 minutes`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
              }
              .header { 
                background-color: #007bff; 
                color: white; 
                padding: 20px; 
                text-align: center; 
                border-radius: 8px 8px 0 0; 
              }
              .content { 
                background-color: #f8f9fa; 
                padding: 30px; 
                border-radius: 0 0 8px 8px; 
                border: 1px solid #dee2e6; 
              }
              .appointment-details { 
                background-color: white; 
                padding: 20px; 
                border-radius: 6px; 
                margin: 20px 0; 
                border-left: 4px solid #007bff; 
              }
              .detail-row { 
                margin: 10px 0; 
                padding: 8px 0; 
                border-bottom: 1px solid #eee; 
              }
              .label { 
                font-weight: bold; 
                color: #495057; 
                display: inline-block; 
                width: 120px; 
              }
              .value { 
                color: #212529; 
              }
              .footer { 
                text-align: center; 
                margin-top: 30px; 
                font-size: 14px; 
                color: #6c757d; 
              }
              .btn {
                display: inline-block;
                padding: 12px 24px;
                background-color: #28a745;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🕒 Appointment Reminder</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${user.firstName} ${user.lastName}</strong>,</p>
              
              <p>This is a friendly reminder that your appointment is coming up in <strong>30 minutes</strong>.</p>
              
              <div class="appointment-details">
                <h3>📅 Appointment Details</h3>
                <div class="detail-row">
                  <span class="label">Service:</span>
                  <span class="value">${service.title}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Provider:</span>
                  <span class="value">${provider.firstName} ${provider.lastName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span>
                  <span class="value">${appointmentDateStr}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Time:</span>
                  <span class="value">${appointmentTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Duration:</span>
                  <span class="value">${service.duration} minutes</span>
                </div>
              </div>
              
              <p><strong>Important reminders:</strong></p>
              <ul>
                <li>Please arrive 5-10 minutes early</li>
                <li>Bring any required documents or materials</li>
                <li>If you need to cancel or reschedule, please contact us as soon as possible</li>
              </ul>
              
              <p>We look forward to seeing you soon!</p>
              
              <div class="footer">
                <p>Best regards,<br>
                <strong>FinCart Team</strong></p>
                <p><small>This is an automated reminder. Please do not reply to this email.</small></p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          Appointment Reminder - 30 Minutes
          
          Hello ${user.firstName} ${user.lastName},
          
          This is a friendly reminder that your appointment is coming up in 30 minutes.
          
          Appointment Details:
          - Service: ${service.title}
          - Provider: ${provider.firstName} ${provider.lastName}
          - Date: ${appointmentDateStr}
          - Time: ${appointmentTime}
          - Duration: ${service.duration} minutes
          
          Important reminders:
          - Please arrive 5-10 minutes early
          - Bring any required documents or materials
          - If you need to cancel or reschedule, please contact us as soon as possible
          
          We look forward to seeing you soon!
          
          Best regards,
          FinCart Team
          
          This is an automated reminder. Please do not reply to this email.
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Reminder email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send reminder email:', error);
      return false;
    }
  }

  async testEmailConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready to send emails');
      return true;
    } catch (error) {
      console.log('err', error);
      console.error('Email service configuration error:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
