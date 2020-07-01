class Algorithm:
    def __init__(self, name):
        self.name = name

class GraphAlgorithm(Algorithm):
    def __init__(self, name, nodes, edges):
        super(name)
        self.nodes = nodes
        self.edges = edges
        
    def getNeighbors(self, node):
        neighbors = list(filter(lambda e: e['from']==node ,self.edges))
        return neighbors

    def run(self):
        pass
    
class BFS(GraphAlgorithm):
    def __init__(self, nodes, edges, start, end):
        super('bfs', nodes, edges)
        self.start = start
        self.end = end
    def bfs(self):
        trace = []
        visited = {}
        queue = [self.start]
        while not queue:
            cur = queue.pop(0)
            visited[cur] = True
            trace.append(cur)
            if cur == self.end:
                break
            neighbors = self.getNeighbors(cur)
            unvisited = list(filter(lambda n: not visited[n] ,neighbors))
            queue = queue + unvisited
        return trace
    def run(self):
        self.bfs()

class DFS(GraphAlgorithm):
    def __init__(self, nodes, edges, start, end):
        super('dfs', nodes, edges)
        self.start = start
        self.end = end
    def dfs(self):
        trace = []
        visisted = {}
        stack = [self.start]
        while not stack:
            cur = queue.pop()
            visisted[cur] = True
            trace.append(cur)
            if cur == self.end:
                break
            neighbors = self.getNeighbors(cur)
            unvisited = list(filter(lambda n: not visited[n] ,neighbors))
            stack = stack + unvisited
        return trace
    def run(self):
        self.dfs()
