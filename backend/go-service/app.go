package main
import (
	"encoding/json"
	"fmt"
	zmq "github.com/pebbe/zmq4"
)
type Node struct {
	Id int32 `json:"id"`
	Neighbors []int32 `json:"neighbors"`
	Parent int32 `json:"parent"`
}
func (n Node) String() string {
	return fmt.Sprintf("{id:%v neighbors:%v}", n.Id, n.Neighbors)
}
type Graph struct {
	Nodes []Node `json:"nodes"`
	StartNode Node `json:"startNode"`
}
func (n Graph) String() string {
	return fmt.Sprintf("{nodes:%v startNode:%v}", n.Nodes, n.StartNode)
}
type Request struct {
	Graph Graph `json:"graph"`
	Algo string `json:"algo"`
}
func (n Request) String() string {
	return fmt.Sprintf("{graph:%v algo:%v}", n.Graph, n.Algo)
}

func (g Graph) Get_neighbors(id int32) []int32 {
	for _,node := range g.Nodes {
		if node.Id == id {
			return node.Neighbors
		}
	}
	return []int32{}
}
func (g Graph) Bfs() []Node{
	var trace []Node
	visited := make(map[int32]bool)
	var cur Node
	queue := []Node{Node{g.StartNode.Id, g.StartNode.Neighbors, -1}}	
	for len(queue) > 0 {
		cur, queue = queue[0], queue[1:]
		if _,ok := visited[cur.Id]; !ok {
			visited[cur.Id] = true
			trace = append(trace, cur)
		}
		for _, id := range cur.Neighbors {
			if _,ok := visited[id]; !ok {
				queue = append(queue, Node{id, g.Get_neighbors(id), cur.Id})
			}
		}
	}
	return trace
}
func (g Graph) Dfs() []Node{
	var trace []Node
	visited := make(map[int32]bool)
	var cur Node
	queue := []Node{Node{g.StartNode.Id, g.StartNode.Neighbors, -1}}	
	for len(queue) > 0 {
		cur, queue = queue[len(queue)-1], queue[:len(queue)-1]
		if _,ok := visited[cur.Id]; !ok {
			visited[cur.Id] = true
			trace = append(trace, cur)
		}
		for _, id := range cur.Neighbors {
			if _,ok := visited[id]; !ok {
				queue = append(queue, Node{id, g.Get_neighbors(id), cur.Id})
			}
		}
	}
	return trace
}

func main() {
	replier, _ := zmq.NewSocket(zmq.REP)
	defer replier.Close()
	replier.Bind("tcp://*:5555")
	for {
		request, _ := replier.RecvBytes(0)
		var message Request
		json.Unmarshal(request, &message)
		fmt.Printf("%v\n", message)
		if message.Algo == "bfs" {
			trace := message.Graph.Bfs()
			fmt.Printf("Bfs trace: %v\n", trace)
			response, _ := json.Marshal(trace)
			replier.SendBytes(response, 0)
			fmt.Printf("Finish sending response")
		} else if message.Algo == "dfs" {
			trace := message.Graph.Dfs()
			fmt.Printf("Dfs trace: %v\n", trace)
			response, _ := json.Marshal(trace)
			replier.SendBytes(response, 0)
			fmt.Printf("Finish sending response")			
		}
	}
}