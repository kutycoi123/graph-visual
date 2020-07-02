class Algorithm:
    def __init__(self, name):
        self.name = name

class GraphAlgorithm(Algorithm):
    def __init__(self, name, nodes):
        super().__init__(name)
        self.nodes = nodes
        self.nodeDict = {}
        for node in self.nodes:
            self.nodeDict[node["id"]] = node
        #self.edges = edges
    def getNeighbors(self, nodeId):
        return self.nodeDict.get(nodeId)["neighbors"]
    def run(self):
        pass
    
class BFS(GraphAlgorithm):
    def __init__(self, nodes, start, end):
        super().__init__('bfs',nodes)
        self.start = start
        self.end = end
    def bfs(self):
        trace = []
        visited = {}
        queue = [{"parent": None, "id": self.start["id"]}]
        while queue:
            cur = queue.pop(0)
            if not visited.get(cur["id"]):
                visited[cur["id"]] = True
                trace.append(cur)
            if self.end != None and cur == self.end._id:
                break
            unvisited = list(filter(lambda n: not visited.get(n), self.getNeighbors(cur["id"])))
            unvisited = list(map(lambda n: {"parent":cur["id"], "id": n},unvisited))
            queue = queue + unvisited
        return trace
    def run(self):
        return self.bfs()

class DFS(GraphAlgorithm):
    def __init__(self, nodes, start, end):
        super().__init__('dfs',nodes)
        self.start = start
        self.end = end
    def dfs(self):
        trace = []
        visited = {}
        queue = [{"parent": None, "id": self.start["id"]}]
        while queue:
            cur = queue.pop()
            if not visited.get(cur["id"]):
                visited[cur["id"]] = True
                trace.append(cur)
            if self.end != None and cur == self.end._id:
                break
            unvisited = list(filter(lambda n: not visited.get(n), self.getNeighbors(cur["id"])))
            unvisited = list(map(lambda n: {"parent":cur["id"], "id": n},unvisited))
            queue = queue + unvisited
        return trace
    def run(self):
        return self.dfs()
