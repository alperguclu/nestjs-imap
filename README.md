# nestjs-imap

A NestJS module for interacting with IMAP servers using the `node-imap` package.

## Installation

To install the package, run:

```bash
npm install nestjs-imap
```

## Configuration

To use the `nestjs-imap` module, you need to import it into your NestJS module and provide the necessary IMAP configuration.

### Example Configuration

`import { Module } from '@nestjs/common';
import { ImapModule, ImapConfig } from 'nestjs-imap';

const imapConfig: ImapConfig = {
user: 'your-email@example.com',
password: 'your-password',
host: 'imap.example.com',
port: 993,
tls: true,
};

@Module({
imports: [ImapModule.forRoot(imapConfig)],
})
export class AppModule {}`

## Usage

You can use the `ImapService` to interact with your IMAP server. Here's an example of how to use the service:

### Example Service

`import { Injectable, OnModuleInit } from '@nestjs/common';
import { ImapService } from 'nestjs-imap';

@Injectable()
export class EmailService implements OnModuleInit {
constructor(private readonly imapService: ImapService) {}

async onModuleInit() {
this.imapService.connect();
this.imapService.on('ready', async () => {
await this.imapService.openBox('INBOX', true);
const messages = await this.imapService.getMessages(['UNSEEN'], { bodies: ['HEADER', 'TEXT'] });
console.log(messages);
});
}
}`

## API

### ImapService

#### Methods

- **connect()**: Connect to the IMAP server.
- **end()**: End the IMAP connection.
- **openBox(boxName: string, readOnly: boolean): Promise<void>**: Open a mailbox.
- **getMessages(criteria: any, fetchOptions: any): Promise<any[]>**: Get messages matching the criteria.
- **readMessage(uid: number): Promise<any>**: Read a specific message by UID.
- **on(event: string, callback: (...args: any[]) => void): void**: Listen for IMAP events.

## License

MIT
