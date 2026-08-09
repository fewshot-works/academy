import {WorkerEntrypoint} from 'cloudflare:workers';
import {createMimeMessage} from 'mimetext';

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
}
