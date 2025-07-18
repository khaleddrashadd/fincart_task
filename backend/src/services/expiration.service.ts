import cron from 'node-cron';
import { Booking } from '../models/booking.model.js';
import { emailService } from './email.service.js';

class ReminderService {
  private isRunning = false;

  constructor() {
    this.initCronJob();
  }

  private initCronJob() {
    // Run every 10 minutes to check for appointments
    cron.schedule('*/10 * * * * *', async () => {
      if (this.isRunning) return;

      this.isRunning = true;
      try {
        await this.checkAndSendReminders();
      } catch (error) {
        console.error('Error in reminder service:', error);
      } finally {
        this.isRunning = false;
      }
    });

    console.log(
      '📧 Reminder service started - checking every 10 minutes for appointments'
    );
  }

  private async checkAndSendReminders() {
    try {
      // Calculate the time window for reminders (30 minutes from now)
      const now = new Date();
      const reminderTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
      const reminderWindowStart = new Date(now.getTime() - 60 * 1000); // 1 minute before
      const reminderWindowEnd = new Date(reminderTime.getTime() + 60 * 1000); // 1 minute after

      // Find confirmed bookings that:
      // 1. Have appointments starting in ~30 minutes
      // 2. Haven't had reminder emails sent yet
      const bookingsNeedingReminders = await Booking.find({
        status: 'confirmed',
        reminderSent: false,
      }).populate('slotId userId');

      if (bookingsNeedingReminders.length === 0) {
        return;
      }

      console.log(
        `📋 Found ${bookingsNeedingReminders.length} bookings to check for reminders`
      );

      for (const booking of bookingsNeedingReminders) {
        if (!booking.slotId || !booking.userId) {
          console.warn(`⚠️ Booking ${booking._id} missing slot or user data`);
          continue;
        }
        const slot = booking.slotId as any;
        const slotStartTime = new Date(slot.startTime);

        // Check if the appointment is in the 30-minute reminder window
        // Only send reminders for appointments that are in the future and within the reminder window
        const inWindow =
          slotStartTime > now &&
          slotStartTime >= reminderWindowStart &&
          slotStartTime <= reminderWindowEnd;
        console.log(
          `Slot time: ${slotStartTime.toISOString()}, Now: ${now.toISOString()}, Window: [${reminderWindowStart.toISOString()} - ${reminderWindowEnd.toISOString()}], In window: ${inWindow}`
        );
        if (inWindow) {
          await this.sendReminderForBooking(booking);
        }
      }
    } catch (error) {
      console.error('Error checking for reminders:', error);
    }
  }

  private async sendReminderForBooking(booking: any) {
    try {
      // Fetch complete booking details with all related data
      const completeBooking = await Booking.findById(booking._id)
        .populate({
          path: 'slotId',
          populate: [
            {
              path: 'serviceId',
              model: 'Service',
            },
            {
              path: 'providerId',
              model: 'User',
            },
          ],
        })
        .populate('userId');

      if (
        !completeBooking ||
        !completeBooking.slotId ||
        !completeBooking.userId
      ) {
        console.warn(
          `⚠️ Could not fetch complete data for booking ${booking._id}`
        );
        return;
      }

      const slot = completeBooking.slotId as any;
      const user = completeBooking.userId as any;
      const service = slot.serviceId;
      const provider = slot.providerId;

      if (!service || !provider) {
        console.warn(
          `⚠️ Missing service or provider data for booking ${booking._id}`
        );
        return;
      }

      const bookingDetails = {
        user,
        booking: completeBooking,
        slot,
        service,
        provider,
      };

      // Send the reminder email
      const emailSent = await emailService.sendReminderEmail(bookingDetails);

      if (emailSent) {
        // Mark the reminder as sent
        await Booking.findByIdAndUpdate(booking._id, {
          reminderSent: true,
          reminderSentAt: new Date(),
        });

        const appointmentTime = new Date(slot.startTime).toLocaleString();
        console.log(
          `✅ Reminder email sent for booking ${booking._id} - Appointment at ${appointmentTime}`
        );
      } else {
        console.error(
          `❌ Failed to send reminder email for booking ${booking._id}`
        );
      }
    } catch (error) {
      console.error(
        `Error sending reminder for booking ${booking._id}:`,
        error
      );
    }
  }

  // Method to manually trigger reminder check (useful for testing)
  async triggerReminderCheck() {
    if (this.isRunning) {
      console.log('Reminder service is already running');
      return;
    }

    console.log('🔄 Manually triggering reminder check...');
    await this.checkAndSendReminders();
  }

  // Method to test email service
  async testEmailService() {
    console.log('🧪 Testing email service connection...');
    const isReady = await emailService.testEmailConnection();

    if (isReady) {
      console.log('✅ Email service is configured and ready');
    } else {
      console.log('❌ Email service configuration issue');
    }

    return isReady;
  }
}

export const reminderService = new ReminderService();
