import sys
from collections import namedtuple
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

Edge = namedtuple('Edge', ['fromNode', 'toNode'])
class Dijkstra(GraphAlgorithm):
    def __init__(self, nodes, edges, start):
        super().__init__('dijkstra', nodes)
        self.graph = {}
        self.edges = {}
        self.trace = []
        for node in nodes:
            self.graph[node["id"]] = node["neighbors"]     
        for edge in edges:
            self.edges[Edge(edge["from"], edge["to"])] = edge["weight"]
        self.start = start

    def minDist(self, dist, sptSet):
        minDist = sys.maxsize
        minNode = -1
        for node in dist:
            if dist[node]["dist"] < minDist and sptSet[node] == False:
                minDist = dist[node]["dist"]
                minNode = node
        return minNode
    def dijkstra(self):
        dist = {node:{"dist": sys.maxsize, "parent": -1} for node in self.graph}
        dist[self.start["id"]]["dist"] = 0
        sptSet = {node:False for node in self.graph}
        for _ in range(len(self.edges)):
            u = self.minDist(dist, sptSet)
            if u == -1:
                break
            parent = dist[u]["parent"]
            self.trace.append({"id":u,"status":"visited", "parent":parent})
            sptSet[u] = True
            for neighbor in self.graph[u]:
                self.trace.append({"id": neighbor, "status":"visiting", "parent": u})
                if sptSet[neighbor] == False and dist[neighbor]["dist"] > dist[u]["dist"] + self.edges[Edge(u, neighbor)]:
                    dist[neighbor]["dist"] = dist[u]["dist"] + self.edges[Edge(u,neighbor)]
                    dist[neighbor]["parent"] = u
        return self.trace
    def run(self):
        return self.dijkstra()

class GraphColoring(GraphAlgorithm):
    def __init__(self, nodes, nColors):
        super().__init__('coloring', nodes)
        self.variables = list(range(len(nodes)))
        self.graph = {}
        for node in nodes:
            self.graph[node["id"]] = node["neighbors"]
        self.domains = [x for x in range(nColors)]
        self.curr_domains = {var : list(self.domains) for var in self.variables}




    def assign(self, var, val, assignment):
        assignment[var] = val
        
    def unassign(self, var, assignment):
        if var in assignment:
            del assignment[var]
            
    def nConflicts(self, var, val, assignment):
        conflicted = 0
        for neighbor in self.graph[var]:
            if neighbor in assignment and assignment[neighbor] == val:
                conflicted += 1
        return conflicted
    
    def isConflicted(self, var, val, assignment):
        return self.nConflicts(var, val, assignment) > 0
    
    def isSatisfied(self, assignment):
        """Check if assignments does satisfy the problem constraint"""
        assignment = dict(assignment) # copy
        return len(assignment) == len(self.variables) and all(not self.isConflicted(var, assignment[var], assignment) for var in self.variables)
            

    def suppose(self, var, value):
        removals = [(var, val) for val in self.curr_domains[var] if val != value]
        self.curr_domains[var] = [value]
        return removals

    def prune(self, var, value, removals):
        self.curr_domains[var].remove(value)
        if removals:
            removals.append((var, value))

    def restore(self, removals):
        for var, val in removals:
            self.curr_domains[var].append(val)
            
    def mrv(self, assignment):
        pass
    
    def num_legal_assignments(self, var, assignment):
        return len(self.curr_domains[var])
    
    def fst_unassigned_var(self, assignment):
        for var in self.variables:
            if var not in assignment:
                return var
        return None

    def forward_checking_inference(self, var, value, assignment, removals):
        for neighbor in self.graph[var]:
            if neighbor not in assignment:
                for val in list(self.curr_domains[neighbor]):
                    if val == value:
                        self.prune(neighbor, val, removals)
                if not self.curr_domains[neighbor]:
                    return False
        return True
    
    def backtrack_search(self):
        def bt(assignment):
            if len(assignment) == len(self.variables):
                return assignment

            var = self.fst_unassigned_var(assignment)

            for val in self.curr_domains[var]:
                if not self.isConflicted(var, val, assignment):
                    self.assign(var, val, assignment)
                    removals = self.suppose(var, val)

                    if self.forward_checking_inference(var, val, assignment, removals):
                        res = bt(assignment)
                        if res is not None:
                            return res
                    self.restore(removals)
            self.unassign(var, assignment)
            return None

        assignment = {}
        solution = bt(assignment)

        if solution and self.isSatisfied(solution):
            return solution
        return None
        
                    
                    
                    
        
