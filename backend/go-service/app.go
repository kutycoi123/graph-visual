package main
import (
	"encoding/json"
	"fmt"
	"sort"
	zmq "github.com/pebbe/zmq4"
)

type Node struct {
	Id int32 `json:"id"`
	Neighbors []int32 `json:"neighbors"`
	Parent int32 `json:"parent"`
	Status string `json:"status"`
}
type Edge struct {
	From int32 `json:"from"`
	To int32 `json:"to"`
	Weight int64 `json:"weight"`
	Selected bool `json:"selected"`
}

type Graph struct {
	Nodes []Node `json:"nodes"`
	Edges []Edge `json:"edges"`
	StartNode Node `json:"startNode"`
}

type Request struct {
	Graph Graph `json:"graph"`
	Algo string `json:"algo"`
}

func (n Node) String() string {
	return fmt.Sprintf("{id:%v neighbors:%v}", n.Id, n.Neighbors)
}

func (n Graph) String() string {
	return fmt.Sprintf("{nodes:%v startNode:%v edges: %v}", n.Nodes, n.StartNode, n.Edges)
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
func (g Graph) Get_edge(from int32, to int32) Edge {
	for _,edge := range g.Edges {
		if edge.From == from && edge.To == to {
			return edge
		}
	}
	return Edge{}
}
func (g Graph) Bfs() []Node{
	var trace []Node
	visited := make(map[int32]bool)
	var cur Node
	queue := []Node{Node{g.StartNode.Id, g.StartNode.Neighbors, -1, ""}}	
	for len(queue) > 0 {
		cur, queue = queue[0], queue[1:]
		if _,ok := visited[cur.Id]; !ok {
			visited[cur.Id] = true
			trace = append(trace, cur)
		}
		for _, id := range cur.Neighbors {
			if _,ok := visited[id]; !ok {
				queue = append(queue, Node{id, g.Get_neighbors(id), cur.Id, ""})
			}
		}
	}
	return trace
}
func (g Graph) Dfs() []Node{
	var trace []Node
	visited := make(map[int32]bool)
	var cur Node
	queue := []Node{Node{g.StartNode.Id, g.StartNode.Neighbors, -1, ""}}	
	for len(queue) > 0 {
		cur, queue = queue[len(queue)-1], queue[:len(queue)-1]
		if _,ok := visited[cur.Id]; !ok {
			visited[cur.Id] = true
			trace = append(trace, cur)
		}
		for _, id := range cur.Neighbors {
			if _,ok := visited[id]; !ok {
				queue = append(queue, Node{id, g.Get_neighbors(id), cur.Id, ""})
			}
		}
	}
	return trace
}

/* Graph Coloring - Brute force */
type GraphColoring struct {
	Graph map[int32][]int32
	Variables []int32
	Domains []int32 // colors
	Curr_domains map[int32][]int32 //current domains
}

func NewGraphColoring(g Graph, nColors int32) GraphColoring {
	var graph_coloring GraphColoring
	nNodes := int32(len(g.Nodes))
	graph_coloring.Variables = make([]int32, nNodes)
	graph_coloring.Domains = make([]int32, nColors)
	graph_coloring.Curr_domains = make(map[int32][]int32)
	graph_coloring.Graph = make(map[int32][]int32)
	for i:=int32(0);i<nNodes;i++{
		node := g.Nodes[i]
		graph_coloring.Variables[i] = i
		graph_coloring.Graph[node.Id] = make([]int32, len(node.Neighbors))
		copy(graph_coloring.Graph[node.Id], node.Neighbors)
	}
	for i:=int32(0);i<nColors;i++{
		graph_coloring.Domains[i] = i
	}
	for _, variable := range graph_coloring.Variables {
		graph_coloring.Curr_domains[variable] = make([]int32, len(graph_coloring.Domains))
		copy(graph_coloring.Curr_domains[variable], graph_coloring.Domains)
	}
	return graph_coloring

}
func (g GraphColoring) assign(variable, value int32, assignment map[int32]int32) {
	assignment[variable] = value
}
func (g GraphColoring) unassign(variable int32, assignment map[int32]int32) {
	if _,ok := assignment[variable];ok {
		delete(assignment, variable)
	}
}
func (g GraphColoring) nConflicts(variable, value int32, assignment map[int32]int32) int32{
	conflicted := int32(0)
	for _,neighbor := range g.Graph[variable] {
		if _,ok := assignment[neighbor]; ok && assignment[neighbor] == value {
			conflicted++
		}
	}
	return conflicted
}
func (g GraphColoring) isConflicted(variable, value int32, assignment map[int32]int32) bool {
	return g.nConflicts(variable, value, assignment) > 0
}
func (g GraphColoring) isSatisfied(assignment map[int32]int32) bool {
	// Copy map
	copied := make(map[int32]int32)
	for key,value := range assignment {
		copied[key] = value
	}
	conficted := true
	for _,variable := range g.Variables {
		if g.isConflicted(variable, copied[variable], copied){
			conficted = false
			break
		}
	}
	return len(copied) == len(g.Variables) && conficted
}
func (g *GraphColoring) suppose(variable, value int32) [][2]int32 {
	var removals [][2]int32
	for _,val := range g.Curr_domains[variable] {
		if val != value {
			var tmp [2]int32
			tmp[0] = variable
			tmp[1] = val
			removals = append(removals, tmp)
		}
	}
	g.Curr_domains[variable] = make([]int32, 1)
	g.Curr_domains[variable][0] = value
	return removals
}
func (g *GraphColoring) prune(variable, value int32, removals [][2]int32) [][2]int32 {
	index := -1
	for i,val := range g.Curr_domains[variable] {
		if val == value {
			index = i
			break
		}
	}
	if index != -1 && len(removals) > 0{
		copy(g.Curr_domains[variable][index:], g.Curr_domains[variable][index+1:])
		g.Curr_domains[variable] = g.Curr_domains[variable][:len(g.Curr_domains[variable])-1]
		var tmp [2]int32
		tmp[0] = variable
		tmp[1] = value
		removals = append(removals, tmp)
	}
	return removals

}
func (g *GraphColoring) restore(removals [][2]int32) {
	//l := len(removals)
	for _,pair := range removals {
		g.Curr_domains[pair[0]] = append(g.Curr_domains[pair[0]], pair[1])
	}
}
func (g GraphColoring) num_legal_assignments(variable int32, assignment map[int32]int32) int {
	return len(g.Curr_domains[variable])
}
func (g GraphColoring) fst_unassigned_var(assignment map[int32]int32) int32 {
	for _,variable := range g.Variables {
		if _,ok := assignment[variable];!ok {
			return variable
		}
	}
	return -1
}
func (g *GraphColoring) forward_checking_inference(variable, value int32, assignment map[int32]int32, removals [][2]int32) bool {
	for _,neighbor := range g.Graph[variable] {
		if _,ok := assignment[neighbor];!ok {
			copiedNeighbors := make([]int32, len(g.Curr_domains[neighbor]))
			copy(copiedNeighbors, g.Curr_domains[neighbor])
			for _,val := range copiedNeighbors {
				if val == value {
					g.prune(neighbor, val, removals)
				}
			}
			if len(g.Curr_domains[neighbor]) == 0 {
				return false
			}
		}
	}
	return true
}
func (g *GraphColoring) bt(assignment map[int32]int32) map[int32]int32 {
	if len(assignment) == len(g.Variables) {
		return assignment
	}
	variable := g.fst_unassigned_var(assignment)
	for _,value := range g.Curr_domains[variable] {
		if !g.isConflicted(variable, value, assignment) {
			g.assign(variable, value, assignment)
			removals := g.suppose(variable, value)
			if g.forward_checking_inference(variable, value, assignment, removals) {
				res := g.bt(assignment)
				if len(res) != 0 {
					return res
				}
			}
			g.restore(removals)
		}
	}
	g.unassign(variable, assignment)
	return map[int32]int32{}

}
func (g *GraphColoring) backtrack_search() map[int32]int32{
	assignment := make(map[int32]int32)
	solution := g.bt(assignment)
	if len(solution) > 0 && g.isSatisfied(solution) {
		return solution
	}
	return map[int32]int32{}
}

/* END Graph Coloring */	

/* Dijkstra algorithm*/
func minDist(dist map[int32]int64, sptSet map[int32]bool) int32 {
	var minDist int64 = 1 << 63 - 1 //maximum int64	
	var minNode int32 = -1
	for node,d := range dist {
		if d < minDist && sptSet[node] == false {
			minDist = d
			minNode = node
		}
	}
	return minNode
}

func (graph Graph) dijkstra() []Node{
	trace := make([]Node, 0)
	dist := make(map[int32]int64) //dist map
	parent := make(map[int32]int32) // parent map
	sptSet := make(map[int32]bool) //visited node map
	var maxsize int64 = 1 << 63 - 1 //maximum int64

	// Init dist map and parent map
	for _,node := range graph.Nodes {
		dist[node.Id] = maxsize
		parent[node.Id] = -1
		sptSet[node.Id] = false
	}
	dist[graph.StartNode.Id] = 0
	for i:=0;i<len(graph.Edges);i++ {
		u := minDist(dist, sptSet)
		if u == -1 {
			break
		}
		par := parent[u]
		trace = append(trace, Node{u,[]int32{},par,"visited"})
		sptSet[u] = true
		for _,neighbor := range graph.Get_neighbors(u) {
			trace = append(trace, Node{neighbor, []int32{}, u, "visiting"})
			edge := graph.Get_edge(u, neighbor)
			if !sptSet[neighbor] && dist[neighbor] > dist[u] + edge.Weight {
				dist[neighbor] = dist[u] + edge.Weight
				parent[neighbor] = u
			}
		}
	}
	return trace

}
/*END Dijsktra*/
/* Minimum Spanning Tree - Kruskal algorithm*/
type MSTNode struct {
	id int32
	rank int64
	parent *MSTNode
}
func NewMSTNode(id int32, rank int64) MSTNode {
	node := MSTNode{}
	node.id = id
	node.rank = rank
	node.parent = &node
	return node
}
func (n *MSTNode) find() *MSTNode{
	if n.parent != n {
		n.parent = n.parent.find()
	}
	return n.parent
}
func (x *MSTNode) union(y *MSTNode) {
	xRoot := x.find()
	yRoot := y.find()
	if xRoot != yRoot {
		if xRoot.rank < yRoot.rank {
			xRoot, yRoot = yRoot, xRoot
		}
		yRoot.parent = xRoot
		if xRoot.rank == yRoot.rank {
			xRoot.rank = xRoot.rank + 1
		}
	}
}
func (g Graph) Mst() []Edge {
	edges := make([]Edge, 0)
	sort.SliceStable(g.Edges, func(i, j int) bool {
		return g.Edges[i].Weight < g.Edges[j].Weight
	})
	for i:=0;i<len(g.Edges);i++{
		check := true
		for j:=0;j<i;j++{
			if g.Edges[j].To == g.Edges[i].From && g.Edges[j].From == g.Edges[i].To {
				check = false
				break
			}
		}
		if check {
			edges = append(edges, g.Edges[i])
		}
	}
	nodes := make(map[int32]MSTNode)
	for _,node := range g.Nodes {
		nodes[node.Id] = NewMSTNode(node.Id, 1)
	}
	l := len(g.Nodes) - 1
	mst := make([]Edge, 0)
	i := 0
	for i < l && len(edges) > 0{
		minEdge := edges[0]
		edges = edges[1:]
		fromNode := nodes[minEdge.From]
		toNode := nodes[minEdge.To]
		fromNodeRoot := fromNode.find()
		toNodeRoot := toNode.find()
		if fromNodeRoot != toNodeRoot {
			minEdge.Selected = true			
			mst = append(mst, minEdge)
			i++
			fromNode.union(&toNode)
		}else {
			minEdge.Selected = false
			mst = append(mst, minEdge)
		}
	}
	return mst

}
/*END MST*/
func main() {
	replier, _ := zmq.NewSocket(zmq.REP)
	defer replier.Close()
	replier.Bind("tcp://*:5555")
	for {
		request, _ := replier.RecvBytes(0)
		var message Request
		fmt.Println("Receiving messages")
		json.Unmarshal(request, &message)
		fmt.Printf("%v\n", message)
		if message.Algo == "bfs" {
			trace := message.Graph.Bfs()
			response, _ := json.Marshal(trace)
			replier.SendBytes(response, 0)
			fmt.Printf("Finish sending response")
		} else if message.Algo == "dfs" {
			trace := message.Graph.Dfs()
			response, _ := json.Marshal(trace)
			replier.SendBytes(response, 0)
			fmt.Printf("Finish sending response")			
		} else if message.Algo == "coloring" {
			var solution map[int32]int32
			for nColors:=0;nColors<len(message.Graph.Nodes)+1;nColors++{
				graph_coloring := NewGraphColoring(message.Graph, int32(nColors)); //TODO: Bruteforce number of colors		
				solution = graph_coloring.backtrack_search()
				if len(solution) > 0 {
					break
				}
			}
			response, _ := json.Marshal(solution)
			fmt.Printf("%v\n", solution)
			replier.SendBytes(response, 0)
			fmt.Printf("Finish sending response")
		} else if message.Algo == "dijkstra" {
			trace := message.Graph.dijkstra()
			response, _ := json.Marshal(trace)
			replier.SendBytes(response, 0)
			fmt.Printf("Finish sending response")
		} else if message.Algo == "mst" {
			mst := message.Graph.Mst()
			response, _ := json.Marshal(mst)
			replier.SendBytes(response, 0)
			fmt.Printf("Finish sending response")
		}
	}
}