package TopicSubscription.Configuration;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class SocketController {
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;
	
   @MessageMapping("/{topicname}")
    public void greeting(@DestinationVariable("topicname") String topic, MyMessage q) throws Exception {
        Thread.sleep(1000); // simulated delay
        System.out.println("in greeting"+topic);
        simpMessagingTemplate.convertAndSend("/topic/"+topic, q);
    } 
    
    @MessageMapping("/personalMsg")
	public void greeting(MyMessage msg) {
		String sender = msg.getFrom();
		String content = msg.getContent();
		String receiver = msg.getTo();
		System.out.println(sender+" "+content+" "+receiver);
		simpMessagingTemplate.convertAndSendToUser(receiver, "/queue/reply", msg);
		}

}