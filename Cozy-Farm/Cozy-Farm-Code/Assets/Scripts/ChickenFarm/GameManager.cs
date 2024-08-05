using UnityEngine;
using TMPro;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance; // Singleton instance

    public int coinCount = 0;
    public int eggCount = 0;
    public int fruitCount = 0;
    public int milkCount = 0;
    public int workerCost = 20; // Cost to buy a worker
    public int hatchCost = 10;
    public int cowCost = 10;

    //private Leaderboard Leaderboard;
    private FirebaseLeaderboard firebaseLeaderboard;
    private DataSaver dataSaver;

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

    private List<GameObjectData> gameObjectDataList = new List<GameObjectData>();

    [System.Serializable]
    public class GameObjectData
    {
        public string type;
        public Vector3 position;
    }

    [System.Serializable]
    public class Serialization<T>
    {
        public List<T> items;
        public Serialization(List<T> items)
        {
            this.items = items;
        }
        public List<T> ToList()
        {
            return items;
        }
    }

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
        dataSaver = FindObjectOfType<DataSaver>();
        LoadGameState();
        //Leaderboard = FindObjectOfType<Leaderboard>();
        firebaseLeaderboard = FindObjectOfType<FirebaseLeaderboard>();
    }

    void Update()
    {
        coinText.text = coinCount.ToString();
        if (eggText != null) eggText.text = eggCount.ToString();
        if (milkText != null) milkText.text = milkCount.ToString();
        if (fruitText != null) fruitText.text = fruitCount.ToString();
    }

    public void AddCoin()
    {
        coinCount++;
        UpdateCoinUI();
        SaveGameState();
    }

    public void SpendCoins(int amount)
    {
        coinCount -= amount;
        UpdateCoinUI();
        SaveGameState();
    }

    void UpdateCoinUI()
    {
        coinText.text = coinCount.ToString();
        //Leaderboard.AddScore(coinCount);
        firebaseLeaderboard.AddScore(coinCount);
    }

    public void CollectEgg(GameObject egg)
    {
        eggCount++;
        UpdateEggUI();
        Destroy(egg);
        SaveGameState();
    }

    void UpdateEggUI()
    {
        if (eggText != null) eggText.text = eggCount.ToString();
    }

    public void SellEggs()
    {
        coinCount += eggCount;
        eggCount = 0;
        UpdateCoinUI();
        UpdateEggUI();
        SaveGameState();
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
            SaveGameState();
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
            SaveGameState();
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
            SaveGameState();
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
        SaveGameState();
    }

    public void CollectFruit()
    {
        fruitCount++;
        UpdateFruitUI();
        SaveGameState();
    }

    void UpdateMilkUI()
    {
        if (milkText != null) milkText.text = milkCount.ToString();
    }

    void UpdateFruitUI()
    {
        if (fruitText != null) fruitText.text = fruitCount.ToString();
    }

    public void SellMilk()
    {
        coinCount += milkCount;
        milkCount = 0;
        UpdateCoinUI();
        UpdateMilkUI();
        SaveGameState();
    }

    public void SellFruit()
    {
        coinCount += fruitCount;
        fruitCount = 0;
        UpdateCoinUI();
        UpdateFruitUI();
        SaveGameState();
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
        // Clear previous data
        gameObjectDataList.Clear();

        // Find and save all relevant objects
        SaveGameObjectsOfType("Worker", workerPrefab);
        SaveGameObjectsOfType("Cow", cowPrefab);
        SaveGameObjectsOfType("Chick", chickPrefab);
        // Add other types as needed...

        // Convert to JSON and save to PlayerPrefs
        string jsonData = JsonUtility.ToJson(new Serialization<GameObjectData>(gameObjectDataList));
        PlayerPrefs.SetString("GameObjectData", jsonData);

        // Save other game state data...
        PlayerPrefs.SetInt("CoinCount", coinCount);
        PlayerPrefs.SetInt("EggCount", eggCount);
        PlayerPrefs.SetInt("MilkCount", milkCount);
        PlayerPrefs.SetInt("WorkerCost", workerCost);
        PlayerPrefs.SetInt("HatchCost", hatchCost);
        PlayerPrefs.SetInt("CowCost", cowCost);
        PlayerPrefs.SetInt("FruitCount", fruitCount);
        PlayerPrefs.Save();

        // Save to Firebase
        dataSaver.SavePlayerData(eggCount, milkCount, fruitCount, coinCount, workerCost, hatchCost, cowCost);
    }

    private void SaveGameObjectsOfType(string type, GameObject prefab)
    {
        GameObject[] objects = GameObject.FindGameObjectsWithTag(type);
        foreach (GameObject obj in objects)
        {
            gameObjectDataList.Add(new GameObjectData
            {
                type = type,
                position = obj.transform.position
            });
        }
    }

    public void LoadGameState()
    {
        // Load other game state data...
        coinCount = PlayerPrefs.GetInt("CoinCount", 0);
        eggCount = PlayerPrefs.GetInt("EggCount", 0);
        milkCount = PlayerPrefs.GetInt("MilkCount", 0);
        workerCost = PlayerPrefs.GetInt("WorkerCost", 20);
        hatchCost = PlayerPrefs.GetInt("HatchCost", 10);
        cowCost = PlayerPrefs.GetInt("CowCost", 10);
        fruitCount = PlayerPrefs.GetInt("FruitCount", 0);

        // Load game objects
        string jsonData = PlayerPrefs.GetString("GameObjectData", string.Empty);
        if (!string.IsNullOrEmpty(jsonData))
        {
            gameObjectDataList = JsonUtility.FromJson<Serialization<GameObjectData>>(jsonData).ToList();
            foreach (GameObjectData data in gameObjectDataList)
            {
                GameObject prefab = GetPrefabByType(data.type);
                if (prefab != null)
                {
                    Instantiate(prefab, data.position, Quaternion.identity);
                }
            }
        }

        // Load from Firebase
        dataSaver.LoadPlayerData(playerData =>
        {
            if (playerData != null)
            {
                eggCount = playerData.eggCount;
                milkCount = playerData.milkCount;
                fruitCount = playerData.fruitCount;
                coinCount = playerData.coinCount;
                workerCost = playerData.workerCost;
                hatchCost = playerData.hatchCost;
                cowCost = playerData.cowCost;

                // Update UI
                UpdateCoinUI();
                UpdateEggUI();
                UpdateMilkUI();
                UpdateFruitUI();
                if (workerText != null) workerText.text = "Buy Worker <br> Cost: " + workerCost;
                if (hatchText != null) hatchText.text = "Hatch Egg <br> Cost: " + hatchCost;
                if (buyCowText != null) buyCowText.text = "Buy Cow <br> Cost: " + cowCost;
            }
        });
    }

    private GameObject GetPrefabByType(string type)
    {
        switch (type)
        {
            case "Worker":
                return workerPrefab;
            case "Cow":
                return cowPrefab;
            case "Chick":
                return chickPrefab;
            // Add other cases as needed...
            default:
                return null;
        }
    }
}
