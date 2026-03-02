import { BackgroundEmailSendingService } from "@application/ports/services/EmailSendingService";

export class MockBackgroundEmailSendingService implements BackgroundEmailSendingService {
  async addToQueue(params: {
    to: string;
    subject: string;
    htmlBody?: string;
    textBody?: string;
  }): Promise<void> {
    // Does nothing,
    // It simulates adding an email to a queue where a background worker would send it out.
  }
}
