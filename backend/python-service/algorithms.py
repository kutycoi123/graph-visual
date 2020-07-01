class Algorithm:
    def __init__(self, name):
        self.name = name
        
class GraphNode:
    def __init__(self, id, neighbors):
        self.id = id
        self.neighbors = neighbors

class GraphAlgorithm(Algorithm):
    def __init__(self, name, nodes):
        super(name)
        self.nodes = nodes

    def run(self):
        pass
    
class BFS(GraphAlgorithm):
    def __init__(self, nodes,start, end):
        super('bfs', nodes)
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
            unvisited = list(filter(lambda n: not visited[n] ,cur.neighbors))
            queue = queue + unvisited
        return trace
    def run(self):
        self.bfs()

class DFS(GraphAlgorithm):
    def __init__(self, nodes, start, end):
        super('dfs', nodes)
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
            unvisited = list(filter(lambda n: not visited[n] ,cur.neighbors))
            stack = stack + unvisited
        return trace
    def run(self):
        self.dfs()
