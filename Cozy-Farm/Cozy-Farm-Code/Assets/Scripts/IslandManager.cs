using UnityEngine;
using TMPro;

public class IslandManager : MonoBehaviour
{
    public GameObject islandTilePrefab;
    public int tileCost = 100;
    private int islandCount = 1;

    public TextMeshProUGUI islandText;

    private GameManager gameManager;
    private Camera mainCamera;
    private float tileWidth;
    private float tileHeight;

    void Start()
    {
        gameManager = FindObjectOfType<GameManager>();
        mainCamera = Camera.main;
        
        // Get the size of the prefab
        tileWidth = islandTilePrefab.GetComponent<Renderer>().bounds.size.x;
        tileHeight = islandTilePrefab.GetComponent<Renderer>().bounds.size.y;

        UpdateCameraSize();
    }

    public void BuyIslandTile()
    {
        if (gameManager.coinCount >= tileCost)
        {
            gameManager.coinCount -= tileCost;
            tileCost += 50;
            islandText.text = "Buy Island <br> Cost: " + tileCost;

            Vector3 newTilePosition = CalculateNewTilePosition();
            Instantiate(islandTilePrefab, newTilePosition, Quaternion.identity);
            islandCount++;
            UpdateBoundaries();
            UpdateCameraSize();
        }
    }

    Vector3 CalculateNewTilePosition()
    {
        // Calculate row and column for the new tile
        int row = islandCount / 2;
        int col = islandCount % 2;

        // Calculate the position based on the tile width and height
        Vector3 newPosition = new Vector3(col * tileWidth, -row * tileHeight, 0);
        return newPosition;
    }

    void UpdateBoundaries()
    {
        // Update the boundaries based on the number of island tiles
        GameObject rightBoundary = GameObject.Find("RightBoundary");
        GameObject topBoundary = GameObject.Find("TopBoundary");
        GameObject bottomBoundary = GameObject.Find("BottomBoundary");

        if (rightBoundary != null)
        {
            rightBoundary.transform.position = new Vector3((islandCount / 2) * tileWidth + tileWidth / 2, rightBoundary.transform.position.y, rightBoundary.transform.position.z);
        }

        if (topBoundary != null)
        {
            // Instantiate a new top boundary and position it correctly
            Vector3 newTopBoundaryPosition = new Vector3((islandCount / 2) * tileWidth , topBoundary.transform.position.y, topBoundary.transform.position.z);
            GameObject newTopBoundary = Instantiate(topBoundary, newTopBoundaryPosition, Quaternion.identity);
            newTopBoundary.name = "TopBoundary_" + islandCount;
        }

        if (bottomBoundary != null)
        {
            // Instantiate a new bottom boundary and position it correctly
            Vector3 newBottomBoundaryPosition = new Vector3((islandCount / 2) * tileWidth , bottomBoundary.transform.position.y, bottomBoundary.transform.position.z);
            GameObject newBottomBoundary = Instantiate(bottomBoundary, newBottomBoundaryPosition, Quaternion.identity);
            newBottomBoundary.name = "BottomBoundary_" + islandCount;
        }

        // Find all chicks and update their boundaries
        ChickMovement[] chicks = FindObjectsOfType<ChickMovement>();
        foreach (ChickMovement chick in chicks)
        {
            chick.UpdateBoundaries();
        }
    }

    void UpdateCameraSize()
    {
        // Calculate the new camera size based on the number of island tiles
        float newCameraSize = (islandCount * tileWidth) / 2f;
        mainCamera.orthographicSize = Mathf.Max(newCameraSize, mainCamera.orthographicSize);
        
        // Adjust camera position to keep the islands centered
        mainCamera.transform.position = new Vector3((islandCount * tileWidth - tileWidth) / 2f, mainCamera.transform.position.y, mainCamera.transform.position.z);
    }
}
