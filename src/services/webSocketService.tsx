import { Client, IMessage } from '@stomp/stompjs';
import { Dispatch, SetStateAction } from 'react';
import SockJS from 'sockjs-client';

type Notification = {
  content: string;
};

class WebSocketService {
  client: Client;
  isConnected: boolean = false;
  notifications: Notification[] = [];
  setNotifications: Dispatch<SetStateAction<Notification[]>> | null = null;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_WS_ENDPOINT as string),
      debug: (str) => {
        console.log(str);
      },
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        this.isConnected = true;
        this.subscribeToTopics();
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        this.isConnected = false;
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      }
    });
  }

  connect() {
    this.client.activate();
  }

  disconnect() {
    this.client.deactivate();
  }

  sendMessage(destination: string, body: unknown) {
    this.client.publish({ destination, body: JSON.stringify(body) });
  }

  ensureConnected(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(reject);
      if (this.isConnected) {
        resolve();
      } else {
        const checkConnectionInterval = setInterval(() => {
          if (this.isConnected) {
            clearInterval(checkConnectionInterval);
            resolve();
          }
        }, 100);
      }
    });
  }
  // eslint-disable-next-line no-unused-vars
  async subscribe(destination: string, callback: (message: IMessage) => void) {
    await this.ensureConnected();
    this.client.subscribe(destination, callback);
  }

  subscribeToTopics() {
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    this.subscribe('/topic/global-notifications', (message: IMessage) => {
      const content = JSON.parse(message.body).content;
      console.log('Global Notification:', content);
      this.notifications.push(content);
      if (this.setNotifications) {
        this.setNotifications([...this.notifications]);
      }
    });

    this.subscribe('/user/topic/private-notifications', (message: IMessage) => {
      const content = JSON.parse(message.body).content;
      console.log('Private Notification:', content);
      this.notifications.push(content);
      if (this.setNotifications) {
        this.setNotifications([...this.notifications]);
      }
    });
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
