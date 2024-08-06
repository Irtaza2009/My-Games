using UnityEngine;
using TMPro;
using System.Collections;

public class GameManager : MonoBehaviour
{

    public static GameManager Instance;

    public int coinCount;
    public int eggCount;
    public int fruitCount;
    public int milkCount;
    public int workerCost;
    public int hatchCost;
    public int cowCost;

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
    public GameObject workerPrefab;
    public GameObject cowPrefab;
    public GameObject milkPrefab;


    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            //DontDestroyOnLoad(gameObject); // Ensure this object persists across scenes
        }
        else
        {
           // Destroy(gameObject);
        }
    }

    void Start()
    {
        dataSaver = FindObjectOfType<DataSaver>();
        if (dataSaver != null)
        {
            StartCoroutine(LoadGameStateCoroutine());
        }
        else
        {
            Debug.LogError("DataSaver instance not found in the scene.");
        }
    }

    void Update()
    {
        UpdateUI();
    }

    public void AddCoin()
    {
        coinCount++;
        SaveGameState();
    }

    public void SpendCoins(int amount)
    {
        coinCount -= amount;
        SaveGameState();
    }

    public void CollectEgg(GameObject egg)
    {
        eggCount++;
        Destroy(egg);
        SaveGameState();
    }

    public void SellEggs()
    {
        coinCount += eggCount;
        eggCount = 0;
        SaveGameState();
    }

    public void HatchEgg()
    {
        if (eggCount > 0 && coinCount >= hatchCost)
        {
            coinCount -= hatchCost;
            hatchCost += 10;
            eggCount--;
            AddHatchEgg();
            SaveGameState();
        }
    }

    public void AddHatchEgg()
    {
        Instantiate(eggPrefab, GetRandomPosition(), Quaternion.identity);
    }

    public void BuyWorker()
    {
        if (coinCount >= workerCost)
        {
            coinCount -= workerCost;
            workerCost += 10;
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
            AddCow();
            SaveGameState();
        }
    }

    public void AddCow()
    {
        Instantiate(cowPrefab, GetRandomPosition(), Quaternion.identity);
    }

    public void CollectMilk(GameObject milk)
    {
        milkCount++;
        Destroy(milk);
        SaveGameState();
    }

    public void CollectFruit()
    {
        fruitCount++;
        SaveGameState();
    }

    public void SellMilk()
    {
        coinCount += milkCount;
        milkCount = 0;
        SaveGameState();
    }

    public void SellFruit()
    {
        coinCount += fruitCount;
        fruitCount = 0;
        SaveGameState();
    }

    void UpdateUI()
    {
        if (coinText != null) coinText.text = coinCount.ToString();
        if (eggText != null) eggText.text = eggCount.ToString();
        if (milkText != null) milkText.text = milkCount.ToString();
        if (fruitText != null) fruitText.text = fruitCount.ToString();
        if (hatchText != null) hatchText.text = "Hatch Egg <br> Cost: " + hatchCost;
        if (workerText != null) workerText.text = "Buy Worker <br> Cost: " + workerCost;
        if (buyCowText != null) buyCowText.text = "Buy Cow <br> Cost: " + cowCost;
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
        PlayerPrefs.SetInt("FruitCount", fruitCount);
        PlayerPrefs.Save();

        dataSaver.SavePlayerData(eggCount, milkCount, fruitCount, coinCount, workerCost, cowCost, hatchCost);
    }

    IEnumerator LoadGameStateCoroutine()
    {
        yield return new WaitUntil(() => dataSaver.IsInitialized);

        dataSaver.LoadPlayerData(playerData =>
        {
            if (playerData != null)
            {
                eggCount = playerData.eggCount;
                milkCount = playerData.milkCount;
                fruitCount = playerData.fruitCount;
                coinCount = playerData.coinCount;
                workerCost = playerData.workerCost;
                cowCost = playerData.cowCost;
                hatchCost = playerData.hatchCost;

                UpdateUI();
            }
        });
    }
}
