package websocket.chat;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Queue;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import util.HTMLFilter;

@ServerEndpoint(value = "/websocket/chat")
public class ChatAnnotation {

    private static final String GUEST_PREFIX = "Guest";
    private static final AtomicInteger connectionIds = new AtomicInteger(0);
    private static final Set<ChatAnnotation> connections = new CopyOnWriteArraySet<>();

    private final String nickname;
    private Session session;

    private Queue<String> messageBacklog = new ArrayDeque<>();
    private boolean messageInProgress = false;

    public ChatAnnotation() {
        nickname = GUEST_PREFIX + connectionIds.getAndIncrement();
    }

    @OnOpen
    public void start(Session session) {
        this.session = session;
        connections.add(this);
        String message = String.format("* %s has joined.", nickname);
        broadcast(message);
    }

    @OnClose
    public void end() {
        connections.remove(this);
        String message = String.format("* %s has disconnected.", nickname);
        broadcast(message);
    }

    @OnMessage
    public void incoming(String message) {
        String filteredMessage = String.format("%s: %s", nickname, HTMLFilter.filter(message));
        broadcast(filteredMessage);
    }

    @OnError
    public void onError(Throwable t) {
        System.err.println("Chat Error: " + t.getMessage());
        t.printStackTrace();
    }

    private void sendMessage(String msg) throws IOException {
        synchronized (this) {
            if (messageInProgress) {
                messageBacklog.add(msg);
                return;
            } else {
                messageInProgress = true;
            }
        }

        boolean hasMoreMessages = true;
        String messageToSend = msg;

        do {
            session.getBasicRemote().sendText(messageToSend);
            synchronized (this) {
                messageToSend = messageBacklog.poll();
                if (messageToSend == null) {
                    messageInProgress = false;
                    hasMoreMessages = false;
                }
            }
        } while (hasMoreMessages);
    }

    private static void broadcast(String msg) {
        for (ChatAnnotation client : connections) {
            try {
                client.sendMessage(msg);
            } catch (IOException e) {
                connections.remove(client);
                try {
                    client.session.close();
                } catch (IOException e1) {
                    // Ignore
                }
                String message = String.format("* %s has been disconnected.", client.nickname);
                broadcast(message);
            }
        }
    }
}
