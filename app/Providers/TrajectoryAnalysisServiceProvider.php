<?php
// app/Services/TrajectoryAnalysisService.php
namespace App\Services;

class TrajectoryAnalysisService
{
    /**
     * Run DBSCAN clustering algorithm on trajectory data
     */
    public function clusterWithDBSCAN($points, $eps = 0.5, $minPts = 5)
    {
        // Implementation of DBSCAN algorithm
        // For a real implementation, you might use a PHP library or call Python via process
        
        $clusters = [];
        $visited = [];
        $currentClusterId = 1;
        
        foreach ($points as $index => $point) {
            if (isset($visited[$index])) {
                continue;
            }
            
            $visited[$index] = true;
            $neighbors = $this->getNeighbors($points, $index, $eps);
            
            if (count($neighbors) < $minPts) {
                // Mark as noise
                continue;
            }
            
            $cluster = [$index];
            $this->expandCluster($points, $visited, $neighbors, $cluster, $eps, $minPts);
            
            $clusters[$currentClusterId] = $cluster;
            $currentClusterId++;
        }
        
        // Convert cluster indices to actual points
        $result = [];
        foreach ($clusters as $clusterId => $indices) {
            $clusterPoints = [];
            foreach ($indices as $index) {
                $clusterPoints[] = array_merge(
                    $points[$index], 
                    ['cluster_id' => $clusterId]
                );
            }
            $result[$clusterId] = $clusterPoints;
        }
        
        return $result;
    }
    
    /**
     * Get neighbors within eps distance
     */
    private function getNeighbors($points, $index, $eps)
    {
        $neighbors = [];
        $point = $points[$index];
        
        foreach ($points as $i => $otherPoint) {
            if ($i !== $index) {
                $distance = $this->calculateDistance($point, $otherPoint);
                if ($distance <= $eps) {
                    $neighbors[] = $i;
                }
            }
        }
        
        return $neighbors;
    }
    
    /**
     * Expand cluster by adding all density-connected points
     */
    private function expandCluster(&$points, &$visited, $neighbors, &$cluster, $eps, $minPts)
    {
        foreach ($neighbors as $index) {
            if (!isset($visited[$index])) {
                $visited[$index] = true;
                
                $newNeighbors = $this->getNeighbors($points, $index, $eps);
                
                if (count($newNeighbors) >= $minPts) {
                    foreach ($newNeighbors as $newIndex) {
                        if (!in_array($newIndex, $neighbors)) {
                            $neighbors[] = $newIndex;
                        }
                    }
                }
            }
            
            if (!in_array($index, $cluster)) {
                $cluster[] = $index;
            }
        }
    }
    
    /**
     * Calculate Euclidean distance between two points
     */
    private function calculateDistance($point1, $point2)
    {
        return sqrt(
            pow($point1['x'] - $point2['x'], 2) + 
            pow($point1['y'] - $point2['y'], 2)
        );
    }
    
    /**
     * Calculate cluster centroids
     */
    public function calculateCentroids($clusters)
    {
        $centroids = [];
        
        foreach ($clusters as $clusterId => $points) {
            $count = count($points);
            if ($count > 0) {
                $sumX = array_sum(array_column($points, 'x'));
                $sumY = array_sum(array_column($points, 'y'));
                
                $centroids[] = [
                    'id' => $clusterId,
                    'x' => $sumX / $count,
                    'y' => $sumY / $count,
                    'size' => $count
                ];
            }
        }
        
        return $centroids;
    }
}
