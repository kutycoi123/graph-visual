package main
import (
	"encoding/json"
	"fmt"
	zmq "github.com/pebbe/zmq4"
)

func main() {
	replier, _ := zmq.NewSocket(zmq.REP)
	defer replier.Close()
	replier.Bind("tcp://*:5555")
	for {
		request, _ := replier.RecvBytes(0)
		var message map[string]string
		json.Unmarshal(request, &message)
		reply, _ := json.Marshal(map[string]int{"length": len(message["string"])})
		// fmt.Println("Reply: %v", reply)
		replier.SendBytes(reply, 0)
		fmt.Println("Finish send reply")
	}
}