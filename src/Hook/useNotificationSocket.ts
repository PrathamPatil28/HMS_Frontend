import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default function useNotificationSocket(
    userId: string | number | null,
    onMessage: (msg: any) => void
) {
    const stompClient = useRef<any>(null);
    
    // Keep the latest callback in a ref to prevent infinite loops
    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!userId) return;

        const socket = new SockJS("http://localhost:9800/ws/notifications");
        const client = Stomp.over(socket);
        stompClient.current = client;
        
        // Optional: Enable debug to see incoming messages in console
        // client.debug = () => {}; 

        client.connect({}, () => {
            console.log(`✅ Connected to STOMP for User: ${userId}`);


             //error line 
            // const topicPath = `/user/${userId}/queue/notifications`

            //fixed line 
            const topicPath = `/topic/user/${userId}/notifications`;

            client.subscribe(topicPath, (message: any) => {
                console.log("🔔 Notification Received:", message.body);
                const data = JSON.parse(message.body);
                
                // Call the ref here
                if (onMessageRef.current) {
                    onMessageRef.current(data);
                }
            });
        }, (error: any) => {
            console.error("❌ STOMP Error:", error);
        });

        return () => {
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.disconnect(() => {
                   console.log("Disconnected");
                });
            }
        };

    }, [userId]); 

    return stompClient;
}