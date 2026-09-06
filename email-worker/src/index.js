import {WorkerEntrypoint} from 'cloudflare:workers';
import {createMimeMessage} from 'mimetext';
import {deliverAnonymousPageView} from './anonymousAnalytics.js';

const FROM = 'noreply@fewshotacademy.com';
const TO = 'contact@fewshotacademy.com';

export default class extends WorkerEntrypoint {
  async fetch() {
    return new Response('Not found', {status: 404});
  }

  async sendNotification(subject, lines) {
    const msg = createMimeMessage();
    msg.setSender({addr: FROM, name: 'Few-Shot Academy'});
    msg.setRecipient(TO);
    msg.setSubject(subject);
    msg.addMessage({contentType: 'text/plain', data: lines.join('\n')});

    const {EmailMessage} = await import('cloudflare:email');
    const email = new EmailMessage(FROM, TO, msg.asRaw());
    await this.env.SEND_EMAIL.send(email);
  }

  async queue(batch) {
    const apiSecret = this.env.GA4_MEASUREMENT_PROTOCOL_API_SECRET;
    if (!apiSecret) {
      throw new Error('GA4_MEASUREMENT_PROTOCOL_API_SECRET is not configured');
    }

    await Promise.all(
      batch.messages.map(async (message) => {
        const path = message.body?.path;
        if (typeof path !== 'string' || !path.startsWith('/')) {
          message.ack();
          return;
        }

        try {
          const response = await deliverAnonymousPageView(path, apiSecret);
          if (response.ok) {
            message.ack();
          } else {
            message.retry();
          }
        } catch {
          message.retry();
        }
      }),
    );
  }
}
