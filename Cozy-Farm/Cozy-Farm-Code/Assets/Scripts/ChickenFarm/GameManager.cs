using UnityEngine;
using TMPro;
using System.Collections;
using System.Collections.Generic;

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
    public GameObject hatchEggPrefab;
    public GameObject workerPrefab;
    public GameObject cowPrefab;
    public GameObject milkPrefab;

    private List<GameObject> workers = new List<GameObject>();
    private List<GameObject> chicks = new List<GameObject>();
    private List<GameObject> cows = new List<GameObject>();

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            //DontDestroyOnLoad(gameObject); // Ensure this object persists across scenes
        }
        else
        {
            //Destroy(gameObject);
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
        GameObject chick = Instantiate(hatchEggPrefab, GetRandomPosition(), Quaternion.identity);
    }

    public void AddHatchedChick(GameObject chick)
    {
        chicks.Add(chick);
        SaveGameState();
    }

    public void BuyWorker()
    {
        if (coinCount >= workerCost)
        {
            coinCount -= workerCost;
            workerCost += 10;
            GameObject worker = Instantiate(workerPrefab, GetRandomPosition(), Quaternion.identity);
            workers.Add(worker);
            SaveGameState();
        }
    }

    public void BuyCow()
    {
        if (coinCount >= cowCost)
        {
            coinCount -= cowCost;
            cowCost += 10;
            GameObject cow = Instantiate(cowPrefab, GetRandomPosition(), Quaternion.identity);
            cows.Add(cow);
            SaveGameState();
        }
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
        List<Vector3> workerPositions = new List<Vector3>();
        foreach (var worker in workers)
        {
            if (worker != null)
            {
                workerPositions.Add(worker.transform.position);
            }
        }

        List<Vector3> chickPositions = new List<Vector3>();
        foreach (var chick in chicks)
        {
            if (chick != null)
            {
                chickPositions.Add(chick.transform.position);
            }
        }

        List<Vector3> cowPositions = new List<Vector3>();
        foreach (var cow in cows)
        {
            if (cow != null)
            {
                cowPositions.Add(cow.transform.position);
            }
        }

        PlayerData playerData = new PlayerData(PlayerPrefs.GetString("PlayerName", "Unknown"), eggCount, milkCount, fruitCount, coinCount, workerCost, cowCost, hatchCost, workerPositions, chickPositions, cowPositions);
        dataSaver.SavePlayerData(playerData);
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

                ClearAndInstantiateWorkers(playerData.workerPositions);
                ClearAndInstantiateChicks(playerData.chickPositions);
                ClearAndInstantiateCows(playerData.cowPositions);

                UpdateUI();
            }
        });
    }

    private void ClearAndInstantiateWorkers(List<Vector3> positions)
    {
        foreach (var worker in workers)
        {
            Destroy(worker);
        }
        workers.Clear();

        foreach (var position in positions)
        {
            GameObject worker = Instantiate(workerPrefab, position, Quaternion.identity);
            workers.Add(worker);
        }
    }

    private void ClearAndInstantiateChicks(List<Vector3> positions)
    {
        foreach (var chick in chicks)
        {
            Destroy(chick);
        }
        chicks.Clear();

        foreach (var position in positions)
        {
            GameObject chick = Instantiate(chickPrefab, position, Quaternion.identity);
            chicks.Add(chick);
        }
    }

    private void ClearAndInstantiateCows(List<Vector3> positions)
    {
        foreach (var cow in cows)
        {
            Destroy(cow);
        }
        cows.Clear();

        foreach (var position in positions)
        {
            GameObject cow = Instantiate(cowPrefab, position, Quaternion.identity);
            cows.Add(cow);
        }
    }
}
