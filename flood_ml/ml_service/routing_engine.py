# pyrefly: ignore [missing-import]
import osmnx as ox
import networkx as nx
from shapely.geometry import Point, Polygon
import json

def get_graph(lat, lon, dist=2000, network_type='drive'):
    """
    Fetch the road network graph for a given location and radius.
    """
    try:
        # For a hackathon, consider saving the graph locally and loading it to save time
        # G = ox.load_graphml("local_graph.graphml")
        G = ox.graph_from_point((lat, lon), dist=dist, network_type=network_type)
        
        # Add a default 'travel_time' edge attribute if not present
        G = ox.add_edge_speeds(G, fallback=40)
        G = ox.add_edge_travel_times(G)
        return G
    except Exception as e:
        print(f"Error fetching graph: {e}")
        return None

def apply_risk_weights(G, risk_zones, risk_multiplier=100.0):
    """
    Modifies edge weights in the graph based on risk zones.
    risk_zones: List of Shapely Polygons representing flood areas.
    """
    for u, v, key, data in G.edges(keys=True, data=True):
        # Default weight is travel time
        base_weight = data.get('travel_time', data.get('length', 1.0))
        data['risk_weighted_time'] = base_weight
        
        # If geometry is present, check intersection with risk zones
        if 'geometry' in data:
            edge_geom = data['geometry']
        else:
            # Create a line string from the nodes
            u_node = G.nodes[u]
            v_node = G.nodes[v]
            from shapely.geometry import LineString
            edge_geom = LineString([(u_node['x'], u_node['y']), (v_node['x'], v_node['y'])])
            
        is_risky = False
        for zone in risk_zones:
            if edge_geom.intersects(zone):
                is_risky = True
                break
                
        if is_risky:
            data['risk_weighted_time'] = base_weight * risk_multiplier

    return G

def calculate_route(G, start_coord, end_coord, weight='risk_weighted_time'):
    """
    Calculate the shortest path between start and end coordinates based on the given weight.
    """
    try:
        # Find nearest nodes
        orig = ox.distance.nearest_nodes(G, X=start_coord[1], Y=start_coord[0])
        dest = ox.distance.nearest_nodes(G, X=end_coord[1], Y=end_coord[0])
        
        # Calculate shortest path
        route = nx.shortest_path(G, orig, dest, weight=weight)
        
        # Calculate total distance and time manually since utils_graph is deprecated in osmnx v2
        route_length = 0
        route_time = 0
        risk_time = 0
        for i in range(len(route)-1):
            u = route[i]
            v = route[i+1]
            data = G.get_edge_data(u, v)[0] # MultiDiGraph, get first edge
            route_length += data.get('length', 0)
            route_time += data.get('travel_time', 0)
            risk_time += data.get('risk_weighted_time', 0)
        
        route_length = int(route_length)
        exposure = "High" if risk_time > route_time * 2 else "Low"

        # Get coordinates for the route
        route_coords = []
        for node in route:
            route_coords.append([G.nodes[node]['y'], G.nodes[node]['x']])
            
        return {
            "status": "success",
            "route_coords": route_coords,
            "distance_meters": route_length,
            "estimated_time_seconds": route_time,
            "exposure_level": exposure,
            "route_nodes": route
        }
    except Exception as e:
        print(f"Routing error: {e}")
        return {"status": "error", "message": str(e)}

def format_route_response(normal_route, safe_route):
    """
    Format output for the dashboard API.
    """
    return {
        "normal_route": normal_route,
        "recommended_safe_route": safe_route
    }
