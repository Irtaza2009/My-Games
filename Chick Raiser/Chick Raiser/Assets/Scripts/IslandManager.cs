using UnityEngine;

public class IslandManager : MonoBehaviour
{
    public GameObject islandTilePrefab;
    public int tileCost = 100;
    public float tileWidth = 5f; // Adjust based on your island tile width
    private int islandCount = 1;

    private GameManager gameManager;

    void Start()
    {
        gameManager = FindObjectOfType<GameManager>();
    }

    public void BuyIslandTile()
    {
        if (gameManager.coinCount >= tileCost)
        {
            gameManager.coinCount -= tileCost;
            Vector3 newTilePosition = new Vector3(islandCount * tileWidth, 0, 0);
            Instantiate(islandTilePrefab, newTilePosition, Quaternion.identity);
            islandCount++;
            UpdateBoundaries();
        }
    }

    void UpdateBoundaries()
    {
        // Update the boundaries based on the number of island tiles
        GameObject rightBoundary = GameObject.Find("RightBoundary");
        if (rightBoundary != null)
        {
            rightBoundary.transform.position = new Vector3(islandCount * tileWidth - 3.7f, rightBoundary.transform.position.y, rightBoundary.transform.position.z);
        }
    }
}
