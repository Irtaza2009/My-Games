using UnityEngine;
using TMPro;

public class IslandManager : MonoBehaviour
{
    public GameObject islandTilePrefab;
    public int tileCost = 100;
    public float tileWidth = 5f; // Adjust based on your island tile width
    private int islandCount = 1;

    public TextMeshProUGUI islandText;

    private GameManager gameManager;
    private Camera mainCamera;

    void Start()
    {
        gameManager = FindObjectOfType<GameManager>();
        mainCamera = Camera.main;
        UpdateCameraSize();
    }

    public void BuyIslandTile()
    {
        if (gameManager.coinCount >= tileCost)
        {
            gameManager.coinCount -= tileCost;
            tileCost += 50;
             islandText.text = "Hatch Egg <br> Cost: " + tileCost  ;
            Vector3 newTilePosition = new Vector3(islandCount * tileWidth, 0, 0);
            Instantiate(islandTilePrefab, newTilePosition, Quaternion.identity);
            islandCount++;
            UpdateBoundaries();
            UpdateCameraSize();
        }
    }

  void UpdateBoundaries()
{
    // Update the boundaries based on the number of island tiles
    GameObject rightBoundary = GameObject.Find("RightBoundary");
    GameObject topBoundary = GameObject.Find("TopBoundary");
    GameObject bottomBoundary = GameObject.Find("BottomBoundary");
    
    if (rightBoundary != null)
    {
        rightBoundary.transform.position = new Vector3(islandCount * tileWidth - (tileWidth / 2), rightBoundary.transform.position.y, rightBoundary.transform.position.z);
    }

    if (topBoundary != null)
    {
        GameObject newTopBoundary = Instantiate(topBoundary, new Vector3(islandCount * tileWidth - (tileWidth / 2), topBoundary.transform.position.y, topBoundary.transform.position.z), Quaternion.identity);
        newTopBoundary.name = "TopBoundary_" + islandCount;
    }

    if (bottomBoundary != null)
    {
        GameObject newBottomBoundary = Instantiate(bottomBoundary, new Vector3(islandCount * tileWidth - (tileWidth / 2), bottomBoundary.transform.position.y, bottomBoundary.transform.position.z), Quaternion.identity);
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
