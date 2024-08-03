using UnityEngine;
using TMPro;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance; // Singleton instance

    public int coinCount = 0;
    public int eggCount = 0;
    public int milkCount = 0;
    public int workerCost = 50; // Cost to buy a worker
    public int hatchCost = 10;
    public int cowCost = 10;

    public TextMeshProUGUI coinText;
    public TextMeshProUGUI eggText;
    public TextMeshProUGUI milkText;
    public TextMeshProUGUI fruitText;
    public TextMeshProUGUI hatchText;
    public TextMeshProUGUI workerText;
    public TextMeshProUGUI buyCowText;

    public GameObject chickPrefab;
    public GameObject eggPrefab;
    public GameObject workerPrefab; // Reference to the worker chicken prefab
    public GameObject cowPrefab;
    public GameObject milkPrefab;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
           // DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Start()
    {
        LoadGameState();
    }

    void Update()
    {
        coinText.text = "Coins: " + coinCount;
        if (eggText != null) eggText.text = "Eggs: " + eggCount;
        if (milkText != null) milkText.text = "Milk Bottles: " + milkCount;
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
        if (eggText != null) eggText.text = "Eggs: " + eggCount;
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
        if (eggCount > 0 && coinCount >= hatchCost)
        {
            coinCount -= hatchCost;
            hatchCost += 10;
            eggCount--;
            UpdateEggUI();
            UpdateCoinUI();
            if (hatchText != null) hatchText.text = "Hatch Egg <br> Cost: " + hatchCost;
            AddHatchEgg();
        }
    }

    public void AddHatchEgg()
    {
        Vector3 eggPosition = GetRandomPosition();
        Instantiate(eggPrefab, eggPosition, Quaternion.identity);
    }

    public void BuyWorker()
    {
        if (coinCount >= workerCost)
        {
            coinCount -= workerCost;
            workerCost += 10;
            UpdateCoinUI();
            if (workerText != null) workerText.text = "Buy Worker <br> Cost: " + workerCost;
            Instantiate(workerPrefab, GetRandomPosition(), Quaternion.identity);
        }
    }

    public void BuyCow()
    {
        if (coinCount >= cowCost)
        {
            coinCount -= cowCost;
            cowCost += 10;
            UpdateCoinUI();
            if (buyCowText != null) buyCowText.text = "Buy Cow <br> Cost: " + cowCost;
            AddCow();
        }
    }

    public void AddCow()
    {
        Vector3 cowPosition = GetRandomPosition();
        Instantiate(cowPrefab, cowPosition, Quaternion.identity);
    }

    public void CollectMilk(GameObject milk)
    {
        milkCount++;
        UpdateMilkUI();
        Destroy(milk);
    }

     public void CollectFruit()
    {
        fruitCount++;
        UpdateFruitUI();
    }

    void UpdateMilkUI()
    {
        if (milkText != null) milkText.text = "Milk Bottles: " + milkCount;
    }

    void UpdateFruitUI() 
    {
        if (fruitText != null) fruitText.text = "Fruits: " + fruitCount;
    }

    public void SellMilk()
    {
        coinCount += milkCount;
        milkCount = 0;
        UpdateCoinUI();
        UpdateMilkUI();
    }

    Vector3 GetRandomPosition()
    {
        float minX = GameObject.Find("LeftBoundary").transform.position.x + 0.5f;
        float maxX = GameObject.Find("RightBoundary").transform.position.x - 0.5f;
        float minY = GameObject.Find("BottomBoundary").transform.position.y + 0.5f;
        float maxY = GameObject.Find("TopBoundary").transform.position.y - 0.5f;

        return new Vector3(Random.Range(minX, maxX), Random.Range(minY, maxY), -1);
    }

    public void SaveGameState()
    {
        PlayerPrefs.SetInt("CoinCount", coinCount);
        PlayerPrefs.SetInt("EggCount", eggCount);
        PlayerPrefs.SetInt("MilkCount", milkCount);
        PlayerPrefs.SetInt("WorkerCost", workerCost);
        PlayerPrefs.SetInt("HatchCost", hatchCost);
        PlayerPrefs.SetInt("CowCost", cowCost);
        PlayerPrefs.Save();
    }

    public void LoadGameState()
    {
        coinCount = PlayerPrefs.GetInt("CoinCount", 0);
        eggCount = PlayerPrefs.GetInt("EggCount", 0);
        milkCount = PlayerPrefs.GetInt("MilkCount", 0);
        workerCost = PlayerPrefs.GetInt("WorkerCost", 50);
        hatchCost = PlayerPrefs.GetInt("HatchCost", 10);
        cowCost = PlayerPrefs.GetInt("CowCost", 10);
    }
}
