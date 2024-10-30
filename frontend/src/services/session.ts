// TODO: create a pending queue for when socket connection isn't made on time
export class Session {
  private static _socket: WebSocket | null = null;
  private static _messageQueue = [];
  public static _history: Record<string, unknown>[] = [];
  private static _connecting = false;

  private static _disconnecting = false;
  private static _eventTarget = new EventTarget();

  public static restoreOrStartNewSession() {
    if (Session.isConnected()) {
      Session.disconnect();
    }
    Session._connect();
  }

  public static startNewSession() {
    Session.restoreOrStartNewSession();
  }

  static isConnected(): boolean {
    return (
      Session._socket !== null && Session._socket.readyState === WebSocket.OPEN
    );
  }

  static disconnect(): void {
    Session._disconnecting = true;
    if (Session._socket) {
      Session._socket.close();
    }
    Session._socket = null;
  }

  private static _connect(): void {
    if (Session.isConnected()) return;
    Session._connecting = true;
    let wsURL = "ws://localhost:3001/ws";
    Session._socket = new WebSocket(wsURL);
    Session._setupSocket();
  }

  static send = (message: string) => {
    if (Session.isConnected()) {
      Session._socket?.send(message);
      return true;
    } else {
      return false;
    }
  };

  private static _setupSocket(): void {
    if (!Session._socket) {
      throw new Error("no socket");
    }

    Session._socket.onmessage = (e) => {
      let data = null;
      try {
        data = JSON.parse(e.data);
        Session._history.push(data);

        if (data.finished) {
          const event = new CustomEvent("finished", {
            detail: { data },
          });
          Session._eventTarget.dispatchEvent(event);
        } else if (data.config) {
          const event = new CustomEvent("sessionConfig", {
            detail: { data },
          });
          Session._eventTarget.dispatchEvent(event);
        } else {
          const event = new CustomEvent("sessionMessage", {
            detail: { data },
          });

          Session._eventTarget.dispatchEvent(event);
        }
      } catch (err) {
        return;
      }
    };
  }

  public static addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ) {
    Session._eventTarget.addEventListener(type, listener);
  }

  public static removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ) {
    Session._eventTarget.removeEventListener(type, listener);
  }
}
