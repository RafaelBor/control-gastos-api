import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
@Injectable()
export class MailService {

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async sendVerificationEmail(to: string, html: string, subject: string) {
    const msg = {
      to,
      from: 'soporte@miauhorros.com',
      subject: subject,
      html,
    };

    await sgMail.send(msg);
  }
}
