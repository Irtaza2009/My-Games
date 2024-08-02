using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance; // Singleton instance
    public int coinCount = 0;
    public int eggCount = 0;
    public int workerCost = 50; // Cost to buy a worker
    public int hatchCost = 10;

    public TextMeshProUGUI coinText;
    public TextMeshProUGUI eggText;
    public TextMeshProUGUI hatchText;

    public GameObject chickPrefab;
    public GameObject eggPrefab;
    public GameObject workerPrefab; // Reference to the worker chicken prefab

    private void Awake()
    {
        Instance = this;
    }

    void Update()
    {
        coinText.text = "Coins: " + coinCount;
        eggText.text = "Eggs: " + eggCount;
    }

    public void AddCoin()
    {
        coinCount++;
        UpdateCoinUI();
    }

    public void SpendCoins(int amount)
    {
        coinCount -= amount;
        UpdateCoinUI();
    }

    void UpdateCoinUI()
    {
        coinText.text = "Coins: " + coinCount;
    }

    public void CollectEgg(GameObject egg)
    {
        eggCount++;
        UpdateEggUI();
        Destroy(egg);
    }

    void UpdateEggUI()
    {
        eggText.text = "Eggs: " + eggCount;
    }

    public void SellEggs()
    {
        coinCount += eggCount;
        eggCount = 0;
        UpdateCoinUI();
        UpdateEggUI();
    }

    public void HatchEgg()
    {
        if (eggCount > 0)
        {
            if (coinCount >= hatchCost)
            {
                coinCount -= hatchCost;
                hatchCost += 10;

                hatchText.text = "Hatch Egg <br> Cost: " + hatchCost;

                eggCount--;
                UpdateEggUI();
                AddHatchEgg();
            }
        }
    }

    public void AddHatchEgg()
    {
        Vector3 eggPosition = GetRandomPosition();
        GameObject egg = Instantiate(eggPrefab, eggPosition, Quaternion.identity);
    }

    public void BuyWorker()
    {
        if (coinCount >= workerCost)
        {
            coinCount -= workerCost;
            UpdateCoinUI();
            // Instantiate the worker chicken at a designated position
            Instantiate(workerPrefab, GetRandomPosition(), Quaternion.identity);
        }
    }

    Vector3 GetRandomPosition()
    {
        float minX = GameObject.Find("LeftBoundary").transform.position.x + 0.5f;
        float maxX = GameObject.Find("RightBoundary").transform.position.x - 0.5f;
        float minY = GameObject.Find("BottomBoundary").transform.position.y + 0.5f;
        float maxY = GameObject.Find("TopBoundary").transform.position.y - 0.5f;

        return new Vector3(Random.Range(minX, maxX), Random.Range(minY, maxY), -1);
    }
}
